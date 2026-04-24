export const APP_NAME = "GreenMarket";
export const USER_ROLE = "User";
export const ADMIN_ROLE = "Admin";

export const PRODUCT_CONDITIONS = [
  { value: "LikeNew", label: "Like New" },
  { value: "VeryGood", label: "Very Good" },
  { value: "Good", label: "Good" },
  { value: "Fair", label: "Fair" },
];

export const TRANSACTION_STATUS_OPTIONS = [
  "Pending",
  "Confirmed",
  "Paid",
  "Completed",
  "Cancelled",
];

export const PAYMENT_STATUS_OPTIONS = ["Pending", "Paid", "Failed", "Refunded"];

export const PAYMENT_METHOD_OPTIONS = [
  { value: 1, label: "Cash On Delivery" },
  { value: 2, label: "Bank Transfer" },
  { value: 3, label: "Online Demo" },
];
