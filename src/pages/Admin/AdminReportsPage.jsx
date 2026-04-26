import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import MainLayout from "../../layouts/MainLayout";
import ProtectedRoute from "../../components/user/ProtectedRoute";
import reportApi from "../../api/reportApi";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import useToast from "../../hooks/useToast";

function AdminReportsPage() {
  const { t, i18n } = useTranslation();
  const toast = useToast();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const statusOptions = ["Pending", "Reviewed", "Resolved", "Rejected"];

  const loadReports = async () => {
    try {
      const response = await reportApi.getAll();
      setReports(response.data || []);
    } catch (error) {
      console.error(error);
      toast.error(
        t("reports.loadFailed", "Load failed"),
        t("reports.loadError", "Could not load reports."),
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const getStatusLabel = (status) => {
    const key = String(status || "").toLowerCase();

    const map = {
      pending: t("status.pending", "Pending"),
      reviewed: t("status.reviewed", "Reviewed"),
      resolved: t("status.resolved", "Resolved"),
      rejected: t("status.rejected", "Rejected"),
    };

    return map[key] || status || "N/A";
  };

  const filteredReports = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    return reports.filter((report) => {
      const matchesStatus =
        statusFilter === "All" || report.status === statusFilter;

      const matchesKeyword =
        !keyword ||
        report.reason?.toLowerCase().includes(keyword) ||
        report.description?.toLowerCase().includes(keyword) ||
        report.reporterName?.toLowerCase().includes(keyword) ||
        report.productTitle?.toLowerCase().includes(keyword) ||
        report.reportedUserName?.toLowerCase().includes(keyword);

      return matchesStatus && matchesKeyword;
    });
  }, [reports, searchTerm, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: reports.length,
      pending: reports.filter((item) => item.status === "Pending").length,
      resolved: reports.filter((item) => item.status === "Resolved").length,
      rejected: reports.filter((item) => item.status === "Rejected").length,
    };
  }, [reports]);

  const handleStatusChange = async (id, status) => {
    try {
      setUpdatingId(id);

      const response = await reportApi.updateStatus(id, { status });

      setReports((prev) =>
        prev.map((item) => (item.id === id ? response.data : item)),
      );

      toast.success(
        t("reports.updated", "Updated"),
        t("reports.statusUpdated", "Report status updated successfully."),
      );
    } catch (error) {
      toast.error(
        t("reports.updateFailed", "Update failed"),
        error.response?.data?.message ||
          t("reports.updateError", "Could not update report."),
      );
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <ProtectedRoute adminOnly>
      <MainLayout>
        <section className="page-shell admin-reports-page">
          <div className="container">
            <div className="admin-reports-hero card">
              <div>
                <span className="admin-reports-eyebrow">
                  {t("reports.moderationCenter", "Moderation Center")}
                </span>

                <h1 className="page-title">
                  {t("reports.adminTitle", "Admin Reports")}
                </h1>

                <p className="page-subtitle">
                  {t(
                    "reports.adminSubtitle",
                    "Review product and user reports submitted by marketplace users.",
                  )}
                </p>
              </div>

              <button className="btn btn-outline" onClick={loadReports}>
                {t("common.refresh", "Refresh")}
              </button>
            </div>

            {loading ? (
              <Loader text={t("reports.loading", "Loading reports...")} />
            ) : (
              <>
                <div className="admin-report-stats-grid">
                  <div className="card admin-report-stat">
                    <span>{t("reports.total", "Total")}</span>
                    <strong>{stats.total}</strong>
                  </div>

                  <div className="card admin-report-stat">
                    <span>{t("status.pending", "Pending")}</span>
                    <strong>{stats.pending}</strong>
                  </div>

                  <div className="card admin-report-stat">
                    <span>{t("status.resolved", "Resolved")}</span>
                    <strong>{stats.resolved}</strong>
                  </div>

                  <div className="card admin-report-stat">
                    <span>{t("status.rejected", "Rejected")}</span>
                    <strong>{stats.rejected}</strong>
                  </div>
                </div>

                <div className="card admin-report-toolbar">
                  <div className="input-group">
                    <label className="input-label">
                      {t("reports.search", "Search reports")}
                    </label>
                    <input
                      className="input-field"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder={t(
                        "reports.searchPlaceholder",
                        "Search by reason, product, reporter, user...",
                      )}
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">
                      {t("reports.filterStatus", "Filter status")}
                    </label>
                    <select
                      className="input-field"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="All">{t("common.all", "All")}</option>
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {getStatusLabel(status)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {filteredReports.length === 0 ? (
                  <EmptyState
                    title={t("reports.emptyTitle", "No reports found")}
                    description={t(
                      "reports.emptyDescription",
                      "There are no matching reports in the system.",
                    )}
                  />
                ) : (
                  <div className="admin-report-list">
                    {filteredReports.map((report) => {
                      const statusKey = String(
                        report.status || "Pending",
                      ).toLowerCase();

                      return (
                        <article
                          key={report.id}
                          className="card admin-report-card"
                        >
                          <div className="admin-report-card-top">
                            <div className="admin-report-icon">!</div>

                            <div className="admin-report-main">
                              <div className="admin-report-title-row">
                                <h3>{report.reason || "No reason"}</h3>

                                <span
                                  className={`admin-report-status admin-report-status-${statusKey}`}
                                >
                                  {getStatusLabel(report.status)}
                                </span>
                              </div>

                              <div className="admin-report-meta">
                                <span>
                                  {t("reports.reporter", "Reporter")}:{" "}
                                  <strong>
                                    {report.reporterName || "N/A"}
                                  </strong>
                                </span>

                                {report.productTitle && (
                                  <span>
                                    {t("reports.product", "Product")}:{" "}
                                    <strong>{report.productTitle}</strong>
                                  </span>
                                )}

                                {report.reportedUserName && (
                                  <span>
                                    {t("reports.reportedUser", "Reported User")}
                                    : <strong>{report.reportedUserName}</strong>
                                  </span>
                                )}
                              </div>
                            </div>

                            <select
                              className="input-field admin-report-status-select"
                              value={report.status || "Pending"}
                              disabled={updatingId === report.id}
                              onChange={(e) =>
                                handleStatusChange(report.id, e.target.value)
                              }
                            >
                              {statusOptions.map((status) => (
                                <option key={status} value={status}>
                                  {getStatusLabel(status)}
                                </option>
                              ))}
                            </select>
                          </div>

                          <p className="admin-report-description">
                            {report.description ||
                              t(
                                "reports.noDescription",
                                "No extra description provided.",
                              )}
                          </p>

                          <div className="admin-report-footer">
                            <span>
                              {report.createdAt
                                ? new Date(report.createdAt).toLocaleString(
                                    i18n.language,
                                  )
                                : "N/A"}
                            </span>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </MainLayout>
    </ProtectedRoute>
  );
}

export default AdminReportsPage;
