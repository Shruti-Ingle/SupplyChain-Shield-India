import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "demo-store.json");

type Store = {
  users: any[];
  journeys: any[];
  shipments: any[];
  bookings: any[];
  stats: {
    trips_matched: number;
    empty_trips_avoided: number;
    fuel_saved: number;
    co2_reduced: number;
  };
};

const defaultStore: Store = {
  users: [
    { id: 1, email: "vedant.admin@test.com", role: "admin", company_name: "Vedant Pathak", verification_status: "approved" },
    { id: 2, email: "shruti.admin@test.com", role: "admin", company_name: "Shruti Ingle", verification_status: "approved" },
    { id: 3, email: "business@test.com", role: "business", company_name: "FreshFarm Traders", verification_status: "approved" },
    { id: 4, email: "transporter@test.com", role: "transporter", company_name: "Green Logistics", verification_status: "approved" }
  ],
  journeys: [],
  shipments: [],
  bookings: [],
  stats: {
    trips_matched: 0,
    empty_trips_avoided: 0,
    fuel_saved: 0,
    co2_reduced: 0
  }
};

function ensureStore() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(defaultStore, null, 2), "utf8");
  }
}

export function readStore(): Store {
  ensureStore();
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}

export function writeStore(store: Store) {
  ensureStore();
  fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), "utf8");
}

export function getRoleFromEmail(email: string) {
  const e = email.toLowerCase();

  if (e === "vedant.admin@test.com" || e === "shruti.admin@test.com" || e.includes("admin")) {
    return "admin";
  }

  if (e.includes("transport")) {
    return "transporter";
  }

  return "business";
}

export function getCompanyFromEmail(email: string) {
  const e = email.toLowerCase();

  if (e === "vedant.admin@test.com") return "Vedant Pathak";
  if (e === "shruti.admin@test.com") return "Shruti Ingle";
  if (e.includes("transport")) return "Green Logistics";

  return "Business User";
}
