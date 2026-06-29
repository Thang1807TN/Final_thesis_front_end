import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import AdminLayout from "../../layouts/AdminLayout";
import ProtectedRoute from "../../components/user/ProtectedRoute";
import adminAnalyticsApi from "../../api/adminAnalyticsApi";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import SummaryCard from "../../components/admin/SummaryCard";
import AdminOverviewCharts from "../../components/admin/AdminOverviewCharts";

function AdminDashboardPage() {
  const { t } = useTranslation();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const response = await adminAnalyticsApi.get();
      setData(response.data);
    } catch (error) {
      console.error("Load analytics failed:", error);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const normalizeChartItems = (items) => {
    if (!Array.isArray(items)) return [];

    return items.map((item) => ({
      name: item.name || item.Name || "Unknown",
      value: Number(item.value ?? item.Value ?? 0),
    }));
  };

  const chartData = useMemo(() => {
    return {
      usersByMonth: normalizeChartItems(
        data?.usersByMonth || data?.UsersByMonth,
      ),
      listingsByCategory: normalizeChartItems(
        data?.listingsByCategory || data?.ListingsByCategory,
      ),
      transactionsByStatus: normalizeChartItems(
        data?.transactionsByStatus || data?.TransactionsByStatus,
      ),
      reportsByStatus: normalizeChartItems(
        data?.reportsByStatus || data?.ReportsByStatus,
      ),
    };
  }, [data]);

  const stats = useMemo(() => {
    const sumValues = (items) =>
      items.reduce((sum, item) => sum + Number(item.value || 0), 0);

    return {
      users: sumValues(chartData.usersByMonth),
      listings: sumValues(chartData.listingsByCategory),
      transactions: sumValues(chartData.transactionsByStatus),
      reports: sumValues(chartData.reportsByStatus),
    };
  }, [chartData]);

  const hasData =
    stats.users > 0 ||
    stats.listings > 0 ||
    stats.transactions > 0 ||
    stats.reports > 0;

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
                    "Overview of users, listings, transactions, reports, and system activity.",
                  )}
                </p>
              </div>

              <button className="btn btn-outline" onClick={loadAnalytics}>
                {t("common.refresh", "Refresh")}
              </button>
            </div>

            {loading ? (
              <Loader
                text={t("admin.loadingAnalytics", "Loading analytics...")}
              />
            ) : !hasData ? (
              <EmptyState
                title={t("admin.noAnalytics", "No analytics data")}
                description={t(
                  "admin.noAnalyticsDesc",
                  "There is no dashboard data available yet.",
                )}
              />
            ) : (
              <>
                <div className="admin-summary-grid">
                  <SummaryCard
                    title={t("admin.totalUsers", "Total Users")}
                    value={stats.users}
                    note={t("admin.totalUsersNote", "Registered accounts")}
                    icon="👤"
                  />

                  <SummaryCard
                    title={t("admin.listings", "Listings")}
                    value={stats.listings}
                    note={t("admin.listingsNote", "Products by category")}
                    icon="📦"
                  />

                  <SummaryCard
                    title={t("admin.transactions", "Transactions")}
                    value={stats.transactions}
                    note={t("admin.transactionsNote", "Marketplace orders")}
                    icon="💳"
                  />

                  <SummaryCard
                    title={t("admin.reports", "Reports")}
                    value={stats.reports}
                    note={t("admin.reportsNote", "User and product reports")}
                    icon="⚠️"
                  />
                </div>

                <AdminOverviewCharts data={chartData} />
              </>
            )}
          </div>
        </section>
      </AdminLayout>
    </ProtectedRoute>
  );
}

export default AdminDashboardPage;
