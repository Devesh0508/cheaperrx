// Temporary mock data — replaced by live Supabase queries in Step 8

export interface PharmacyResult {
  pharmacy_id: string;
  pharmacy_name: string;
  chain: string | null;
  address: string;
  city: string;
  phone: string | null;
  has_delivery: boolean;
  delivery_fee: number | null;
  accepts_alberta_blue_cross: boolean;
  accepts_odb: boolean;
  price: number;
  quantity: number;
  last_updated: string;
}

export interface DrugResult {
  id: string;
  brand_name: string;
  generic_name: string;
  strength: string;
  dosage_form: string;
  is_generic: boolean;
  generic_alternative?: {
    id: string;
    brand_name: string;
    generic_name: string;
    strength: string;
    avg_price: number;
  } | null;
}

export const MOCK_DRUG: DrugResult = {
  id: "mock-drug-1",
  brand_name: "Lipitor",
  generic_name: "Atorvastatin",
  strength: "40mg",
  dosage_form: "tablet",
  is_generic: false,
  generic_alternative: {
    id: "mock-generic-1",
    brand_name: "Atorvastatin (Generic)",
    generic_name: "Atorvastatin",
    strength: "40mg",
    avg_price: 14.5,
  },
};

export const MOCK_PRICES: PharmacyResult[] = [
  {
    pharmacy_id: "p1",
    pharmacy_name: "Costco Pharmacy",
    chain: "Costco",
    address: "88 Beacon Hill Dr NE",
    city: "Calgary",
    phone: "(403) 226-0600",
    has_delivery: false,
    delivery_fee: null,
    accepts_alberta_blue_cross: true,
    accepts_odb: false,
    price: 18.5,
    quantity: 30,
    last_updated: new Date().toISOString(),
  },
  {
    pharmacy_id: "p2",
    pharmacy_name: "Walmart Pharmacy",
    chain: "Walmart",
    address: "250 Shawville Blvd SE",
    city: "Calgary",
    phone: "(403) 254-3456",
    has_delivery: false,
    delivery_fee: null,
    accepts_alberta_blue_cross: true,
    accepts_odb: false,
    price: 22.75,
    quantity: 30,
    last_updated: new Date().toISOString(),
  },
  {
    pharmacy_id: "p3",
    pharmacy_name: "Safeway Pharmacy",
    chain: "Safeway",
    address: "3715 Brentwood Rd NW",
    city: "Calgary",
    phone: "(403) 289-7450",
    has_delivery: true,
    delivery_fee: 5.99,
    accepts_alberta_blue_cross: true,
    accepts_odb: false,
    price: 28.9,
    quantity: 30,
    last_updated: new Date().toISOString(),
  },
  {
    pharmacy_id: "p4",
    pharmacy_name: "Rexall Pharmacy",
    chain: "Rexall",
    address: "1645 17 Ave SW",
    city: "Calgary",
    phone: "(403) 245-0077",
    has_delivery: true,
    delivery_fee: 4.99,
    accepts_alberta_blue_cross: true,
    accepts_odb: false,
    price: 31.2,
    quantity: 30,
    last_updated: new Date().toISOString(),
  },
  {
    pharmacy_id: "p5",
    pharmacy_name: "London Drugs",
    chain: "London Drugs",
    address: "150 Crowfoot Cres NW",
    city: "Calgary",
    phone: "(403) 241-9888",
    has_delivery: true,
    delivery_fee: 0,
    accepts_alberta_blue_cross: true,
    accepts_odb: false,
    price: 33.4,
    quantity: 30,
    last_updated: new Date().toISOString(),
  },
  {
    pharmacy_id: "p6",
    pharmacy_name: "Community Natural Foods",
    chain: null,
    address: "1304 10 Ave SW",
    city: "Calgary",
    phone: "(403) 229-2383",
    has_delivery: false,
    delivery_fee: null,
    accepts_alberta_blue_cross: false,
    accepts_odb: false,
    price: 35.1,
    quantity: 30,
    last_updated: new Date().toISOString(),
  },
  {
    pharmacy_id: "p7",
    pharmacy_name: "Shoppers Drug Mart",
    chain: "Shoppers",
    address: "Chinook Centre, 6455 Macleod Trail SW",
    city: "Calgary",
    phone: "(403) 252-4848",
    has_delivery: true,
    delivery_fee: 0,
    accepts_alberta_blue_cross: true,
    accepts_odb: false,
    price: 38.75,
    quantity: 30,
    last_updated: new Date().toISOString(),
  },
  {
    pharmacy_id: "p8",
    pharmacy_name: "Shoppers Drug Mart",
    chain: "Shoppers",
    address: "Sunridge Mall, 2525 36 St NE",
    city: "Calgary",
    phone: "(403) 285-4441",
    has_delivery: true,
    delivery_fee: 0,
    accepts_alberta_blue_cross: true,
    accepts_odb: false,
    price: 39.5,
    quantity: 30,
    last_updated: new Date().toISOString(),
  },
];
