import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import ProtectedRoute from "../../components/user/ProtectedRoute";
import adminAnalyticsApi from "../../api/adminAnalyticsApi";
import Loader from "../../components/common/Loader";
import AdminOverviewCharts from "../../components/admin/AdminOverviewCharts";

function AdminDashboardPage() {
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

  return (
    <ProtectedRoute adminOnly>
      <AdminLayout>
        <section className="page-shell">
          <div className="container">
            <div className="page-title-row">
              <div>
                <h1 className="page-title">Admin Dashboard</h1>
                <p className="page-subtitle">
                  Overview of users, listings, transactions, reports, and
                  revenue.
                </p>
              </div>

              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <Link className="btn btn-outline" to="/admin/products">
                  Products
                </Link>
                <Link className="btn btn-outline" to="/admin/users">
                  Users
                </Link>
                <Link className="btn btn-outline" to="/admin/transactions">
                  Transactions
                </Link>
                <Link className="btn btn-outline" to="/admin/payments">
                  Payments
                </Link>
              </div>
            </div>

            {loading ? (
              <Loader text="Loading analytics..." />
            ) : (
              <AdminOverviewCharts data={data} />
            )}
          </div>
        </section>
      </AdminLayout>
    </ProtectedRoute>
  );
}

export default AdminDashboardPage;
