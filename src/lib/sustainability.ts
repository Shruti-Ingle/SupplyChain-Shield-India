const FUEL_ECONOMY_KM_PER_L = 3;
const CO2_FACTOR_KG_PER_L = 2.68;
const RATE_PER_TON_KM = 6;
const BUSINESS_DISCOUNT = 0.15;
const STANDARD_RATE_MULTIPLIER = 1.15;

export function calculateFuelSaved(distanceKm: number): number {
  return Math.round((distanceKm / FUEL_ECONOMY_KM_PER_L) * 10) / 10;
}

export function calculateCo2Saved(fuelLitres: number): number {
  return Math.round(fuelLitres * CO2_FACTOR_KG_PER_L * 10) / 10;
}

export function calculateRevenue(distanceKm: number, weightTons: number): number {
  return Math.round(distanceKm * weightTons * RATE_PER_TON_KM);
}

export function calculateBusinessCost(distanceKm: number, weightTons: number): number {
  const standard = distanceKm * weightTons * RATE_PER_TON_KM * STANDARD_RATE_MULTIPLIER;
  return Math.round(standard * (1 - BUSINESS_DISCOUNT));
}

export function calculateGreenScore(
  completedTrips: number,
  totalRoutes: number,
  avgMatchScore: number
): number {
  if (totalRoutes === 0) return 50;
  const backhaulRate = Math.min(completedTrips / Math.max(totalRoutes, 1), 1);
  const score = backhaulRate * 50 + (avgMatchScore / 100) * 50;
  return Math.round(Math.min(100, Math.max(0, score)));
}

export function calculateCostSavings(estimatedCost: number): number {
  return Math.round(estimatedCost * BUSINESS_DISCOUNT / (1 - BUSINESS_DISCOUNT));
}

export { FUEL_ECONOMY_KM_PER_L, CO2_FACTOR_KG_PER_L };
