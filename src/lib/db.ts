let platformStats = {
  id: 1,
  trips_matched: 1247,
  empty_trips_avoided: 892,
  fuel_saved: 45600,
  co2_reduced: 122208,
};

export async function logActivity(
  userId: number | null,
  action: string,
  details: string
): Promise<void> {
  console.log("Activity:", { userId, action, details });
}

export async function updatePlatformStats(
  fuelSaved: number,
  co2Saved: number
): Promise<void> {
  platformStats = {
    ...platformStats,
    trips_matched: platformStats.trips_matched + 1,
    empty_trips_avoided: platformStats.empty_trips_avoided + 1,
    fuel_saved: Math.round((platformStats.fuel_saved + fuelSaved) * 100) / 100,
    co2_reduced: Math.round((platformStats.co2_reduced + co2Saved) * 100) / 100,
  };

  console.log("Sustainability stats updated:", platformStats);
}

export function getPlatformStats() {
  return platformStats;
}

export function calculateTripImpact(distanceKm: number, capacityKg: number) {
  const safeDistance = Number(distanceKm || 100);
  const safeCapacity = Number(capacityKg || 1000);

  const fuelSaved = Math.round((safeDistance * 0.12 + safeCapacity * 0.001) * 100) / 100;
  const co2Saved = Math.round((fuelSaved * 2.68) * 100) / 100;

  return {
    fuelSaved,
    co2Saved,
  };
}
