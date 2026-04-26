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

  const navItems = [
    {
      to: "/products",
      label: t("common.products", "Products"),
      show: true,
    },
    {
      to: "/transactions",
      label: t("common.transactions", "Transactions"),
      show: isAuthenticated,
    },
    {
      to: "/payments/history",
      label: t("common.payments", "Payments"),
      show: isAuthenticated,
    },
    {
      to: "/inbox",
      label: t("common.inbox", "Inbox"),
      show: isAuthenticated,
    },
    {
      to: "/wishlist",
      label: t("common.wishlist", "Wishlist"),
      show: isAuthenticated,
    },
    {
      to: "/my-products",
      label: t("common.myListings", "My Listings"),
      show: isAuthenticated,
    },
    {
      to: "/admin",
      label: t("common.admin", "Admin"),
      show: isAdmin,
    },
  ];

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
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>

        <div className={`header-nav-panel ${menuOpen ? "open" : ""}`}>
          <nav className="nav-links">
            {navItems
              .filter((item) => item.show)
              .map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className="nav-link"
                  onClick={closeMenu}
                  title={item.label}
                >
                  {item.label}
                </NavLink>
              ))}
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

                  <div className="header-user-info">
                    <span>{t("common.hi", "Hi")}</span>
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
              <div className="header-auth-actions">
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
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
