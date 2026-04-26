import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MainLayout from "../../layouts/MainLayout";

function HomePage() {
  const { t } = useTranslation();

  return (
    <MainLayout>
      {/* HERO */}
      <section className="home-hero">
        <div className="container home-hero-grid">
          <div className="home-hero-content">
            <span className="home-kicker">{t("home.badge")}</span>

            <h1 className="home-title">{t("home.heroTitle")}</h1>

            <p className="home-description">{t("home.heroText")}</p>

            <div className="home-hero-actions">
              <Link to="/products" className="btn btn-primary">
                {t("home.exploreProducts")}
              </Link>

              <Link to="/products/create" className="btn btn-outline">
                {t("home.createListing")}
              </Link>
            </div>

            <div className="home-stats">
              <div>
                <strong>500+</strong>
                <span>{t("home.activeListings")}</span>
              </div>

              <div>
                <strong>98%</strong>
                <span>{t("home.safeTransactions")}</span>
              </div>

              <div>
                <strong>24/7</strong>
                <span>{t("home.adminSupport")}</span>
              </div>
            </div>
          </div>

          {/* PREVIEW CARD */}
          <div className="home-preview-card">
            <div className="home-preview-top">
              <span>{t("home.featuredDeal")}</span>
              <strong>{t("common.available")}</strong>
            </div>

            <div className="home-product-preview">
              <div className="home-product-image">♻</div>

              <div>
                <h3>{t("home.previewTitle", "Vintage Wooden Desk")}</h3>
                <p>{t("home.previewLocation")}</p>
                <strong>{t("home.previewPrice", "320 PLN")}</strong>
              </div>
            </div>

            <div className="home-preview-meta">
              <div>
                <span>{t("home.condition")}</span>
                <strong>{t("condition.veryGood")}</strong>
              </div>

              <div>
                <span>{t("home.sellerRating")}</span>
                <strong>4.8 / 5</strong>
              </div>
            </div>

            <div className="home-chat-preview">
              <p>{t("home.chatPreview")}</p>
              <span>{t("home.chatReply")}</span>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="home-section">
        <div className="container">
          <div className="home-section-header">
            <span className="home-kicker">{t("home.marketplaceTools")}</span>

            <h2>{t("home.coreFeatures")}</h2>

            <p>{t("home.coreFeaturesText")}</p>
          </div>

          <div className="home-feature-grid">
            <div className="card home-feature-card">
              <div className="home-feature-icon">🛍️</div>
              <h3>{t("home.featureProducts")}</h3>
              <p>{t("home.featureProductsText")}</p>
            </div>

            <div className="card home-feature-card">
              <div className="home-feature-icon">💬</div>
              <h3>{t("home.featureChat")}</h3>
              <p>{t("home.featureChatText")}</p>
            </div>

            <div className="card home-feature-card">
              <div className="home-feature-icon">💳</div>
              <h3>{t("home.featurePayments")}</h3>
              <p>{t("home.featurePaymentsText")}</p>
            </div>

            <div className="card home-feature-card">
              <div className="home-feature-icon">❤️</div>
              <h3>{t("home.featureWishlist")}</h3>
              <p>{t("home.featureWishlistText")}</p>
            </div>

            <div className="card home-feature-card">
              <div className="home-feature-icon">⭐</div>
              <h3>{t("home.featureReviews")}</h3>
              <p>{t("home.featureReviewsText")}</p>
            </div>

            <div className="card home-feature-card">
              <div className="home-feature-icon">🛡️</div>
              <h3>{t("home.featureAdmin")}</h3>
              <p>{t("home.featureAdminText")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="home-section home-soft-section">
        <div className="container home-steps-grid">
          <div>
            <span className="home-kicker">{t("home.howItWorks")}</span>

            <h2>{t("home.simpleFlow")}</h2>

            <p>{t("home.simpleFlowText")}</p>
          </div>

          <div className="home-steps">
            <div className="home-step">
              <span>1</span>
              <div>
                <h3>{t("home.stepList")}</h3>
                <p>{t("home.stepListText")}</p>
              </div>
            </div>

            <div className="home-step">
              <span>2</span>
              <div>
                <h3>{t("home.stepChat")}</h3>
                <p>{t("home.stepChatText")}</p>
              </div>
            </div>

            <div className="home-step">
              <span>3</span>
              <div>
                <h3>{t("home.stepPay")}</h3>
                <p>{t("home.stepPayText")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="home-cta-section">
        <div className="container">
          <div className="home-cta-card">
            <div>
              <h2>{t("home.ctaTitle")}</h2>
              <p>{t("home.ctaText")}</p>
            </div>

            <div className="home-cta-actions">
              <Link to="/products" className="btn btn-primary">
                {t("home.exploreProducts")}
              </Link>

              <Link to="/products/create" className="btn btn-outline">
                {t("home.createListing")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

export default HomePage;
