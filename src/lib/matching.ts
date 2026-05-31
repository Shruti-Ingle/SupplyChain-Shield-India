import {
  haversineDistance,
  pointToSegmentDistance,
  getRouteDistance,
  parseCityInput,
  type City,
} from "./cities";
import {
  calculateFuelSaved,
  calculateCo2Saved,
  calculateRevenue,
  calculateBusinessCost,
} from "./sustainability";
import type { Route, Shipment, MatchResult } from "./types";

const ROUTE_WEIGHT = 0.4;
const CAPACITY_WEIGHT = 0.3;
const TIMING_WEIGHT = 0.3;
const ROUTE_DEVIATION_KM = 20;

function routeOverlapScore(
  route: Route,
  shipment: Shipment
): number {
  const pickupDev = pointToSegmentDistance(
    shipment.from_lat,
    shipment.from_lng,
    route.from_lat,
    route.from_lng,
    route.to_lat,
    route.to_lng
  );
  const deliveryDev = pointToSegmentDistance(
    shipment.to_lat,
    shipment.to_lng,
    route.from_lat,
    route.from_lng,
    route.to_lat,
    route.to_lng
  );

  const sameDirection =
    haversineDistance(route.from_lat, route.from_lng, shipment.from_lat, shipment.from_lng) <
    haversineDistance(route.to_lat, route.to_lng, shipment.from_lat, shipment.from_lng);

  if (!sameDirection) return 0;

  const cityMatch =
    route.from_city === shipment.from_city && route.to_city === shipment.to_city;
  if (cityMatch) return 100;

  const avgDev = (pickupDev + deliveryDev) / 2;
  if (avgDev <= ROUTE_DEVIATION_KM) return 100;
  if (avgDev <= 50) return 70;
  if (avgDev <= 100) return 40;
  return 0;
}

function capacityScore(capacity: number, weight: number): number {
  if (weight > capacity) return 0;
  if (weight === capacity) return 100;
  return Math.round((weight / capacity) * 100);
}

function timingScore(departureTime: string, pickupDate: string): number {
  const dep = new Date(departureTime);
  const pick = new Date(pickupDate);
  const diffDays = Math.abs(
    Math.round((dep.getTime() - pick.getTime()) / (1000 * 60 * 60 * 24))
  );
  if (diffDays === 0) return 100;
  if (diffDays === 1) return 70;
  if (diffDays === 2) return 40;
  return 0;
}

export function computeMatchScore(route: Route, shipment: Shipment): number {
  const routeScore = routeOverlapScore(route, shipment);
  const capScore = capacityScore(route.capacity_available, shipment.weight);
  const timeScore = timingScore(route.departure_time, shipment.pickup_date);

  if (routeScore === 0 || capScore === 0 || timeScore === 0) return 0;

  const composite =
    routeScore * ROUTE_WEIGHT +
    capScore * CAPACITY_WEIGHT +
    timeScore * TIMING_WEIGHT;

  return Math.round(composite);
}

export function buildMatchResult(route: Route, shipment: Shipment): MatchResult {
  const matchScore = computeMatchScore(route, shipment);
  const distance = route.distance_km || getRouteDistance(
    { name: route.from_city, state: "", lat: route.from_lat, lng: route.from_lng },
    { name: route.to_city, state: "", lat: route.to_lat, lng: route.to_lng }
  );
  const fuelSaved = calculateFuelSaved(distance);
  const co2Saved = calculateCo2Saved(fuelSaved);
  const estimatedRevenue = calculateRevenue(distance, shipment.weight);
  const estimatedCost = calculateBusinessCost(distance, shipment.weight);

  return {
    route,
    shipment,
    match_score: matchScore,
    estimated_revenue: estimatedRevenue,
    estimated_cost: estimatedCost,
    fuel_saved: fuelSaved,
    co2_saved: co2Saved,
  };
}

export function findMatchesForRoute(
  route: Route,
  shipments: Shipment[]
): MatchResult[] {
  return shipments
    .filter((s) => s.status === "open")
    .map((s) => buildMatchResult(route, s))
    .filter((m) => m.match_score > 0)
    .sort((a, b) => b.match_score - a.match_score)
    .slice(0, 5);
}

export function findMatchesForShipment(
  shipment: Shipment,
  routes: Route[]
): MatchResult[] {
  return routes
    .filter((r) => r.status === "open")
    .map((r) => buildMatchResult(r, shipment))
    .filter((m) => m.match_score > 0)
    .sort((a, b) => b.match_score - a.match_score)
    .slice(0, 5);
}

export function resolveCityCoords(fromCity: string, toCity: string) {
  const from = parseCityInput(fromCity);
  const to = parseCityInput(toCity);
  if (!from || !to) return null;
  const distance = getRouteDistance(from, to);
  return { from, to, distance };
}

export function getScoreColor(score: number): string {
  if (score >= 80) return "text-moss bg-sage-100";
  if (score >= 60) return "text-earth bg-sage-50";
  return "text-red-600 bg-red-50";
}
