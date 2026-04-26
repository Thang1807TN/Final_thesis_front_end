import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import AdminLayout from "../../layouts/AdminLayout";
import ProtectedRoute from "../../components/user/ProtectedRoute";
import adminAnalyticsApi from "../../api/adminAnalyticsApi";
import Loader from "../../components/common/Loader";
import AdminOverviewCharts from "../../components/admin/AdminOverviewCharts";

function AdminDashboardPage() {
  const { t } = useTranslation();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const response = await adminAnalyticsApi.get();
        setData(response.data);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  const stats = useMemo(() => {
    const users = data?.usersByMonth || [];
    const listings = data?.listingsByCategory || [];
    const transactions = data?.transactionsByStatus || [];
    const reports = data?.reportsByStatus || [];

    return {
      users: users.reduce((sum, item) => sum + Number(item.value || 0), 0),
      listings: listings.reduce(
        (sum, item) => sum + Number(item.value || 0),
        0,
      ),
      transactions: transactions.reduce(
        (sum, item) => sum + Number(item.value || 0),
        0,
      ),
      reports: reports.reduce((sum, item) => sum + Number(item.value || 0), 0),
    };
  }, [data]);

  return (
    <ProtectedRoute adminOnly>
      <AdminLayout>
        <section className="page-shell admin-dashboard-page">
          <div className="container">
            <div className="admin-dashboard-hero card">
              <div>
                <span className="admin-page-badge">
                  {t("admin.panel", "Admin Panel")}
                </span>

                <h1 className="page-title">
                  {t("admin.dashboardTitle", "Admin Dashboard")}
                </h1>

                <p className="page-subtitle">
                  {t(
                    "admin.dashboardSubtitle",
                    "Overview of users, listings, transactions, reports, and revenue.",
                  )}
                </p>
              </div>

              <div className="admin-dashboard-actions">
                <Link className="btn btn-outline" to="/admin/products">
                  {t("common.products", "Products")}
                </Link>

                <Link className="btn btn-outline" to="/admin/users">
                  {t("admin.users", "Users")}
                </Link>

                <Link className="btn btn-outline" to="/admin/transactions">
                  {t("common.transactions", "Transactions")}
                </Link>

                <Link className="btn btn-outline" to="/admin/payments">
                  {t("common.payments", "Payments")}
                </Link>
              </div>
            </div>

            {loading ? (
              <Loader
                text={t("admin.loadingAnalytics", "Loading analytics...")}
              />
            ) : (
              <>
                <div className="admin-dashboard-stats">
                  <div className="card admin-dashboard-stat-card">
                    <span>Total Users</span>
                    <strong>{stats.users}</strong>
                    <p>Registered accounts</p>
                  </div>

                  <div className="card admin-dashboard-stat-card">
                    <span>Listings</span>
                    <strong>{stats.listings}</strong>
                    <p>Products by category</p>
                  </div>

                  <div className="card admin-dashboard-stat-card">
                    <span>Transactions</span>
                    <strong>{stats.transactions}</strong>
                    <p>Marketplace orders</p>
                  </div>

                  <div className="card admin-dashboard-stat-card">
                    <span>Reports</span>
                    <strong>{stats.reports}</strong>
                    <p>User/product reports</p>
                  </div>
                </div>

                <div className="admin-dashboard-chart-card card">
                  <AdminOverviewCharts data={data} />
                </div>
              </>
            )}
          </div>
        </section>
      </AdminLayout>
    </ProtectedRoute>
  );
}

export default AdminDashboardPage;
