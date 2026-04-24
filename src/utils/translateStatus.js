export const getTranslatedTransactionStatus = (status, t) => {
  const keyMap = {
    Pending: "status.pending",
    Confirmed: "status.confirmed",
    Paid: "status.paid",
    Completed: "status.completed",
    Cancelled: "status.cancelled",
    Failed: "status.failed",
    Refunded: "status.refunded",
    Reviewed: "status.reviewed",
    Resolved: "status.resolved",
    Rejected: "status.rejected",
  };

  const key = keyMap[status];
  return key ? t(key) : status;
};

export const getTranslatedCondition = (condition, t) => {
  const keyMap = {
    LikeNew: "condition.likeNew",
    VeryGood: "condition.veryGood",
    Good: "condition.good",
    Fair: "condition.fair",
  };

  const key = keyMap[condition];
  return key ? t(key) : condition;
};

export const getTranslatedPaymentMethod = (method, t) => {
  const keyMap = {
    CashOnDelivery: "paymentMethod.cashOnDelivery",
    BankTransfer: "paymentMethod.bankTransfer",
    OnlineDemo: "paymentMethod.onlineDemo",
    1: "paymentMethod.cashOnDelivery",
    2: "paymentMethod.bankTransfer",
    3: "paymentMethod.onlineDemo",
  };

  const key = keyMap[method];
  return key ? t(key) : String(method);
};
