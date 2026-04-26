import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import AdminLayout from "../../layouts/AdminLayout";
import ProtectedRoute from "../../components/user/ProtectedRoute";
import userApi from "../../api/userApi";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";

function AdminUsersPage() {
  const { t, i18n } = useTranslation();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await userApi.getAllUsers();
        setUsers(response.data || []);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  return (
    <ProtectedRoute adminOnly>
      <AdminLayout>
        <section className="page-shell">
          <div className="container">
            <h1 className="page-title">
              {t("admin.usersTitle", "Admin Users")}
            </h1>

            {loading ? (
              <Loader text={t("admin.loadingUsers", "Loading users...")} />
            ) : users.length === 0 ? (
              <EmptyState
                title={t("admin.noUsers", "No users")}
                description={t(
                  "admin.noUsersDesc",
                  "There are no users in the system.",
                )}
              />
            ) : (
              <div className="admin-table">
                <div className="admin-table-head admin-table-row admin-table-row-4">
                  <div>{t("admin.fullName", "Full Name")}</div>
                  <div>{t("auth.email", "Email")}</div>
                  <div>{t("admin.role", "Role")}</div>
                  <div>{t("admin.created", "Created")}</div>
                </div>

                {users.map((item) => (
                  <div
                    key={item.id}
                    className="admin-table-row admin-table-row-4"
                  >
                    <div>{item.fullName}</div>
                    <div>{item.email}</div>
                    <div>{item.role}</div>
                    <div>
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString(
                            i18n.language,
                          )
                        : "N/A"}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </AdminLayout>
    </ProtectedRoute>
  );
}

export default AdminUsersPage;
