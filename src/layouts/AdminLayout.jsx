import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Sidebar from "../components/layout/Sidebar";
import { useTranslation } from "react-i18next";

function AdminLayout({ children }) {
  const { t } = useTranslation();

  const sidebarItems = [
    { to: "/admin", label: t("admin.dashboard", "Dashboard") },
    { to: "/admin/products", label: t("common.products", "Products") },
    { to: "/admin/users", label: t("admin.users", "Users") },
    {
      to: "/admin/transactions",
      label: t("common.transactions", "Transactions"),
    },
    { to: "/admin/payments", label: t("common.payments", "Payments") },

    { to: "/admin/coupons", label: t("coupon.title", "Coupons") },

    { to: "/admin/reports", label: t("admin.reports", "Reports") },
    { to: "/admin/email-logs", label: t("admin.emailLogs", "Email Logs") },
  ];

  return (
    <>
      <Header />

      <main className="admin-layout-main">
        <div className="admin-layout-grid">
          <Sidebar items={sidebarItems} />

          <div className="admin-layout-content">{children}</div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default AdminLayout;
