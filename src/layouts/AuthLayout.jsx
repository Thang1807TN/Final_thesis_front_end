import { Link } from "react-router-dom";

function AuthLayout({ children }) {
  return (
    <div className="auth-shell">
      <div className="auth-layout-wrap">
        <Link to="/" className="auth-top-brand">
          <div className="brand-logo">G</div>
          <div className="brand-text">
            <h1>GreenMarket</h1>
            <p>Second-hand marketplace</p>
          </div>
        </Link>

        {children}
      </div>
    </div>
  );
}

export default AuthLayout;
