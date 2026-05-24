import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const signInSchema = z.object({
  email: z.string().trim().email("Email inválido").max(255),
  password: z.string().min(6, "Mínimo 6 caracteres").max(100),
});

const signUpSchema = signInSchema.extend({
  fullName: z.string().trim().min(2, "Tu nombre, por favor").max(100),
});

export default function Auth() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const initialTab = params.get("tab") === "signup" ? "signup" : "signin";
  const redirect = params.get("redirect") || "/cuenta";
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate(redirect, { replace: true });
  }, [user, navigate, redirect]);

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const result = signInSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });
    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: result.data.email,
      password: result.data.password,
    });
    setLoading(false);
    if (error) {
      toast.error(
        error.message === "Invalid login credentials"
          ? "Credenciales incorrectas"
          : error.message === "Email not confirmed"
          ? "Ese correo todavía no estaba listo. Crea tu cuenta de nuevo y entrarás al instante."
          : error.message
      );
      return;
    }
    toast.success("Bienvenida de vuelta");
    navigate(redirect);
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const result = signUpSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
      fullName: formData.get("fullName"),
    });
    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: result.data.email,
      password: result.data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/cuenta`,
        data: { full_name: result.data.fullName },
      },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message.includes("already") ? "Este email ya está registrado" : error.message);
      return;
    }
    toast.success("Cuenta creada. Ya puedes comprar de inmediato.");
    navigate(redirect);
  };

  return (
    <div className="container py-16 md:py-24 max-w-md">
      <div className="text-center mb-10">
        <div className="text-[10px] tracking-editorial uppercase text-muted-foreground mb-2">Acceso</div>
        <h1 className="font-display text-4xl md:text-5xl">Tu cuenta</h1>
      </div>

      <Tabs defaultValue={initialTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="signin">Entrar</TabsTrigger>
          <TabsTrigger value="signup">Crear cuenta</TabsTrigger>
        </TabsList>

        <TabsContent value="signin">
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <Label htmlFor="si-email">Email</Label>
              <Input id="si-email" name="email" type="email" required className="h-12 mt-1" />
            </div>
            <div>
              <Label htmlFor="si-password">Contraseña</Label>
              <Input id="si-password" name="password" type="password" required className="h-12 mt-1" />
            </div>
            <Button type="submit" className="w-full h-12" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="signup">
          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <Label htmlFor="su-name">Nombre completo</Label>
              <Input id="su-name" name="fullName" required className="h-12 mt-1" />
            </div>
            <div>
              <Label htmlFor="su-email">Email</Label>
              <Input id="su-email" name="email" type="email" required className="h-12 mt-1" />
            </div>
            <div>
              <Label htmlFor="su-password">Contraseña</Label>
              <Input id="su-password" name="password" type="password" required minLength={6} className="h-12 mt-1" />
            </div>
            <Button type="submit" className="w-full h-12" disabled={loading}>
              {loading ? "Creando..." : "Crear cuenta"}
            </Button>
          </form>
        </TabsContent>
      </Tabs>

      <p className="text-center text-xs text-muted-foreground mt-8">
        <Link to="/" className="hover:text-foreground">← Volver a la tienda</Link>
      </p>
    </div>
  );
}
