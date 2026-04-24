import { Link, NavLink } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import LanguageSwitcher from "../common/LanguageSwitcher";

function Header() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="brand">
          <div className="brand-logo">G</div>
          <div className="brand-text">
            <h1>GreenMarket</h1>
            <p>Second-hand marketplace</p>
          </div>
        </Link>

        <nav className="nav-links">
          <NavLink to="/products" className="nav-link">
            Products
          </NavLink>

          {!isAuthenticated && (
            <>
              <NavLink to="/transactions" className="nav-link">
                Transactions
              </NavLink>
              <NavLink to="/payments/history" className="nav-link">
                Payments
              </NavLink>
              <NavLink to="/inbox" className="nav-link">
                Inbox
              </NavLink>
              <NavLink to="/wishlist" className="nav-link">
                Wishlist
              </NavLink>
              <NavLink to="/my-products" className="nav-link">
                My Listings
              </NavLink>
              <NavLink to="/profile" className="nav-link">
                Profile
              </NavLink>
            </>
          )}

          {isAdmin && (
            <NavLink to="/admin" className="nav-link">
              Admin
            </NavLink>
          )}
        </nav>

        <div className="header-actions">
          <LanguageSwitcher />

          {isAuthenticated ? (
            <>
              <span className="muted">Hi, {user?.fullName}</span>
              <button className="btn btn-outline" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
