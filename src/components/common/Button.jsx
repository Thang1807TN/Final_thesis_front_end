function Button({
  children,
  type = "button",
  variant = "primary",
  fullWidth = false,
  disabled = false,
  onClick,
}) {
  return (
    <button
      type={type}
      className={`btn ${variant === "primary" ? "btn-primary" : "btn-outline"} ${fullWidth ? "btn-full" : ""}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;
