import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter as Router, Route, Routes } from "react-router-dom"; // <--- CAMBIO AQUÍ
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { Layout } from "./components/Layout";
import Home from "./pages/Home";
import Category from "./pages/Category";
import ProductDetail from "./pages/ProductDetail";
import Auth from "./pages/Auth";
import Account from "./pages/Account";
import Checkout from "./pages/Checkout";
import OrderDetail from "./pages/OrderDetail";
import Admin from "./pages/Admin";
import Search from "./pages/Search";
import NotFound from "./pages/NotFound.tsx";
import { AdminRoute } from "./components/AdminRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Router> {/* <--- USAMOS EL ROUTER CAMBIADO */}
        <AuthProvider>
          <CartProvider>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/categoria/:slug" element={<Category />} />
                <Route path="/producto/:slug" element={<ProductDetail />} />
                <Route path="/buscar" element={<Search />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/cuenta" element={<Account />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/pedido/:id" element={<OrderDetail />} />
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <Admin />
                    </AdminRoute>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </CartProvider>
        </AuthProvider>
      </Router>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;