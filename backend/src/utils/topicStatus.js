export const getStatus = (score) => {
  if (score >= 80) return "strong";
  if (score >= 50) return "medium";
  return "weak";
};