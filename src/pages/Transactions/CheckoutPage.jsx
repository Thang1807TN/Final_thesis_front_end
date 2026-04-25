import { useLocation, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MainLayout from "../../layouts/MainLayout";
import ProtectedRoute from "../../components/user/ProtectedRoute";
import CheckoutSummary from "../../components/transaction/CheckoutSummary";
import EmptyState from "../../components/common/EmptyState";

function CheckoutPage() {
  const { t } = useTranslation();
  const location = useLocation();
  const transaction = location.state?.transaction || null;

  return (
    <ProtectedRoute>
      <MainLayout>
        <section className="page-shell">
          <div className="container">
            <h1 className="page-title">{t("checkout.title", "Checkout")}</h1>

            <p className="page-subtitle">
              {t(
                "checkout.subtitle",
                "Review your transaction before proceeding to payment.",
              )}
            </p>

            {!transaction ? (
              <EmptyState
                title={t("checkout.noTransaction", "No transaction selected")}
                description={t(
                  "checkout.noTransactionDescription",
                  "Go back to a product page and create a transaction first.",
                )}
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
                    {t("checkout.continueToPayment", "Continue to Payment")}
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
