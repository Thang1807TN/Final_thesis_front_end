import { useTranslation } from "react-i18next";

function AdminUserTable({ users = [] }) {
  const { t, i18n } = useTranslation();

  const formatDate = (dateValue) => {
    if (!dateValue) return "N/A";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) return "N/A";

    return date.toLocaleDateString(i18n.language);
  };

  return (
    <div className="admin-table-wrapper">
      <div className="admin-users-table">
        <div className="admin-users-row admin-users-head">
          <div>{t("admin.fullName", "Full Name")}</div>
          <div>{t("auth.email", "Email")}</div>
          <div>{t("admin.role", "Role")}</div>
          <div>{t("admin.created", "Created")}</div>
        </div>

        {users.map((item) => {
          const role = item.role || item.Role || "User";

          return (
            <div key={item.id || item.email} className="admin-users-row">
              <div className="admin-cell-text">
                {item.fullName || item.FullName || "N/A"}
              </div>

              <div
                className="admin-cell-text admin-email-cell"
                title={item.email || item.Email}
              >
                {item.email || item.Email || "N/A"}
              </div>

              <div>
                <span
                  className={`admin-role-badge ${
                    role === "Admin" ? "admin" : "user"
                  }`}
                >
                  {role}
                </span>
              </div>

              <div className="admin-cell-text">
                {formatDate(item.createdAt || item.CreatedAt)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AdminUserTable;
