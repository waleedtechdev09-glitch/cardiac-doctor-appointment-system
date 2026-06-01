
export const calculateRiskScore = (age, bp, symptoms) => {
  let score = 0;

  // 1. Age Factor
  if (age > 60) score += 3;
  else if (age > 45) score += 2;

  // 2. BP Factor (Assuming string like "140/90")
  const systolic = parseInt(bp.split('/')[0]);
  if (systolic > 180) score += 5; // Hypertensive Crisis
  else if (systolic > 140) score += 3;

  // 3. Symptoms Factor
  const highRiskSymptoms = ["chest pain", "shortness of breath", "fainting"];
  if (highRiskSymptoms.some(s => symptoms.toLowerCase().includes(s))) {
    score += 4;
  }

  return score; // Max score can be 10+
};