export const calculateAmounts = (
  amount: number,
  oneTimeFee = 0,
  interestRate = 0.3,
) => {
  const interest = Number((amount * interestRate).toFixed(2));
  const pickupAmount = Number((amount + interest + oneTimeFee).toFixed(2));
  const earlyClaimAmount = Number((amount * 1.1 + oneTimeFee).toFixed(2));

  return {
    interest,
    pickupAmount,
    earlyClaimAmount,
  };
};
