import { Routes, Route } from "react-router-dom";

import HomePage from "../pages/Home/HomePage";
import LoginPage from "../pages/Auth/LoginPage";
import RegisterPage from "../pages/Auth/RegisterPage";

import ProductListPage from "../pages/Products/ProductListPage";
import ProductDetailPage from "../pages/Products/ProductDetailPage";
import CreateProductPage from "../pages/Products/CreateProductPage";
import EditProductPage from "../pages/Products/EditProductPage";
import MyProductsPage from "../pages/Products/MyProductsPage";

import CheckoutPage from "../pages/Transactions/CheckoutPage";
import TransactionListPage from "../pages/Transactions/TransactionListPage";
import TransactionDetailPage from "../pages/Transactions/TransactionDetailPage";

import PaymentPage from "../pages/Payments/PaymentPage";
import PaymentHistoryPage from "../pages/Payments/PaymentHistoryPage";

import InboxPage from "../pages/Chats/InboxPage";
import WishlistPage from "../pages/Favorites/WishlistPage";
import ProfilePage from "../pages/Profile/ProfilePage";
import SellerPublicProfilePage from "../pages/Seller/SellerPublicProfilePage";

import AdminDashboardPage from "../pages/Admin/AdminDashboardPage";
import AdminProductsPage from "../pages/Admin/AdminProductsPage";
import AdminUsersPage from "../pages/Admin/AdminUsersPage";
import AdminTransactionsPage from "../pages/Admin/AdminTransactionsPage";
import AdminPaymentsPage from "../pages/Admin/AdminPaymentsPage";
import AdminReportsPage from "../pages/Admin/AdminReportsPage";
import AdminCouponsPage from "../pages/Admin/AdminCouponsPage";
import AdminEmailLogsPage from "../pages/Admin/AdminEmailLogsPage";

import NotFoundPage from "../pages/NotFound/NotFoundPage";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="/products" element={<ProductListPage />} />
      <Route path="/products/:id" element={<ProductDetailPage />} />
      <Route path="/products/create" element={<CreateProductPage />} />
      <Route path="/products/edit/:id" element={<EditProductPage />} />
      <Route path="/my-products" element={<MyProductsPage />} />

      <Route path="/checkout/:id" element={<CheckoutPage />} />
      <Route path="/transactions" element={<TransactionListPage />} />
      <Route path="/transactions/:id" element={<TransactionDetailPage />} />

      <Route path="/payments" element={<PaymentPage />} />
      <Route path="/payments/history" element={<PaymentHistoryPage />} />

      <Route path="/inbox" element={<InboxPage />} />
      <Route path="/wishlist" element={<WishlistPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/seller/:sellerId" element={<SellerPublicProfilePage />} />

      <Route path="/admin" element={<AdminDashboardPage />} />
      <Route path="/admin/products" element={<AdminProductsPage />} />
      <Route path="/admin/users" element={<AdminUsersPage />} />
      <Route path="/admin/transactions" element={<AdminTransactionsPage />} />
      <Route path="/admin/payments" element={<AdminPaymentsPage />} />
      <Route path="/admin/reports" element={<AdminReportsPage />} />
      <Route path="/admin/coupons" element={<AdminCouponsPage />} />
      <Route path="/admin/email-logs" element={<AdminEmailLogsPage />} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;
