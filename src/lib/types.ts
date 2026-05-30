export type UserRole = "transporter" | "business" | "admin";
export type VerificationStatus = "pending" | "approved" | "rejected";
export type RouteStatus = "open" | "matched" | "completed" | "cancelled";
export type ShipmentStatus = "open" | "matched" | "in_transit" | "delivered" | "cancelled";
export type MatchStatus = "proposed" | "accepted" | "rejected";
export type TripStatus = "pending" | "picked_up" | "in_transit" | "delivered" | "cancelled";
export type TruckStatus = "available" | "on_trip";

export interface User {
  id: number;
  email: string;
  password_hash: string;
  role: UserRole;
  company_name: string;
  gst?: string;
  phone?: string;
  contact_person?: string;
  verification_status: VerificationStatus;
  green_score: number;
  created_at: string;
}

export interface Truck {
  id: number;
  transporter_id: number;
  vehicle_number: string;
  capacity: number;
  vehicle_type: string;
  driver_name: string;
  driver_phone: string;
  status: TruckStatus;
}

export interface Route {
  id: number;
  transporter_id: number;
  truck_id: number;
  from_city: string;
  to_city: string;
  from_lat: number;
  from_lng: number;
  to_lat: number;
  to_lng: number;
  distance_km: number;
  capacity_available: number;
  departure_time: string;
  status: RouteStatus;
  created_at: string;
}

export interface Shipment {
  id: number;
  business_id: number;
  from_city: string;
  to_city: string;
  from_lat: number;
  from_lng: number;
  to_lat: number;
  to_lng: number;
  distance_km: number;
  cargo_type: string;
  weight: number;
  volume?: number;
  pickup_date: string;
  deadline: string;
  status: ShipmentStatus;
  created_at: string;
}

export interface Match {
  id: number;
  route_id: number;
  shipment_id: number;
  match_score: number;
  estimated_revenue: number;
  estimated_cost: number;
  fuel_saved: number;
  co2_saved: number;
  status: MatchStatus;
  created_at: string;
}

export interface Trip {
  id: number;
  match_id: number;
  route_id: number;
  shipment_id: number;
  transporter_id: number;
  business_id: number;
  status: TripStatus;
  current_lat: number;
  current_lng: number;
  eta: string;
  distance_remaining: number;
  fuel_saved: number;
  co2_saved: number;
  revenue: number;
  cost: number;
  created_at: string;
  completed_at?: string;
}

export interface Activity {
  id: number;
  user_id: number;
  action: string;
  details: string;
  created_at: string;
}

export interface SessionUser {
  id: number;
  email: string;
  role: UserRole;
  company_name: string;
  verification_status: VerificationStatus;
}

export interface MatchResult {
  shipment: Shipment;
  route: Route;
  match_score: number;
  estimated_revenue: number;
  estimated_cost: number;
  fuel_saved: number;
  co2_saved: number;
  business_name?: string;
  truck?: Truck;
}
