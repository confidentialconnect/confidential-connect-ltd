import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Categories from "./pages/Categories";
import Products from "./pages/Products";
import Product from "./pages/Product";
import Wishlist from "./pages/Wishlist";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Search from "./pages/Search";
import { CartProvider } from "./contexts/CartContext";
import { AuthProvider } from "./contexts/AuthContext";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Payments from "./pages/Payments";
import PaymentInfo from "./pages/PaymentInfo";
import AdminHome from "./pages/AdminHome";
import AdminOrders from "./pages/AdminOrders";
import Auth from "./pages/Auth";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Advertising from "./pages/Advertising";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";
import FAQ from "./pages/FAQ";
import Pricing from "./pages/Pricing";
import Dashboard from "./pages/Dashboard";
import ServiceRequest from "./pages/ServiceRequest";
import PromotionPayment from "./pages/PromotionPayment";
import AdminPromotionPayments from "./pages/AdminPromotionPayments";
import AdminUsers from "./pages/AdminUsers";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/search" element={<Search />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product/:id" element={<Product />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-success" element={<OrderSuccess />} />
              <Route path="/payments" element={<Payments />} />
              <Route path="/payment-info" element={<PaymentInfo />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/request-service" element={<ServiceRequest />} />
              <Route path="/promote/:plan" element={<PromotionPayment />} />
              <Route path="/admin" element={<AdminHome />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
              <Route path="/admin/promotions" element={<AdminPromotionPayments />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/advertising" element={<Advertising />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsConditions />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/pricing" element={<Pricing />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
