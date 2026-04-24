import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import ProtectedRoute from "../../components/user/ProtectedRoute";
import userApi from "../../api/userApi";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";

function AdminUsersPage() {
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
            <h1 className="page-title">Admin Users</h1>

            {loading ? (
              <Loader text="Loading users..." />
            ) : users.length === 0 ? (
              <EmptyState
                title="No users"
                description="There are no users in the system."
              />
            ) : (
              <div className="admin-table">
                <div className="admin-table-head admin-table-row admin-table-row-4">
                  <div>Full Name</div>
                  <div>Email</div>
                  <div>Role</div>
                  <div>Created</div>
                </div>

                {users.map((item) => (
                  <div
                    key={item.id}
                    className="admin-table-row admin-table-row-4"
                  >
                    <div>{item.fullName}</div>
                    <div>{item.email}</div>
                    <div>{item.role}</div>
                    <div>{new Date(item.createdAt).toLocaleDateString()}</div>
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
