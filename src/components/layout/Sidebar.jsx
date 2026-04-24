import { NavLink } from "react-router-dom";

function Sidebar({ items = [] }) {
  return (
    <aside className="card dashboard-sidebar">
      <nav className="dashboard-sidebar-nav">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `dashboard-sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
