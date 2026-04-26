import { useTranslation } from "react-i18next";

function ProfileCard({ user }) {
  const { t } = useTranslation();

  return (
    <div className="card profile-card">
      <div className="profile-avatar">
        {(user?.fullName || "U").charAt(0).toUpperCase()}
      </div>

      <div>
        <h3>{user?.fullName || t("profile.unknownUser", "Unknown User")}</h3>

        <p className="muted">
          {user?.email || t("profile.noEmail", "No email")}
        </p>

        <span className="badge" style={{ marginTop: "12px" }}>
          {user?.role || t("profile.defaultRole", "User")}
        </span>
      </div>
    </div>
  );
}

export default ProfileCard;
