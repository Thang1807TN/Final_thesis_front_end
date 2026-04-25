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
      } catch (error) {
        toast.error("Load failed", "Could not load profile.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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

                <div className="card profile-form-card">
                  <h1 className="page-title">My Profile</h1>
                  <p className="page-subtitle">
                    Update your account information.
                  </p>

                  <form className="profile-form" onSubmit={handleSubmit}>
                    <div className="input-group">
                      <label className="input-label">Full Name</label>
                      <input
                        className="input-field"
                        name="fullName"
                        value={form.fullName}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="input-group">
                      <label className="input-label">Email</label>
                      <input
                        className="input-field"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                      />
                    </div>

                    <button
                      className="btn btn-primary"
                      type="submit"
                      disabled={saving}
                    >
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
