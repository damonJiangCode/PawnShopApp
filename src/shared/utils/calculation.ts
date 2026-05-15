export const calculation = {
  getEarlyAmt: (amt: number, otf: number) => {
    const regularInterest = calculation.getBaseIntAmt(amt) ?? 0;

    if (regularInterest <= 5) {
      return Number((amt + regularInterest + otf).toFixed(2));
    }

    const reducedInterest = Math.max(5, Number((amt * 0.1).toFixed(2)));
    return Number((amt + reducedInterest + otf).toFixed(2));
  },

  getBaseIntAmt: (amt: number) => {
    const INTEREST_RATE = 0.3;
    return Number((amt * INTEREST_RATE).toFixed(2));
  },

  getBasePickupAmt: (amt: number, otf: number) => {
    const interest = calculation.getBaseIntAmt(amt) ?? 0;
    return Number((amt + interest + otf).toFixed(2));
  },

  getPaymentPickupAmt: (
    amt: number,
    otf: number,
    transactionDatetime: Date,
    interestPaidMonths = 0,
    asOf = new Date(),
  ) => {
    const elapsedMs = asOf.getTime() - transactionDatetime.getTime();
    const elapsedDays = Math.max(0, elapsedMs / (1000 * 60 * 60 * 24));

    if (elapsedDays <= 7) {
      return calculation.getEarlyAmt(amt, otf);
    }

    const interest = calculation.getBaseIntAmt(amt) ?? 0;
    const minimumPickup = amt + otf;
    const owedInterestMonths = Math.max(1, Math.ceil(elapsedDays / 30));
    const unpaidInterestMonths = Math.max(
      0,
      owedInterestMonths - Math.max(0, interestPaidMonths),
    );
    const pickup = minimumPickup + unpaidInterestMonths * interest;

    return Number(Math.max(minimumPickup, pickup).toFixed(2));
  },

  getCurrentDatetime: () => {
    return new Date();
  },

  getDueDatetime: (curDatetime: Date) => {
    const due = new Date(curDatetime);
    due.setDate(due.getDate() + 30);
    return due;
  },

  getSellDueDatetime: (transactionDatetime: Date) => {
    const due = new Date(transactionDatetime);
    due.setDate(due.getDate() + 45);
    return due;
  },
};
