import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import AdminLayout from "../../layouts/AdminLayout";
import ProtectedRoute from "../../components/user/ProtectedRoute";
import couponApi from "../../api/couponApi";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import useToast from "../../hooks/useToast";
import { formatDate } from "../../utils/formatDate";

function AdminCouponsPage() {
  const { t } = useTranslation();
  const toast = useToast();

  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const [form, setForm] = useState({
    code: "",
    discountPercent: 10,
    expiresAt: "",
    usageLimit: 100,
    isActive: true,
  });

  const summary = useMemo(() => {
    return {
      total: coupons.length,
      active: coupons.filter((item) => item.isActive).length,
      inactive: coupons.filter((item) => !item.isActive).length,
      used: coupons.reduce((sum, item) => sum + Number(item.usedCount || 0), 0),
    };
  }, [coupons]);

  const loadCoupons = async () => {
    try {
      const response = await couponApi.getAll();
      setCoupons(response.data || []);
    } catch (error) {
      toast.error(
        t("coupon.loadFailed", "Load failed"),
        t("coupon.loadError", "Could not load coupons."),
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!form.code.trim()) {
      toast.error(
        t("coupon.missingCode", "Missing code"),
        t("coupon.enterCode", "Please enter a coupon code."),
      );
      return;
    }

    try {
      setCreating(true);

      const payload = {
        code: form.code.trim().toUpperCase(),
        discountPercent: Number(form.discountPercent),
        expiresAt: form.expiresAt || null,
        usageLimit: Number(form.usageLimit),
        isActive: form.isActive,
      };

      const response = await couponApi.create(payload);
      setCoupons((prev) => [response.data, ...prev]);

      toast.success(
        t("coupon.created", "Created"),
        t("coupon.createdSuccess", "Coupon created successfully."),
      );

      setForm({
        code: "",
        discountPercent: 10,
        expiresAt: "",
        usageLimit: 100,
        isActive: true,
      });
    } catch (error) {
      toast.error(
        t("coupon.createFailed", "Create failed"),
        error.response?.data?.message ||
          t("coupon.createError", "Could not create coupon."),
      );
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      t("coupon.deleteConfirm", "Delete this coupon?"),
    );

    if (!confirmed) return;

    try {
      await couponApi.remove(id);

      setCoupons((prev) => prev.filter((item) => item.id !== id));

      toast.success(
        t("coupon.deleted", "Deleted"),
        t("coupon.deletedSuccess", "Coupon removed successfully."),
      );
    } catch (error) {
      toast.error(
        t("coupon.deleteFailed", "Delete failed"),
        error.response?.data?.message ||
          t("coupon.deleteError", "Could not delete coupon."),
      );
    }
  };

  return (
    <ProtectedRoute adminOnly>
      <AdminLayout>
        <section className="page-shell admin-coupons-page">
          <div className="container">
            <div className="admin-coupons-hero card">
              <div>
                <span className="admin-page-badge">
                  {t("coupon.adminBadge", "Coupon Management")}
                </span>

                <h1 className="page-title">
                  {t("coupon.title", "Coupon Management")}
                </h1>

                <p className="page-subtitle">
                  {t(
                    "coupon.subtitle",
                    "Create and manage promotional discount codes for marketplace payments.",
                  )}
                </p>
              </div>
            </div>

            <div className="admin-coupon-summary-grid">
              <div className="card admin-coupon-summary-card">
                <span>{t("coupon.totalCoupons", "Total Coupons")}</span>
                <strong>{summary.total}</strong>
              </div>

              <div className="card admin-coupon-summary-card success">
                <span>{t("coupon.activeCoupons", "Active")}</span>
                <strong>{summary.active}</strong>
              </div>

              <div className="card admin-coupon-summary-card warning">
                <span>{t("coupon.inactiveCoupons", "Inactive")}</span>
                <strong>{summary.inactive}</strong>
              </div>

              <div className="card admin-coupon-summary-card">
                <span>{t("coupon.totalUsed", "Total Used")}</span>
                <strong>{summary.used}</strong>
              </div>
            </div>

            <form className="card coupon-admin-form" onSubmit={handleCreate}>
              <div className="coupon-form-header">
                <div>
                  <h2>{t("coupon.createNew", "Create New Coupon")}</h2>
                  <p>
                    {t(
                      "coupon.createHint",
                      "Set discount percentage, usage limit, expiration date, and status.",
                    )}
                  </p>
                </div>
              </div>

              <div className="coupon-form-grid">
                <div className="form-group">
                  <label>{t("coupon.code", "Code")}</label>
                  <input
                    className="input"
                    name="code"
                    placeholder="GREEN10"
                    value={form.code}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>{t("coupon.discount", "Discount %")}</label>
                  <input
                    className="input"
                    name="discountPercent"
                    type="number"
                    min="1"
                    max="100"
                    value={form.discountPercent}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>{t("coupon.expiresAt", "Expires At")}</label>
                  <input
                    className="input"
                    name="expiresAt"
                    type="datetime-local"
                    value={form.expiresAt}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>{t("coupon.usageLimit", "Usage Limit")}</label>
                  <input
                    className="input"
                    name="usageLimit"
                    type="number"
                    min="1"
                    value={form.usageLimit}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="coupon-form-bottom">
                <label className="coupon-toggle-row">
                  <div>
                    <span>{t("coupon.status", "Status")}</span>
                    <small>
                      {form.isActive
                        ? t("coupon.active", "Active")
                        : t("coupon.inactive", "Inactive")}
                    </small>
                  </div>

                  <div className="toggle-switch">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={form.isActive}
                      onChange={handleChange}
                    />
                    <span className="toggle-slider"></span>
                  </div>
                </label>

                <button
                  className="btn btn-primary"
                  type="submit"
                  disabled={creating}
                >
                  {creating
                    ? t("coupon.creating", "Creating...")
                    : t("coupon.createButton", "Create Coupon")}
                </button>
              </div>
            </form>

            {loading ? (
              <Loader text={t("coupon.loading", "Loading coupons...")} />
            ) : coupons.length === 0 ? (
              <EmptyState
                title={t("coupon.noCoupons", "No coupons")}
                description={t(
                  "coupon.noCouponsDesc",
                  "Create your first coupon to start offering discounts.",
                )}
              />
            ) : (
              <div className="coupon-admin-list">
                {coupons.map((coupon) => {
                  const isActive = coupon.isActive !== false;

                  return (
                    <div key={coupon.id} className="card coupon-admin-card">
                      <div className="coupon-code-block">
                        <span
                          className={`coupon-status-badge ${
                            isActive ? "active" : "inactive"
                          }`}
                        >
                          {isActive
                            ? t("coupon.active", "Active")
                            : t("coupon.inactive", "Inactive")}
                        </span>

                        <h3>{coupon.code}</h3>

                        <p>
                          {t("coupon.expiresAt", "Expires At")}:{" "}
                          <strong>
                            {coupon.expiresAt
                              ? formatDate(coupon.expiresAt)
                              : "—"}
                          </strong>
                        </p>
                      </div>

                      <div className="coupon-info-grid">
                        <div>
                          <span>{t("coupon.discount", "Discount")}</span>
                          <strong>{coupon.discountPercent}%</strong>
                        </div>

                        <div>
                          <span>{t("coupon.usage", "Usage")}</span>
                          <strong>
                            {coupon.usedCount || 0} / {coupon.usageLimit || 0}
                          </strong>
                        </div>
                      </div>

                      <div className="coupon-card-actions">
                        <button
                          type="button"
                          className="btn btn-outline btn-danger-outline"
                          onClick={() => handleDelete(coupon.id)}
                        >
                          {t("common.delete", "Delete")}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </AdminLayout>
    </ProtectedRoute>
  );
}

export default AdminCouponsPage;
