export const calculation = {
  getIntAmt: (amt: number) => {
    const INTEREST_RATE = 0.3;
    return Number((amt * INTEREST_RATE).toFixed(2));
  },

  getPickupAmt: (amt: number, otf: number) => {
    const interest = calculation.getIntAmt(amt) ?? 0;
    return Number((amt + interest + otf).toFixed(2));
  },

  getEarlyAmt: (amt: number, otf: number) => {
    const regularInterest = calculation.getIntAmt(amt) ?? 0;

    if (regularInterest <= 5) {
      return Number((amt + regularInterest + otf).toFixed(2));
    }

    const reducedInterest = Math.max(5, Number((amt * 0.1).toFixed(2)));
    return Number((amt + reducedInterest + otf).toFixed(2));
  },

  getCurrentDatetime: () => {
    return new Date();
  },

  getDueDatetime: (curDatetime: Date) => {
    const due = new Date(curDatetime);
    due.setDate(due.getDate() + 30);
    return due;
  },
};
