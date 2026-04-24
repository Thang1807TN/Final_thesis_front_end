import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import ProtectedRoute from "../../components/user/ProtectedRoute";
import reportApi from "../../api/reportApi";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import useToast from "../../hooks/useToast";

function AdminReportsPage() {
  const toast = useToast();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadReports = async () => {
    try {
      const response = await reportApi.getAll();
      setReports(response.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      const response = await reportApi.updateStatus(id, { status });
      setReports((prev) =>
        prev.map((item) => (item.id === id ? response.data : item)),
      );
      toast.success("Updated", "Report status updated successfully.");
    } catch (error) {
      toast.error(
        "Update failed",
        error.response?.data?.message || "Could not update report.",
      );
    }
  };

  return (
    <ProtectedRoute adminOnly>
      <MainLayout>
        {loading ? (
          <Loader text="Loading reports..." />
        ) : (
          <section className="page-shell">
            <div className="container">
              <h1 className="page-title">Admin Reports</h1>

              {reports.length === 0 ? (
                <EmptyState
                  title="No reports found"
                  description="There are no reports in the system."
                />
              ) : (
                <div className="report-list">
                  {reports.map((report) => (
                    <div key={report.id} className="card report-card">
                      <div className="report-card-top">
                        <div>
                          <h3>{report.reason}</h3>
                          <p className="muted">
                            Reporter: {report.reporterName}
                          </p>
                          {report.productTitle && (
                            <p className="muted">
                              Product: {report.productTitle}
                            </p>
                          )}
                          {report.reportedUserName && (
                            <p className="muted">
                              Reported User: {report.reportedUserName}
                            </p>
                          )}
                        </div>

                        <select
                          className="input admin-status-select"
                          value={report.status}
                          onChange={(e) =>
                            handleStatusChange(report.id, e.target.value)
                          }
                        >
                          <option value="Pending">Pending</option>
                          <option value="Reviewed">Reviewed</option>
                          <option value="Resolved">Resolved</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </div>

                      <p className="report-description">
                        {report.description || "No extra description provided."}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}
      </MainLayout>
    </ProtectedRoute>
  );
}

export default AdminReportsPage;
