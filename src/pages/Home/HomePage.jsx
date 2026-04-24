import { Link } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";

function HomePage() {
  return (
    <MainLayout>
      <section className="hero">
        <div className="container hero-box">
          <div>
            <span className="badge">Green second-hand marketplace</span>
            <h1 className="hero-title" style={{ marginTop: "18px" }}>
              Buy and sell pre-owned products in a cleaner, smarter way.
            </h1>
            <p className="hero-text" style={{ marginTop: "16px" }}>
              GreenMarket is a thesis marketplace platform where users can
              create listings, chat with sellers, track transactions, manage
              payments, and explore trusted second-hand products with a modern
              experience.
            </p>

            <div
              style={{
                display: "flex",
                gap: "14px",
                marginTop: "24px",
                flexWrap: "wrap",
              }}
            >
              <Link to="/products" className="btn btn-primary">
                Explore Products
              </Link>
              <Link to="/products/create" className="btn btn-outline">
                Create Listing
              </Link>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-floating-card hero-card-top">
              <strong style={{ color: "var(--color-primary-dark)" }}>
                Fast Listing
              </strong>
              <p className="muted" style={{ marginTop: "8px" }}>
                Upload product details and images in a simple flow.
              </p>
            </div>

            <div className="hero-floating-card hero-card-bottom">
              <strong style={{ color: "var(--color-primary-dark)" }}>
                Transaction Tracking
              </strong>
              <p className="muted" style={{ marginTop: "8px" }}>
                Monitor order status from pending to completed.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <h2 className="page-title">Core Features</h2>
          <p className="page-subtitle">
            This frontend is designed for your thesis topic and prepared to
            connect with ASP.NET Core Web API, SQL Server, Azure Blob Storage,
            and JWT authentication.
          </p>

          <div className="grid grid-3">
            <div className="card feature-card">
              <div className="icon-pill">01</div>
              <h3>Product Listings</h3>
              <p>
                Create, edit, and manage second-hand product posts with title,
                price, condition, and images.
              </p>
            </div>

            <div className="card feature-card">
              <div className="icon-pill">02</div>
              <h3>Image Upload</h3>
              <p>
                Prepared for Azure Blob Storage integration so your app can
                store product images externally and safely.
              </p>
            </div>

            <div className="card feature-card">
              <div className="icon-pill">03</div>
              <h3>Transaction Management</h3>
              <p>
                Users and admins can later track transaction status, handle
                approvals, and manage records cleanly.
              </p>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

export default HomePage;
