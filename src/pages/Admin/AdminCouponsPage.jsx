import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import ProtectedRoute from "../../components/user/ProtectedRoute";
import couponApi from "../../api/couponApi";
import Loader from "../../components/common/Loader";
import useToast from "../../hooks/useToast";

function AdminCouponsPage() {
  const toast = useToast();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    code: "",
    discountPercent: 10,
    expiresAt: "",
    usageLimit: 100,
    isActive: true,
  });

  const loadCoupons = async () => {
    try {
      const response = await couponApi.getAll();
      setCoupons(response.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      const response = await couponApi.create(form);
      setCoupons((prev) => [response.data, ...prev]);
      toast.success("Created", "Coupon created successfully.");
      setForm({
        code: "",
        discountPercent: 10,
        expiresAt: "",
        usageLimit: 100,
        isActive: true,
      });
    } catch (error) {
      toast.error(
        "Create failed",
        error.response?.data?.message || "Could not create coupon.",
      );
    }
  };

  const handleDelete = async (id) => {
    try {
      await couponApi.remove(id);
      setCoupons((prev) => prev.filter((item) => item.id !== id));
      toast.success("Deleted", "Coupon removed successfully.");
    } catch (error) {
      toast.error(
        "Delete failed",
        error.response?.data?.message || "Could not delete coupon.",
      );
    }
  };

  return (
    <ProtectedRoute adminOnly>
      <MainLayout>
        <section className="page-shell">
          <div className="container">
            <h1 className="page-title">Coupon Management</h1>

            <form className="card coupon-admin-form" onSubmit={handleCreate}>
              <div className="form-grid">
                <input
                  className="input"
                  placeholder="Code"
                  value={form.code}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, code: e.target.value }))
                  }
                />
                <input
                  className="input"
                  type="number"
                  placeholder="Discount %"
                  value={form.discountPercent}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      discountPercent: Number(e.target.value),
                    }))
                  }
                />
                <input
                  className="input"
                  type="datetime-local"
                  value={form.expiresAt}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, expiresAt: e.target.value }))
                  }
                />
                <input
                  className="input"
                  type="number"
                  placeholder="Usage limit"
                  value={form.usageLimit}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      usageLimit: Number(e.target.value),
                    }))
                  }
                />
              </div>

              <button className="btn btn-primary" style={{ marginTop: "14px" }}>
                Create Coupon
              </button>
            </form>

            {loading ? (
              <Loader text="Loading coupons..." />
            ) : (
              <div className="coupon-admin-list">
                {coupons.map((coupon) => (
                  <div key={coupon.id} className="card coupon-admin-card">
                    <div>
                      <h3>{coupon.code}</h3>
                      <p className="muted">
                        Discount: {coupon.discountPercent}%
                      </p>
                      <p className="muted">
                        Usage: {coupon.usedCount || 0} /{" "}
                        {coupon.usageLimit || 0}
                      </p>
                    </div>

                    <button
                      className="btn btn-outline btn-danger-outline"
                      onClick={() => handleDelete(coupon.id)}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </MainLayout>
    </ProtectedRoute>
  );
}

export default AdminCouponsPage;
