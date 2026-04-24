function ProfileCard({ user }) {
  return (
    <div className="card profile-card">
      <div className="profile-avatar">
        {(user?.fullName || "U").charAt(0).toUpperCase()}
      </div>

      <div>
        <h3>{user?.fullName || "Unknown User"}</h3>
        <p className="muted">{user?.email || "No email"}</p>
        <span className="badge" style={{ marginTop: "12px" }}>
          {user?.role || "User"}
        </span>
      </div>
    </div>
  );
}

export default ProfileCard;
