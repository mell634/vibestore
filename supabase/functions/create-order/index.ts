import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SHIPPING_COST = 6.95;

interface ItemReq {
  productId: string;
  variantId: string;
  quantity: number;
}

interface ShippingReq {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  notes?: string;
}

interface CardReq {
  holder: string;
  last4: string;
  brand?: string;
}

function bad(message: string, status = 400) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return bad("Method not allowed", 405);

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  // Validate auth from the caller's JWT
  const authHeader = req.headers.get("Authorization") ?? "";
  const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
  });
  const { data: userData, error: userErr } = await userClient.auth.getUser();
  if (userErr || !userData?.user) return bad("No autenticado", 401);
  const user = userData.user;

  let body: any;
  try {
    body = await req.json();
  } catch {
    return bad("JSON inválido");
  }

  const items: ItemReq[] = body?.items;
  const shipping: ShippingReq = body?.shipping;
  const method: string = body?.method;
  const proofPath: string | null = body?.proofPath ?? null;
  const card: CardReq | null = body?.card ?? null;

  if (!Array.isArray(items) || items.length === 0) return bad("Carrito vacío");
  if (items.length > 50) return bad("Demasiados artículos");
  if (!shipping || typeof shipping !== "object") return bad("Faltan datos de envío");
  if (method !== "tarjeta" && method !== "transferencia") return bad("Método de pago no soportado");
  if (method === "transferencia" && (!proofPath || typeof proofPath !== "string")) {
    return bad("Falta el comprobante de la transferencia");
  }
  if (method === "tarjeta") {
    if (!card || typeof card !== "object") return bad("Faltan datos de la tarjeta");
    if (typeof card.holder !== "string" || card.holder.trim().length < 2) return bad("Nombre del titular inválido");
    if (typeof card.last4 !== "string" || !/^\d{4}$/.test(card.last4)) return bad("Tarjeta inválida");
  }

  // Light shipping validation (mirrors client schema)
  const sFields = ["fullName", "email", "phone", "address", "city", "country"] as const;
  for (const f of sFields) {
    if (!shipping[f] || typeof shipping[f] !== "string" || shipping[f].trim().length < 2) {
      return bad(`Campo de envío inválido: ${f}`);
    }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shipping.email)) return bad("Email inválido");
  if (!/^\d{10}$/.test(shipping.phone)) return bad("Teléfono inválido");

  // Normalize items
  const normalized = items.map((it) => ({
    productId: String(it.productId ?? ""),
    variantId: String(it.variantId ?? ""),
    quantity: Number(it.quantity ?? 0),
  }));
  for (const it of normalized) {
    if (!it.productId || !it.variantId) return bad("Producto inválido en el carrito");
    if (!Number.isInteger(it.quantity) || it.quantity <= 0 || it.quantity > 99) {
      return bad("Cantidad inválida");
    }
  }

  // Admin client (service role) for trusted reads/writes
  const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  // Verify the uploaded proof actually belongs to this user's folder (bank transfer only)
  if (method === "transferencia") {
    const expectedPrefix = `${user.id}/`;
    if (!proofPath!.startsWith(expectedPrefix)) return bad("Comprobante no autorizado", 403);
    const { data: fileMeta } = await admin.storage
      .from("payment-proofs")
      .list(user.id, { search: proofPath!.slice(expectedPrefix.length) });
    if (!fileMeta || fileMeta.length === 0) return bad("Comprobante no encontrado", 400);
  }

  // Fetch authoritative product + variant data
  const productIds = Array.from(new Set(normalized.map((i) => i.productId)));
  const variantIds = Array.from(new Set(normalized.map((i) => i.variantId)));

  const [{ data: products, error: pErr }, { data: variants, error: vErr }] = await Promise.all([
    admin.from("products").select("id, name, price, active").in("id", productIds),
    admin.from("product_variants").select("id, product_id, size, stock").in("id", variantIds),
  ]);
  if (pErr || vErr) return bad("Error leyendo catálogo", 500);

  const productMap = new Map((products ?? []).map((p: any) => [p.id, p]));
  const variantMap = new Map((variants ?? []).map((v: any) => [v.id, v]));

  // Pull a primary image per product (best-effort)
  const { data: imgs } = await admin
    .from("product_images")
    .select("product_id, url, display_order")
    .in("product_id", productIds)
    .order("display_order", { ascending: true });
  const imageMap = new Map<string, string>();
  for (const im of imgs ?? []) {
    if (!imageMap.has(im.product_id)) imageMap.set(im.product_id, im.url);
  }

  // Validate each line and compute totals server-side
  let subtotal = 0;
  const orderItems: any[] = [];
  for (const it of normalized) {
    const product = productMap.get(it.productId) as any;
    const variant = variantMap.get(it.variantId) as any;
    if (!product || !product.active) return bad("Producto no disponible");
    if (!variant || variant.product_id !== it.productId) return bad("Variante inválida");
    if (variant.stock < it.quantity) return bad(`Sin stock suficiente para ${product.name}`);
    const unitPrice = Number(product.price);
    const lineTotal = +(unitPrice * it.quantity).toFixed(2);
    subtotal += lineTotal;
    orderItems.push({
      product_id: it.productId,
      product_name: product.name,
      product_image: imageMap.get(it.productId) ?? null,
      size: variant.size,
      quantity: it.quantity,
      unit_price: unitPrice,
      line_total: lineTotal,
    });
  }
  subtotal = +subtotal.toFixed(2);
  const total = +(subtotal + SHIPPING_COST).toFixed(2);

  // Create order
  const { data: order, error: oErr } = await admin
    .from("orders")
    .insert({
      user_id: user.id,
      subtotal,
      shipping_cost: SHIPPING_COST,
      total,
      payment_method: method,
      contact_email: shipping.email,
      contact_phone: shipping.phone,
      shipping_full_name: shipping.fullName,
      shipping_address: shipping.address,
      shipping_city: shipping.city,
      shipping_country: shipping.country,
      notes: shipping.notes ?? null,
    })
    .select()
    .single();
  if (oErr || !order) {
    console.error("order insert error", oErr);
    return bad("No se pudo crear el pedido", 500);
  }

  const { error: iErr } = await admin
    .from("order_items")
    .insert(orderItems.map((oi) => ({ ...oi, order_id: order.id })));
  if (iErr) {
    console.error("order_items insert error", iErr);
    await admin.from("orders").delete().eq("id", order.id);
    return bad("No se pudieron crear los artículos del pedido", 500);
  }

  const { error: payErr } = await admin.from("payments").insert({
    order_id: order.id,
    method,
    amount: total,
    proof_url: method === "transferencia" ? proofPath : null,
    reference: method === "tarjeta" && card
      ? `SIMULATED-${(card.brand ?? "CARD").toUpperCase()}-****${card.last4}`
      : null,
    status: method === "tarjeta" ? "verificado" : "pendiente_verificacion",
  });
  if (payErr) {
    console.error("payment insert error", payErr);
    return bad("No se pudo registrar el pago", 500);
  }

  return new Response(
    JSON.stringify({ orderId: order.id, orderNumber: order.order_number }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
});