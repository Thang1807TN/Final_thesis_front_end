import { useLocation, Link } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import ProtectedRoute from "../../components/user/ProtectedRoute";
import CheckoutSummary from "../../components/transaction/CheckoutSummary";
import EmptyState from "../../components/common/EmptyState";

function CheckoutPage() {
  const location = useLocation();
  const transaction = location.state?.transaction || null;

  return (
    <ProtectedRoute>
      <MainLayout>
        <section className="page-shell">
          <div className="container">
            <h1 className="page-title">Checkout</h1>
            <p className="page-subtitle">
              Review your transaction before proceeding to payment.
            </p>

            {!transaction ? (
              <EmptyState
                title="No transaction selected"
                description="Go back to a product page and create a transaction first."
              />
            ) : (
              <>
                <CheckoutSummary transaction={transaction} />
                <div style={{ marginTop: "18px" }}>
                  <Link
                    to="/payments"
                    state={{ transaction }}
                    className="btn btn-primary"
                  >
                    Continue to Payment
                  </Link>
                </div>
              </>
            )}
          </div>
        </section>
      </MainLayout>
    </ProtectedRoute>
  );
}

export default CheckoutPage;
