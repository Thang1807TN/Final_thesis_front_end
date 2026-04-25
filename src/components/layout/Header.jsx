import { useState, useRef, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useAuth from "../../hooks/useAuth";
import LanguageSwitcher from "../common/LanguageSwitcher";

function Header() {
  const { t } = useTranslation();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const userMenuRef = useRef(null);

  const closeMenu = () => {
    setMenuOpen(false);
    setUserMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    closeMenu();
    logout();
  };

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="brand" onClick={closeMenu}>
          <div className="brand-logo">G</div>

          <div className="brand-text">
            <h1>GreenMarket</h1>
            <p>{t("common.subtitle", "Second-hand marketplace")}</p>
          </div>
        </Link>

        <button
          className={`header-menu-btn ${menuOpen ? "active" : ""}`}
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <span />
          <span />
          <span />
        </button>

        <div className={`header-nav-panel ${menuOpen ? "open" : ""}`}>
          <nav className="nav-links">
            <NavLink to="/products" className="nav-link" onClick={closeMenu}>
              {t("common.products", "Products")}
            </NavLink>

            {isAuthenticated && (
              <>
                <NavLink
                  to="/transactions"
                  className="nav-link"
                  onClick={closeMenu}
                >
                  {t("common.transactions", "Transactions")}
                </NavLink>

                <NavLink
                  to="/payments/history"
                  className="nav-link"
                  onClick={closeMenu}
                >
                  {t("common.payments", "Payments")}
                </NavLink>

                <NavLink to="/inbox" className="nav-link" onClick={closeMenu}>
                  {t("common.inbox", "Inbox")}
                </NavLink>

                <NavLink
                  to="/wishlist"
                  className="nav-link"
                  onClick={closeMenu}
                >
                  {t("common.wishlist", "Wishlist")}
                </NavLink>

                <NavLink
                  to="/my-products"
                  className="nav-link"
                  onClick={closeMenu}
                >
                  {t("common.myListings", "My Listings")}
                </NavLink>
              </>
            )}

            {isAdmin && (
              <NavLink to="/admin" className="nav-link" onClick={closeMenu}>
                {t("common.admin", "Admin")}
              </NavLink>
            )}
          </nav>

          <div className="header-actions">
            <LanguageSwitcher />

            {isAuthenticated ? (
              <div className="header-user-menu" ref={userMenuRef}>
                <button
                  type="button"
                  className="header-user"
                  onClick={() => setUserMenuOpen((prev) => !prev)}
                >
                  <span className="header-user-avatar">
                    {(user?.fullName || "U").charAt(0).toUpperCase()}
                  </span>

                  <div>
                    <span className="header-user-hi">
                      {t("common.hi", "Hi")},
                    </span>
                    <strong>
                      {user?.fullName || t("common.user", "User")}
                    </strong>
                  </div>
                </button>

                {userMenuOpen && (
                  <div className="header-dropdown">
                    <Link to="/profile" onClick={closeMenu}>
                      {t("common.profile", "Profile")}
                    </Link>

                    <button type="button" onClick={handleLogout}>
                      {t("common.logout", "Logout")}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="btn btn-outline"
                  onClick={closeMenu}
                >
                  {t("common.login", "Login")}
                </Link>

                <Link
                  to="/register"
                  className="btn btn-primary"
                  onClick={closeMenu}
                >
                  {t("common.register", "Register")}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
