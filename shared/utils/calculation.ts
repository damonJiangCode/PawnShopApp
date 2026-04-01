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
    const EARLY_RATE = 0.1;
    return Number((amt * (1 + EARLY_RATE) + otf).toFixed(2));
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
