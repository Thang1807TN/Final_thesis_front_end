import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import AdminLayout from "../../layouts/AdminLayout";
import ProtectedRoute from "../../components/user/ProtectedRoute";
import AdminUserTable from "../../components/admin/AdminUserTable";
import userApi from "../../api/userApi";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";

function AdminUsersPage() {
  const { t } = useTranslation();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await userApi.getAllUsers();
        setUsers(response.data || []);
      } catch (error) {
        console.error("Load users failed:", error);
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
              <AdminUserTable users={users} />
            )}
          </div>
        </section>
      </AdminLayout>
    </ProtectedRoute>
  );
}

export default AdminUsersPage;
