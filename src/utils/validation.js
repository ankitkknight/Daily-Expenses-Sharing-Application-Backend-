exports.validatePercentageSplit = (participants) => {
  const totalPercentage = participants.reduce(
    (total, participant) => total + participant.amount,
    0
  );
  return totalPercentage === 100;
};
