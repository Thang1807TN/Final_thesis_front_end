import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AuthLayout from "../../layouts/AuthLayout";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import useAuth from "../../hooks/useAuth";

function RegisterPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

    if (form.password !== form.confirmPassword) {
      setErrorMessage(t("auth.passwordMismatch", "Passwords do not match."));
      return;
    }

    setSubmitting(true);

    try {
      await register({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
      });

      navigate("/login");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          t("auth.registerFailed", "Registration failed. Please try again."),
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
            {t("auth.createAccountBadge", "Create Account")}
          </span>

          <h1 className="auth-title">
            {t("auth.createAccount", "Create account")}
          </h1>

          <p className="auth-subtitle">
            {t(
              "auth.registerSubtitle",
              "Start selling and buying second-hand products on GreenMarket.",
            )}
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <Input
            label={t("auth.fullName", "Full name")}
            name="fullName"
            placeholder={t("auth.enterFullName", "Enter your full name")}
            value={form.fullName}
            onChange={handleChange}
            required
          />

          <Input
            label={t("auth.email", "Email")}
            name="email"
            type="email"
            placeholder={t("auth.enterEmail", "Enter your email")}
            value={form.email}
            onChange={handleChange}
            required
          />

          <div className="password-field">
            <label className="input-label">
              {t("auth.password", "Password")}
            </label>

            <div className="password-input-wrap">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder={t("auth.createPassword", "Create a password")}
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

          <div className="password-field">
            <label className="input-label">
              {t("auth.confirmPassword", "Confirm password")}
            </label>

            <div className="password-input-wrap">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder={t("auth.repeatPassword", "Repeat your password")}
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
              >
                {showConfirmPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {errorMessage && <p className="form-error">{errorMessage}</p>}

          <Button type="submit" fullWidth disabled={submitting}>
            {submitting
              ? t("auth.creating", "Creating...")
              : t("common.register", "Register")}
          </Button>
        </form>

        <p className="auth-switch-text">
          {t("auth.haveAccount", "Already have an account?")}{" "}
          <Link className="link" to="/login">
            {t("common.login", "Login")}
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}

export default RegisterPage;
