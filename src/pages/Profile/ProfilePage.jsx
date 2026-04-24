import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import ProtectedRoute from "../../components/user/ProtectedRoute";
import userApi from "../../api/userApi";
import Loader from "../../components/common/Loader";
import ProfileCard from "../../components/user/ProfileCard";
import useToast from "../../hooks/useToast";

function ProfilePage() {
  const toast = useToast();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await userApi.getProfile();
        setProfile(response.data);
        setForm({
          fullName: response.data.fullName || "",
          email: response.data.email || "",
        });
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      const response = await userApi.updateProfile(form);
      setProfile(response.data);
      localStorage.setItem("user", JSON.stringify(response.data));
      toast.success("Saved", "Profile updated successfully.");
    } catch (error) {
      toast.error(
        "Update failed",
        error.response?.data?.message || "Could not update profile.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <section className="page-shell">
          <div className="container">
            {loading ? (
              <Loader text="Loading profile..." />
            ) : (
              <div className="profile-page-grid">
                <ProfileCard user={profile} />

                <div className="card profile-edit-card">
                  <h1 className="page-title">My Profile</h1>
                  <p className="page-subtitle">
                    Update your account information.
                  </p>

                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label>Full Name</label>
                      <input
                        className="input"
                        value={form.fullName}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            fullName: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label>Email</label>
                      <input
                        className="input"
                        value={form.email}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <button className="btn btn-primary" disabled={saving}>
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </section>
      </MainLayout>
    </ProtectedRoute>
  );
}

export default ProfilePage;
