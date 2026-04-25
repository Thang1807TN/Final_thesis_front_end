import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MainLayout from "../../layouts/MainLayout";

function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <MainLayout>
      <section className="page-shell">
        <div className="container">
          <div className="card empty-state">
            <h1>404</h1>

            <p>
              {t(
                "notFound.description",
                "The page you are looking for does not exist.",
              )}
            </p>

            <Link
              to="/"
              className="btn btn-primary"
              style={{ marginTop: "16px" }}
            >
              {t("notFound.backHome", "Back Home")}
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

export default NotFoundPage;
