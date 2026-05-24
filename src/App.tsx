import { HashRouter as Router, Route, Routes } from "react-router-dom";
// ... (resto de tus importaciones)

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Router>
        <AuthProvider>
          <CartProvider>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/categoria/:slug" element={<Category />} />
                <Route path="/producto/:slug" element={<ProductDetail />} />
                {/* ... resto de rutas */}
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </CartProvider>
        </AuthProvider>
      </Router>
    </TooltipProvider>
  </QueryClientProvider>
);