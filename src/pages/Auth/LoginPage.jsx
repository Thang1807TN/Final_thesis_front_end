import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AuthLayout from "../../layouts/AuthLayout";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import useAuth from "../../hooks/useAuth";

function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSubmitting(true);

    try {
      await login(form.email, form.password);
      navigate("/");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          t("auth.loginFailed", "Login failed. Please try again."),
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <div className="auth-page-card">
        <div className="auth-card-header">
          <span className="auth-badge">
            {t("auth.secureLogin", "Secure Login")}
          </span>

          <h1 className="auth-title">
            {t("auth.welcomeBack", "Welcome back")}
          </h1>

          <p className="auth-subtitle">
            {t(
              "auth.loginSubtitle",
              "Login to manage your listings, inbox, payments, and transactions.",
            )}
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {/* EMAIL */}
          <Input
            label={t("auth.email", "Email")}
            name="email"
            type="email"
            placeholder={t("auth.enterEmail", "Enter your email")}
            value={form.email}
            onChange={handleChange}
            required
          />

          {/* PASSWORD WITH TOGGLE */}
          <div className="password-field">
            <label className="input-label">
              {t("auth.password", "Password")}
            </label>

            <div className="password-input-wrap">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder={t("auth.enterPassword", "Enter your password")}
                value={form.password}
                onChange={handleChange}
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {errorMessage && <p className="form-error">{errorMessage}</p>}

          <Button type="submit" fullWidth disabled={submitting}>
            {submitting
              ? t("auth.loggingIn", "Logging in...")
              : t("common.login", "Login")}
          </Button>
        </form>

        <p className="auth-switch-text">
          {t("auth.noAccount", "Don’t have an account?")}{" "}
          <Link className="link" to="/register">
            {t("auth.createOne", "Create one")}
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}

export default LoginPage;
