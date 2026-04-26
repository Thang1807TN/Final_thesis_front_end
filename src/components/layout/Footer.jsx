import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="container footer-grid">
        {/* Brand */}
        <div className="footer-brand">
          <h3>GreenMarket</h3>
          <p>
            {t(
              "footer.description",
              "A modern second-hand marketplace platform for buying and selling products safely.",
            )}
          </p>
        </div>

        {/* Navigation */}
        <div className="footer-col">
          <h4>{t("footer.navigation", "Navigation")}</h4>

          <Link to="/products">{t("common.products", "Products")}</Link>
          <Link to="/transactions">
            {t("common.transactions", "Transactions")}
          </Link>
          <Link to="/payments/history">{t("common.payments", "Payments")}</Link>
          <Link to="/wishlist">{t("common.wishlist", "Wishlist")}</Link>
        </div>

        {/* Features */}
        <div className="footer-col">
          <h4>{t("footer.features", "Features")}</h4>

          <span>{t("footer.chat", "Chat system")}</span>
          <span>{t("footer.payments", "Payment system")}</span>
          <span>{t("footer.reviews", "Reviews & ratings")}</span>
          <span>{t("footer.admin", "Admin dashboard")}</span>
        </div>

        {/* Tech */}
        <div className="footer-col">
          <h4>{t("footer.tech", "Technology")}</h4>

          <span>React</span>
          <span>ASP.NET Core Web API</span>
          <span>SQL Server</span>
          <span>RESTful Architecture</span>
        </div>
      </div>

      {/* Bottom */}
      {/* <div className="footer-bottom">
        <p>© 2026 GreenMarket</p>
        <p>{t("footer.builtFor", "Built for thesis project")}</p>
      </div> */}
    </footer>
  );
}

export default Footer;
