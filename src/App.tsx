import { HashRouter as Router, Route, Routes } from "react-router-dom";
// ... tus otras importaciones

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      {/* Añadimos basename="/" explícitamente */}
      <Router basename="/">
        <AuthProvider>
          <CartProvider>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/categoria/:slug" element={<Category />} />
                <Route path="/producto/:slug" element={<ProductDetail />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </CartProvider>
        </AuthProvider>
      </Router>
    </TooltipProvider>
  </QueryClientProvider>
);