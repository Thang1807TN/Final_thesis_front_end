import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";

function UIComponentsShowcasePage() {
  const sampleRows = [
    {
      id: 1,
      product: "Samsung Galaxy S22",
      buyer: "Tom Tran",
      amount: 950,
      status: "Paid",
      date: "2026-05-10",
    },
    {
      id: 2,
      product: "Wooden Desk",
      buyer: "Anna Kowalska",
      amount: 180,
      status: "Pending",
      date: "2026-05-12",
    },
    {
      id: 3,
      product: "Nike Running Shoes",
      buyer: "Jan Nowak",
      amount: 220,
      status: "Completed",
      date: "2026-05-14",
    },
  ];

  return (
    <main className="ui-showcase-page">
      <section className="ui-showcase-canvas">
        <div className="ui-showcase-title-box">
          <span className="ui-showcase-label">GreenMarket frontend</span>
          <h1>Reusable UI Components</h1>
          <p>
            Buttons, cards, form controls, badges, and tables used across the
            marketplace application.
          </p>
        </div>

        <div className="ui-showcase-grid">
          {/* BUTTONS */}
          <section className="ui-showcase-card ui-buttons-section">
            <div className="ui-section-head">
              <h2>Buttons</h2>
              <p>Reusable action buttons for forms, cards, and admin pages.</p>
            </div>

            <div className="ui-button-row">
              <button className="ui-btn ui-btn-primary">Primary</button>
              <button className="ui-btn ui-btn-outline">Outline</button>
              <button className="ui-btn ui-btn-danger">Danger</button>
              <button className="ui-btn ui-btn-disabled" disabled>
                Disabled
              </button>
            </div>
          </section>

          {/* CARDS */}
          <section className="ui-showcase-card ui-cards-section">
            <div className="ui-section-head">
              <h2>Cards</h2>
              <p>
                Cards display products, statistics, profiles, and summary data.
              </p>
            </div>

            <div className="ui-card-demo-grid">
              <article className="ui-mini-product-card">
                <div className="ui-product-image">Product Image</div>

                <div className="ui-product-content">
                  <span className="ui-mini-badge">Very Good</span>
                  <h3>Samsung Galaxy S22</h3>
                  <p>Electronics · Rzeszów</p>

                  <div className="ui-product-bottom">
                    <strong>{formatCurrency(950)}</strong>
                    <button className="ui-small-btn">View</button>
                  </div>
                </div>
              </article>

              <article className="ui-summary-card">
                <div className="ui-summary-value">128</div>
                <h3>Total Products</h3>
                <p>Active product listings in the marketplace.</p>
              </article>

              <article className="ui-profile-card">
                <div className="ui-avatar">T</div>

                <div>
                  <h3>Tom Tran</h3>
                  <p>tom@example.com</p>
                  <span className="ui-mini-badge">Seller</span>
                </div>
              </article>
            </div>
          </section>

          {/* FORMS */}
          <section className="ui-showcase-card ui-forms-section">
            <div className="ui-section-head">
              <h2>Form Controls</h2>
              <p>
                Reusable inputs for authentication, products, payments, and
                admin pages.
              </p>
            </div>

            <div className="ui-form-grid">
              <div className="ui-field">
                <label>Product title</label>
                <input value="Samsung Galaxy S22" readOnly />
              </div>

              <div className="ui-field">
                <label>Category</label>
                <select defaultValue="electronics">
                  <option value="electronics">Electronics</option>
                  <option value="fashion">Fashion</option>
                  <option value="furniture">Furniture</option>
                </select>
              </div>

              <div className="ui-field ui-field-full">
                <label>Description</label>
                <textarea
                  value="A short description of the second-hand product."
                  readOnly
                />
              </div>

              <div className="ui-search-box ui-field-full">
                <input value="phone" readOnly />
                <button className="ui-btn ui-btn-primary">Search</button>
              </div>
            </div>
          </section>

          {/* BADGES */}
          <section className="ui-showcase-card ui-badges-section">
            <div className="ui-section-head">
              <h2>Badges and Status Labels</h2>
              <p>
                Badges help users quickly understand product, payment, and
                transaction states.
              </p>
            </div>

            <div className="ui-badge-row">
              <span className="ui-status ui-status-available">Available</span>
              <span className="ui-status ui-status-pending">Pending</span>
              <span className="ui-status ui-status-paid">Paid</span>
              <span className="ui-status ui-status-completed">Completed</span>
              <span className="ui-status ui-status-cancelled">Cancelled</span>
              <span className="ui-status ui-status-sold">Sold</span>
            </div>
          </section>

          {/* TABLE */}
          <section className="ui-showcase-card ui-table-section">
            <div className="ui-section-head">
              <h2>Tables</h2>
              <p>
                Tables are used in admin pages for product, user, transaction,
                payment, and report management.
              </p>
            </div>

            <div className="ui-table-wrap">
              <table className="ui-demo-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Buyer</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {sampleRows.map((row) => (
                    <tr key={row.id}>
                      <td>{row.product}</td>
                      <td>{row.buyer}</td>
                      <td>{formatCurrency(row.amount)}</td>
                      <td>
                        <span
                          className={`ui-status ui-status-${row.status.toLowerCase()}`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td>{formatDate(row.date)}</td>
                      <td>
                        <button className="ui-small-btn">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

export default UIComponentsShowcasePage;
