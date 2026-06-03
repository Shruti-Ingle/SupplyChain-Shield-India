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
  console.log("Stats updated:", { fuelSaved, co2Saved });
}
