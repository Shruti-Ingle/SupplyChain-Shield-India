import bcrypt from "bcryptjs";
import { getDb } from "../src/lib/db";
import { getRouteDistance, INDIAN_CITIES } from "../src/lib/cities";
import { calculateFuelSaved, calculateCo2Saved, calculateRevenue, calculateBusinessCost } from "../src/lib/sustainability";
import { computeMatchScore } from "../src/lib/matching";

async function hash(pw: string) {
  return bcrypt.hash(pw, 10);
}

function city(name: string) {
  return INDIAN_CITIES.find((c) => c.name === name)!;
}

async function seed() {
  const db = getDb();

  db.exec("DELETE FROM trips; DELETE FROM matches; DELETE FROM routes; DELETE FROM shipments; DELETE FROM trucks; DELETE FROM activities; DELETE FROM users; DELETE FROM platform_stats;");
  db.exec("INSERT OR IGNORE INTO platform_stats (id, trips_matched, empty_trips_avoided, fuel_saved, co2_reduced) VALUES (1, 1247, 892, 45600, 122208);");

  const pass = await hash("pass");

  const tResult = db.prepare(
    `INSERT INTO users (email, password_hash, role, company_name, gst, phone, verification_status, green_score)
     VALUES ('transporter@example.com', ?, 'transporter', 'Sharma Logistics Pvt Ltd', '27AABCS1234A1Z5', '9876543210', 'approved', 78)`
  ).run(pass);

  const bResult = db.prepare(
    `INSERT INTO users (email, password_hash, role, company_name, contact_person, phone, verification_status, green_score)
     VALUES ('business@example.com', ?, 'business', 'Patel Industries', 'Raj Patel', '9876543211', 'approved', 72)`
  ).run(pass);

  db.prepare(
    `INSERT INTO users (email, password_hash, role, company_name, verification_status)
     VALUES ('admin@example.com', ?, 'admin', 'SupplyChain Shield Admin', 'approved')`
  ).run(pass);

  const transporterId = tResult.lastInsertRowid as number;
  const businessId = bResult.lastInsertRowid as number;

  const truckResult = db.prepare(
    `INSERT INTO trucks (transporter_id, vehicle_number, capacity, vehicle_type, driver_name, driver_phone, status)
     VALUES (?, 'MH-12-AB-1234', 15, 'Open', 'Ramesh Kumar', '9123456789', 'available'),
            (?, 'MH-14-CD-5678', 20, 'Container', 'Suresh Singh', '9123456790', 'available')`
  ).run(transporterId, transporterId);

  const truck1Id = truckResult.lastInsertRowid as number;

  const mumbai = city("Mumbai");
  const ahmedabad = city("Ahmedabad");
  const pune = city("Pune");
  const delhi = city("Delhi");
  const jaipur = city("Jaipur");

  const dist1 = getRouteDistance(mumbai, ahmedabad);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const pickupDate = tomorrow.toISOString().split("T")[0];
  const deadline = new Date(tomorrow);
  deadline.setDate(deadline.getDate() + 2);
  const departureTime = tomorrow.toISOString();

  db.prepare(
    `INSERT INTO routes (transporter_id, truck_id, from_city, to_city, from_lat, from_lng, to_lat, to_lng, distance_km, capacity_available, departure_time, status)
     VALUES (?, ?, 'Mumbai', 'Ahmedabad', ?, ?, ?, ?, ?, 15, ?, 'open')`
  ).run(transporterId, truck1Id, mumbai.lat, mumbai.lng, ahmedabad.lat, ahmedabad.lng, dist1, departureTime);

  const routeId = db.prepare("SELECT last_insert_rowid() as id").get() as { id: number };

  db.prepare(
    `INSERT INTO shipments (business_id, from_city, to_city, from_lat, from_lng, to_lat, to_lng, distance_km, cargo_type, weight, pickup_date, deadline, status)
     VALUES (?, 'Mumbai', 'Ahmedabad', ?, ?, ?, ?, ?, 'Electronics', 10, ?, ?, 'open'),
            (?, 'Pune', 'Delhi', ?, ?, ?, ?, ?, 'Textiles', 8, ?, ?, 'open'),
            (?, 'Delhi', 'Jaipur', ?, ?, ?, ?, ?, 'Food & Beverage', 5, ?, ?, 'open')`
  ).run(
    businessId, mumbai.lat, mumbai.lng, ahmedabad.lat, ahmedabad.lng, dist1, pickupDate, deadline.toISOString().split("T")[0],
    businessId, pune.lat, pune.lng, delhi.lat, delhi.lng, getRouteDistance(pune, delhi), pickupDate, deadline.toISOString().split("T")[0],
    businessId, delhi.lat, delhi.lng, jaipur.lat, jaipur.lng, getRouteDistance(delhi, jaipur), pickupDate, deadline.toISOString().split("T")[0]
  );

  const route = db.prepare("SELECT * FROM routes WHERE id = ?").get(routeId.id) as {
    id: number; from_city: string; to_city: string; from_lat: number; from_lng: number;
    to_lat: number; to_lng: number; distance_km: number; capacity_available: number; departure_time: string;
  };

  const shipments = db.prepare("SELECT * FROM shipments WHERE status = 'open'").all() as {
    id: number; from_city: string; to_city: string; from_lat: number; from_lng: number;
    to_lat: number; to_lng: number; weight: number; pickup_date: string; status: string;
  }[];

  for (const shipment of shipments) {
    const score = computeMatchScore(route as never, shipment as never);
    if (score > 0) {
      const fuel = calculateFuelSaved(route.distance_km);
      const co2 = calculateCo2Saved(fuel);
      const revenue = calculateRevenue(route.distance_km, shipment.weight);
      const cost = calculateBusinessCost(route.distance_km, shipment.weight);
      db.prepare(
        `INSERT OR IGNORE INTO matches (route_id, shipment_id, match_score, estimated_revenue, estimated_cost, fuel_saved, co2_saved)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      ).run(route.id, shipment.id, score, revenue, cost, fuel, co2);
    }
  }

  db.prepare(
    `INSERT INTO activities (user_id, action, details) VALUES
     (?, 'post_route', 'Sharma Logistics posted Mumbai → Ahmedabad route'),
     (?, 'post_shipment', 'Patel Industries posted Mumbai → Ahmedabad shipment')`
  ).run(transporterId, businessId);

  console.log("✅ Database seeded successfully!");
  console.log("\nDemo accounts:");
  console.log("  Transporter: transporter@example.com / pass");
  console.log("  Business:    business@example.com / pass");
  console.log("  Admin:       admin@example.com / pass");
  console.log("\nPre-seeded: 1 route (Mumbai→Ahmedabad), 3 shipments, AI matches ready.");
}

seed().catch(console.error);
