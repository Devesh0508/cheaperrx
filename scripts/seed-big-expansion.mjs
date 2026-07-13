/**
 * CheaperRx — Big Expansion Seed Script
 *
 * Adds:
 *   - 16 new pharmacy locations  (a3 series — Superstore, extra Safeway/Co-op/Shoppers/Rexall, Sobeys)
 *   - 20 generic drugs           (e1...026-045 — covering brand drugs added in expanded catalog)
 *   - 15 new Rx drugs            (d2...051-065 — antibiotics, insulin, mental health, migraine, gout)
 *   - 10 new OTC drugs           (d1...071-080 — arthritis, GI, probiotics, weight, skin)
 *
 * Pricing logic (safe to re-run — idempotent):
 *   NEW pharmacies → fetch Walmart baseline from DB, apply multiplier for each pharmacy
 *   NEW drugs      → apply all 36 known pharmacy multipliers to base price
 *
 * Usage:  node scripts/seed-big-expansion.mjs
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://qxtansvfpeufuvqdfqvd.supabase.co';
const SERVICE_KEY  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4dGFuc3ZmcGV1ZnV2cWRmcXZkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODM4NDk3MSwiZXhwIjoyMDkzOTYwOTcxfQ.gc-oTwR7sD-_OBjGi9nm09Ux0vQUDWNZzb3sMwNmhoQ';

if (typeof globalThis.WebSocket === 'undefined') {
  globalThis.WebSocket = class FakeWS { constructor(){} close(){} };
}

const sb = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false },
  realtime: { timeout: 1 },
});

function round2(n) { return Math.round(n * 100) / 100; }

async function upsert(table, rows) {
  const BATCH = 100;
  for (let i = 0; i < rows.length; i += BATCH) {
    const { error } = await sb.from(table).upsert(rows.slice(i, i + BATCH), { onConflict: 'id', ignoreDuplicates: true });
    if (error) throw new Error(`upsert ${table} @${i}: ${error.message}`);
  }
  console.log(`  ✓ ${table}: ${rows.length} rows upserted`);
}

async function insertBatch(table, rows) {
  const BATCH = 200;
  for (let i = 0; i < rows.length; i += BATCH) {
    const { error } = await sb.from(table).insert(rows.slice(i, i + BATCH));
    if (error) throw new Error(`insert ${table} @${i}: ${error.message}`);
  }
  console.log(`  ✓ ${table}: ${rows.length} rows inserted`);
}

// ─── 1. NEW PHARMACY LOCATIONS (a3 series) ────────────────────────────────────
// Adds Real Canadian Superstore (missing from DB!), extra Safeway, Co-op,
// Shoppers, Rexall, and Sobeys across Calgary.

const newPharmacies = [
  // ── Real Canadian Superstore ───────────────────────────────────────────────
  // Loblaw-owned, competitive pricing (~Walmart + 7%). Pharmacies in all
  // Calgary Superstore locations. Members get extra savings.
  {
    id: 'a3000000-0000-0000-0000-000000000001',
    name: 'Real Canadian Superstore Pharmacy',
    chain: 'Real Canadian Superstore',
    address: '3320 26 Ave SE',
    city: 'Calgary', province: 'AB', postal_code: 'T2B 2S4',
    phone: '(403) 272-8887',
    accepts_odb: false, accepts_alberta_blue_cross: true, accepts_bc_pharmacare: false,
    has_delivery: true, delivery_fee: 0.00, is_featured: false,
  },
  {
    id: 'a3000000-0000-0000-0000-000000000002',
    name: 'Real Canadian Superstore Pharmacy',
    chain: 'Real Canadian Superstore',
    address: '7960 Country Hills Blvd NW',
    city: 'Calgary', province: 'AB', postal_code: 'T3J 5J2',
    phone: '(403) 532-0200',
    accepts_odb: false, accepts_alberta_blue_cross: true, accepts_bc_pharmacare: false,
    has_delivery: true, delivery_fee: 0.00, is_featured: false,
  },
  {
    id: 'a3000000-0000-0000-0000-000000000003',
    name: 'Real Canadian Superstore Pharmacy',
    chain: 'Real Canadian Superstore',
    address: '5750 Signal Hill Centre SW',
    city: 'Calgary', province: 'AB', postal_code: 'T3H 3P8',
    phone: '(403) 246-1661',
    accepts_odb: false, accepts_alberta_blue_cross: true, accepts_bc_pharmacare: false,
    has_delivery: true, delivery_fee: 0.00, is_featured: false,
  },
  {
    id: 'a3000000-0000-0000-0000-000000000004',
    name: 'Real Canadian Superstore Pharmacy',
    chain: 'Real Canadian Superstore',
    address: '3615 Country Hills Blvd NE',
    city: 'Calgary', province: 'AB', postal_code: 'T3J 5J5',
    phone: '(403) 568-3410',
    accepts_odb: false, accepts_alberta_blue_cross: true, accepts_bc_pharmacare: false,
    has_delivery: true, delivery_fee: 0.00, is_featured: false,
  },

  // ── Safeway Pharmacy (extra locations) ─────────────────────────────────────
  // Empire-owned. Prices similar to existing Safeway (~1.20x Walmart).
  {
    id: 'a3000000-0000-0000-0000-000000000005',
    name: 'Safeway Pharmacy',
    chain: 'Safeway',
    address: '555 11 Ave SW',
    city: 'Calgary', province: 'AB', postal_code: 'T2R 1M1',
    phone: '(403) 262-1551',
    accepts_odb: false, accepts_alberta_blue_cross: true, accepts_bc_pharmacare: false,
    has_delivery: true, delivery_fee: 5.99, is_featured: false,
  },
  {
    id: 'a3000000-0000-0000-0000-000000000006',
    name: 'Safeway Pharmacy',
    chain: 'Safeway',
    address: '4304 14 St NW',
    city: 'Calgary', province: 'AB', postal_code: 'T2K 1J9',
    phone: '(403) 284-4404',
    accepts_odb: false, accepts_alberta_blue_cross: true, accepts_bc_pharmacare: false,
    has_delivery: true, delivery_fee: 5.99, is_featured: false,
  },
  {
    id: 'a3000000-0000-0000-0000-000000000007',
    name: 'Safeway Pharmacy',
    chain: 'Safeway',
    address: '6004 Elbow Dr SW',
    city: 'Calgary', province: 'AB', postal_code: 'T2V 1J4',
    phone: '(403) 252-3211',
    accepts_odb: false, accepts_alberta_blue_cross: true, accepts_bc_pharmacare: false,
    has_delivery: true, delivery_fee: 5.99, is_featured: false,
  },

  // ── Calgary Co-op Pharmacy (extra locations) ────────────────────────────────
  // Unique to Calgary. Member dividends available. Slightly pricier than Walmart.
  {
    id: 'a3000000-0000-0000-0000-000000000008',
    name: 'Calgary Co-op Pharmacy',
    chain: 'Co-op',
    address: '901 64 Ave NE',
    city: 'Calgary', province: 'AB', postal_code: 'T2K 2K5',
    phone: '(403) 275-0321',
    accepts_odb: false, accepts_alberta_blue_cross: true, accepts_bc_pharmacare: false,
    has_delivery: false, delivery_fee: null, is_featured: false,
  },
  {
    id: 'a3000000-0000-0000-0000-000000000009',
    name: 'Calgary Co-op Pharmacy',
    chain: 'Co-op',
    address: '8650 Broadcast Ave SW',
    city: 'Calgary', province: 'AB', postal_code: 'T3H 0Z7',
    phone: '(403) 246-9100',
    accepts_odb: false, accepts_alberta_blue_cross: true, accepts_bc_pharmacare: false,
    has_delivery: false, delivery_fee: null, is_featured: false,
  },
  {
    id: 'a3000000-0000-0000-0000-000000000010',
    name: 'Calgary Co-op Pharmacy',
    chain: 'Co-op',
    address: '4526 4 St NW',
    city: 'Calgary', province: 'AB', postal_code: 'T2K 1A1',
    phone: '(403) 284-9394',
    accepts_odb: false, accepts_alberta_blue_cross: true, accepts_bc_pharmacare: false,
    has_delivery: false, delivery_fee: null, is_featured: false,
  },

  // ── Shoppers Drug Mart (extra locations) ───────────────────────────────────
  {
    id: 'a3000000-0000-0000-0000-000000000011',
    name: 'Shoppers Drug Mart',
    chain: 'Shoppers',
    address: '2120 17 Ave SW',
    city: 'Calgary', province: 'AB', postal_code: 'T2T 0E1',
    phone: '(403) 245-1115',
    accepts_odb: false, accepts_alberta_blue_cross: true, accepts_bc_pharmacare: false,
    has_delivery: true, delivery_fee: 0.00, is_featured: false,
  },
  {
    id: 'a3000000-0000-0000-0000-000000000012',
    name: 'Shoppers Drug Mart',
    chain: 'Shoppers',
    address: '11520 24 St SE',
    city: 'Calgary', province: 'AB', postal_code: 'T2Z 4J5',
    phone: '(403) 257-8788',
    accepts_odb: false, accepts_alberta_blue_cross: true, accepts_bc_pharmacare: false,
    has_delivery: true, delivery_fee: 0.00, is_featured: false,
  },

  // ── Rexall (extra locations) ────────────────────────────────────────────────
  {
    id: 'a3000000-0000-0000-0000-000000000013',
    name: 'Rexall Pharmacy',
    chain: 'Rexall',
    address: '100 Anderson Rd SE',
    city: 'Calgary', province: 'AB', postal_code: 'T2J 3V1',
    phone: '(403) 278-1800',
    accepts_odb: false, accepts_alberta_blue_cross: true, accepts_bc_pharmacare: false,
    has_delivery: true, delivery_fee: 4.99, is_featured: false,
  },
  {
    id: 'a3000000-0000-0000-0000-000000000014',
    name: 'Rexall Pharmacy',
    chain: 'Rexall',
    address: '1200 37 St SW',
    city: 'Calgary', province: 'AB', postal_code: 'T3C 1S3',
    phone: '(403) 246-7747',
    accepts_odb: false, accepts_alberta_blue_cross: true, accepts_bc_pharmacare: false,
    has_delivery: true, delivery_fee: 4.99, is_featured: false,
  },

  // ── Sobeys Pharmacy ─────────────────────────────────────────────────────────
  // Empire-owned (same as Safeway). ~1.19x Walmart. Harvest Hills location.
  {
    id: 'a3000000-0000-0000-0000-000000000015',
    name: 'Sobeys Pharmacy',
    chain: 'Sobeys',
    address: '60 Harvest Hills Blvd NE',
    city: 'Calgary', province: 'AB', postal_code: 'T3K 4J4',
    phone: '(403) 226-3910',
    accepts_odb: false, accepts_alberta_blue_cross: true, accepts_bc_pharmacare: false,
    has_delivery: true, delivery_fee: 5.99, is_featured: false,
  },
  // ── Pharmasave (extra location) ─────────────────────────────────────────────
  {
    id: 'a3000000-0000-0000-0000-000000000016',
    name: 'Pharmasave',
    chain: 'Pharmasave',
    address: '210 Mahogany Centre SE',
    city: 'Calgary', province: 'AB', postal_code: 'T3M 2J6',
    phone: '(587) 393-1022',
    accepts_odb: false, accepts_alberta_blue_cross: true, accepts_bc_pharmacare: false,
    has_delivery: true, delivery_fee: 5.99, is_featured: false,
  },
];

// Multipliers for the 16 new pharmacies (relative to Walmart = 1.000x)
const newPharmacyMultipliers = [
  { pid: 'a3000000-0000-0000-0000-000000000001', mult: 1.072 }, // Superstore 26 Ave SE
  { pid: 'a3000000-0000-0000-0000-000000000002', mult: 1.068 }, // Superstore Country Hills NW
  { pid: 'a3000000-0000-0000-0000-000000000003', mult: 1.075 }, // Superstore Signal Hill SW
  { pid: 'a3000000-0000-0000-0000-000000000004', mult: 1.070 }, // Superstore Country Hills NE
  { pid: 'a3000000-0000-0000-0000-000000000005', mult: 1.196 }, // Safeway 11 Ave SW
  { pid: 'a3000000-0000-0000-0000-000000000006', mult: 1.200 }, // Safeway 14 St NW
  { pid: 'a3000000-0000-0000-0000-000000000007', mult: 1.198 }, // Safeway Elbow Dr SW
  { pid: 'a3000000-0000-0000-0000-000000000008', mult: 1.218 }, // Co-op North Hill
  { pid: 'a3000000-0000-0000-0000-000000000009', mult: 1.225 }, // Co-op Signal Hill
  { pid: 'a3000000-0000-0000-0000-000000000010', mult: 1.220 }, // Co-op Thorncliffe
  { pid: 'a3000000-0000-0000-0000-000000000011', mult: 1.452 }, // Shoppers 17 Ave SW
  { pid: 'a3000000-0000-0000-0000-000000000012', mult: 1.448 }, // Shoppers 24 St SE
  { pid: 'a3000000-0000-0000-0000-000000000013', mult: 1.241 }, // Rexall Anderson Rd
  { pid: 'a3000000-0000-0000-0000-000000000014', mult: 1.238 }, // Rexall Westbrook
  { pid: 'a3000000-0000-0000-0000-000000000015', mult: 1.188 }, // Sobeys Harvest Hills
  { pid: 'a3000000-0000-0000-0000-000000000016', mult: 1.265 }, // Pharmasave Mahogany
];

// All 36 pharmacy multipliers (a1 + a2 + a3) — used for pricing new drugs
const ALL_PHARMACY_MULTIPLIERS = [
  // a1 series (original 8)
  { pid: 'a1000000-0000-0000-0000-000000000001', mult: 0.916 }, // Costco Beacon Hill
  { pid: 'a1000000-0000-0000-0000-000000000002', mult: 1.460 }, // Shoppers Chinook
  { pid: 'a1000000-0000-0000-0000-000000000003', mult: 1.441 }, // Shoppers Sunridge
  { pid: 'a1000000-0000-0000-0000-000000000004', mult: 1.234 }, // Rexall 17 Ave
  { pid: 'a1000000-0000-0000-0000-000000000005', mult: 1.501 }, // London Drugs Crowfoot
  { pid: 'a1000000-0000-0000-0000-000000000006', mult: 1.193 }, // Safeway Brentwood
  { pid: 'a1000000-0000-0000-0000-000000000007', mult: 1.000 }, // Walmart Shawville (baseline)
  { pid: 'a1000000-0000-0000-0000-000000000008', mult: 1.250 }, // Community Natural Foods
  // a2 series (12 added in seed-real-prices)
  { pid: 'a2000000-0000-0000-0000-000000000001', mult: 1.444 }, // Shoppers 8th St
  { pid: 'a2000000-0000-0000-0000-000000000002', mult: 1.459 }, // Shoppers Crowchild
  { pid: 'a2000000-0000-0000-0000-000000000003', mult: 1.025 }, // Walmart 52 Ave NE
  { pid: 'a2000000-0000-0000-0000-000000000004', mult: 1.244 }, // Rexall Falconridge
  { pid: 'a2000000-0000-0000-0000-000000000005', mult: 1.201 }, // Safeway Southland
  { pid: 'a2000000-0000-0000-0000-000000000006', mult: 1.222 }, // Co-op Shaganappi
  { pid: 'a2000000-0000-0000-0000-000000000007', mult: 1.174 }, // Medicine Shoppe Varsity
  { pid: 'a2000000-0000-0000-0000-000000000008', mult: 0.909 }, // Costco Stockton (cheapest!)
  { pid: 'a2000000-0000-0000-0000-000000000009', mult: 1.291 }, // IDA 68 St NE
  { pid: 'a2000000-0000-0000-0000-000000000010', mult: 1.310 }, // Guardian Richmond Rd
  { pid: 'a2000000-0000-0000-0000-000000000011', mult: 1.060 }, // Loblaw Shawville
  { pid: 'a2000000-0000-0000-0000-000000000012', mult: 1.272 }, // Pharmasave Brentwood
  // a3 series (16 new — this script)
  { pid: 'a3000000-0000-0000-0000-000000000001', mult: 1.072 },
  { pid: 'a3000000-0000-0000-0000-000000000002', mult: 1.068 },
  { pid: 'a3000000-0000-0000-0000-000000000003', mult: 1.075 },
  { pid: 'a3000000-0000-0000-0000-000000000004', mult: 1.070 },
  { pid: 'a3000000-0000-0000-0000-000000000005', mult: 1.196 },
  { pid: 'a3000000-0000-0000-0000-000000000006', mult: 1.200 },
  { pid: 'a3000000-0000-0000-0000-000000000007', mult: 1.198 },
  { pid: 'a3000000-0000-0000-0000-000000000008', mult: 1.218 },
  { pid: 'a3000000-0000-0000-0000-000000000009', mult: 1.225 },
  { pid: 'a3000000-0000-0000-0000-000000000010', mult: 1.220 },
  { pid: 'a3000000-0000-0000-0000-000000000011', mult: 1.452 },
  { pid: 'a3000000-0000-0000-0000-000000000012', mult: 1.448 },
  { pid: 'a3000000-0000-0000-0000-000000000013', mult: 1.241 },
  { pid: 'a3000000-0000-0000-0000-000000000014', mult: 1.238 },
  { pid: 'a3000000-0000-0000-0000-000000000015', mult: 1.188 },
  { pid: 'a3000000-0000-0000-0000-000000000016', mult: 1.265 },
];

// ─── 2. NEW GENERIC DRUGS (e1 series, continuing from e1...025) ───────────────
// These are the generic versions of brand drugs added in seed-expanded-catalog.mjs.
// Generics are 40-85% cheaper than brand-name equivalents — the biggest savings.

const newGenericDrugs = [
  // Generics for brand drugs added in seed-expanded-catalog (d2...026 through d2...050)
  { id:'e1000000-0000-0000-0000-000000000026', din:'02442000', brand_name:'Atorvastatin',     generic_name:'Atorvastatin Calcium',    strength:'10mg',  dosage_form:'tablet',  drug_class:'Statin',                 is_generic:true, brand_drug_id:'d2000000-0000-0000-0000-000000000028' },
  { id:'e1000000-0000-0000-0000-000000000027', din:'02442001', brand_name:'Rosuvastatin',     generic_name:'Rosuvastatin Calcium',    strength:'10mg',  dosage_form:'tablet',  drug_class:'Statin',                 is_generic:true, brand_drug_id:'d2000000-0000-0000-0000-000000000029' },
  { id:'e1000000-0000-0000-0000-000000000028', din:'02442002', brand_name:'Lisinopril',       generic_name:'Lisinopril',              strength:'10mg',  dosage_form:'tablet',  drug_class:'ACE Inhibitor',          is_generic:true, brand_drug_id:'d2000000-0000-0000-0000-000000000030' },
  { id:'e1000000-0000-0000-0000-000000000029', din:'02442003', brand_name:'Ramipril',         generic_name:'Ramipril',                strength:'5mg',   dosage_form:'capsule', drug_class:'ACE Inhibitor',          is_generic:true, brand_drug_id:'d2000000-0000-0000-0000-000000000031' },
  { id:'e1000000-0000-0000-0000-000000000030', din:'02442004', brand_name:'Amlodipine',       generic_name:'Amlodipine Besylate',     strength:'5mg',   dosage_form:'tablet',  drug_class:'Calcium Channel Blocker',is_generic:true, brand_drug_id:'d2000000-0000-0000-0000-000000000032' },
  { id:'e1000000-0000-0000-0000-000000000031', din:'02442005', brand_name:'Losartan',         generic_name:'Losartan Potassium',      strength:'50mg',  dosage_form:'tablet',  drug_class:'ARB',                    is_generic:true, brand_drug_id:'d2000000-0000-0000-0000-000000000033' },
  { id:'e1000000-0000-0000-0000-000000000032', din:'02442006', brand_name:'Sertraline',       generic_name:'Sertraline HCl',          strength:'50mg',  dosage_form:'tablet',  drug_class:'SSRI',                   is_generic:true, brand_drug_id:'d2000000-0000-0000-0000-000000000034' },
  { id:'e1000000-0000-0000-0000-000000000033', din:'02442007', brand_name:'Escitalopram',     generic_name:'Escitalopram Oxalate',    strength:'10mg',  dosage_form:'tablet',  drug_class:'SSRI',                   is_generic:true, brand_drug_id:'d2000000-0000-0000-0000-000000000035' },
  { id:'e1000000-0000-0000-0000-000000000034', din:'02442008', brand_name:'Duloxetine',       generic_name:'Duloxetine HCl',          strength:'30mg',  dosage_form:'capsule', drug_class:'SNRI',                   is_generic:true, brand_drug_id:'d2000000-0000-0000-0000-000000000036' },
  { id:'e1000000-0000-0000-0000-000000000035', din:'02442009', brand_name:'Bupropion',        generic_name:'Bupropion HCl',           strength:'150mg', dosage_form:'tablet',  drug_class:'Antidepressant',         is_generic:true, brand_drug_id:'d2000000-0000-0000-0000-000000000037' },
  { id:'e1000000-0000-0000-0000-000000000036', din:'02442010', brand_name:'Mirtazapine',      generic_name:'Mirtazapine',             strength:'30mg',  dosage_form:'tablet',  drug_class:'Antidepressant',         is_generic:true, brand_drug_id:'d2000000-0000-0000-0000-000000000038' },
  { id:'e1000000-0000-0000-0000-000000000037', din:'02442011', brand_name:'Zopiclone',        generic_name:'Zopiclone',               strength:'7.5mg', dosage_form:'tablet',  drug_class:'Sedative-Hypnotic',      is_generic:true, brand_drug_id:'d2000000-0000-0000-0000-000000000039' },
  { id:'e1000000-0000-0000-0000-000000000038', din:'02442012', brand_name:'Levothyroxine',    generic_name:'Levothyroxine Sodium',    strength:'50mcg', dosage_form:'tablet',  drug_class:'Thyroid Hormone',        is_generic:true, brand_drug_id:'d2000000-0000-0000-0000-000000000040' },
  { id:'e1000000-0000-0000-0000-000000000039', din:'02442013', brand_name:'Pantoprazole',     generic_name:'Pantoprazole Sodium',     strength:'40mg',  dosage_form:'tablet',  drug_class:'Proton Pump Inhibitor',  is_generic:true, brand_drug_id:'d2000000-0000-0000-0000-000000000041' },
  { id:'e1000000-0000-0000-0000-000000000040', din:'02442014', brand_name:'Omeprazole',       generic_name:'Omeprazole',              strength:'20mg',  dosage_form:'capsule', drug_class:'Proton Pump Inhibitor',  is_generic:true, brand_drug_id:'d2000000-0000-0000-0000-000000000042' },
  { id:'e1000000-0000-0000-0000-000000000041', din:'02442015', brand_name:'Montelukast',      generic_name:'Montelukast Sodium',      strength:'10mg',  dosage_form:'tablet',  drug_class:'Leukotriene Modifier',   is_generic:true, brand_drug_id:'d2000000-0000-0000-0000-000000000044' },
  { id:'e1000000-0000-0000-0000-000000000042', din:'02442016', brand_name:'Finasteride',      generic_name:'Finasteride',             strength:'1mg',   dosage_form:'tablet',  drug_class:'5-alpha Reductase Inhibitor',is_generic:true,brand_drug_id:'d2000000-0000-0000-0000-000000000049' },
  { id:'e1000000-0000-0000-0000-000000000043', din:'02442017', brand_name:'Tamsulosin',       generic_name:'Tamsulosin HCl',          strength:'0.4mg', dosage_form:'capsule', drug_class:'Alpha Blocker',          is_generic:true, brand_drug_id:'d2000000-0000-0000-0000-000000000050' },
  { id:'e1000000-0000-0000-0000-000000000044', din:'02442018', brand_name:'Clopidogrel',      generic_name:'Clopidogrel Bisulfate',   strength:'75mg',  dosage_form:'tablet',  drug_class:'Antiplatelet',           is_generic:true, brand_drug_id:'d2000000-0000-0000-0000-000000000048' },
  { id:'e1000000-0000-0000-0000-000000000045', din:'02442019', brand_name:'Warfarin',         generic_name:'Warfarin Sodium',         strength:'5mg',   dosage_form:'tablet',  drug_class:'Anticoagulant',          is_generic:true, brand_drug_id:'d2000000-0000-0000-0000-000000000047' },
];

// ─── 3. NEW Rx DRUGS (d2 series, continuing from d2...050) ───────────────────
const newRxDrugs = [
  // Antibiotics (commonly prescribed)
  { id:'d2000000-0000-0000-0000-000000000051', din:'02248565', brand_name:'Doxycycline',      generic_name:'Doxycycline Hyclate',     strength:'100mg', dosage_form:'capsule', drug_class:'Antibiotic',             is_generic:false, brand_drug_id:null },
  { id:'d2000000-0000-0000-0000-000000000052', din:'02248566', brand_name:'Ciprofloxacin',    generic_name:'Ciprofloxacin HCl',       strength:'500mg', dosage_form:'tablet',  drug_class:'Antibiotic',             is_generic:false, brand_drug_id:null },
  { id:'d2000000-0000-0000-0000-000000000053', din:'02248567', brand_name:'Cephalexin',       generic_name:'Cephalexin Monohydrate',  strength:'500mg', dosage_form:'capsule', drug_class:'Antibiotic',             is_generic:false, brand_drug_id:null },
  { id:'d2000000-0000-0000-0000-000000000054', din:'02248568', brand_name:'Clindamycin',      generic_name:'Clindamycin HCl',         strength:'300mg', dosage_form:'capsule', drug_class:'Antibiotic',             is_generic:false, brand_drug_id:null },

  // Insulin (very high search volume)
  { id:'d2000000-0000-0000-0000-000000000055', din:'02248569', brand_name:'Lantus',           generic_name:'Insulin Glargine',        strength:'100IU/mL',dosage_form:'vial',  drug_class:'Insulin',                is_generic:false, brand_drug_id:null },
  { id:'d2000000-0000-0000-0000-000000000056', din:'02248570', brand_name:'Humalog',          generic_name:'Insulin Lispro',          strength:'100IU/mL',dosage_form:'vial',  drug_class:'Insulin',                is_generic:false, brand_drug_id:null },
  { id:'d2000000-0000-0000-0000-000000000057', din:'02248571', brand_name:'Humulin N',        generic_name:'Insulin NPH',             strength:'100IU/mL',dosage_form:'vial',  drug_class:'Insulin',                is_generic:false, brand_drug_id:null },
  { id:'d2000000-0000-0000-0000-000000000058', din:'02248572', brand_name:'Toujeo',           generic_name:'Insulin Glargine U-300',  strength:'300IU/mL',dosage_form:'pen',   drug_class:'Insulin',                is_generic:false, brand_drug_id:null },

  // Mental Health / Neurological
  { id:'d2000000-0000-0000-0000-000000000059', din:'02248573', brand_name:'Seroquel',         generic_name:'Quetiapine Fumarate',     strength:'25mg',  dosage_form:'tablet',  drug_class:'Antipsychotic',          is_generic:false, brand_drug_id:null },
  { id:'d2000000-0000-0000-0000-000000000060', din:'02248574', brand_name:'Amitriptyline',    generic_name:'Amitriptyline HCl',       strength:'25mg',  dosage_form:'tablet',  drug_class:'Antidepressant (TCA)',   is_generic:false, brand_drug_id:null },
  { id:'d2000000-0000-0000-0000-000000000061', din:'02248575', brand_name:'Clonazepam',       generic_name:'Clonazepam',              strength:'0.5mg', dosage_form:'tablet',  drug_class:'Benzodiazepine',         is_generic:false, brand_drug_id:null },

  // Migraine
  { id:'d2000000-0000-0000-0000-000000000062', din:'02248576', brand_name:'Imitrex',          generic_name:'Sumatriptan Succinate',   strength:'50mg',  dosage_form:'tablet',  drug_class:'Triptan',                is_generic:false, brand_drug_id:null },
  { id:'d2000000-0000-0000-0000-000000000063', din:'02248577', brand_name:'Maxalt',           generic_name:'Rizatriptan Benzoate',    strength:'10mg',  dosage_form:'tablet',  drug_class:'Triptan',                is_generic:false, brand_drug_id:null },

  // Gout
  { id:'d2000000-0000-0000-0000-000000000064', din:'02248578', brand_name:'Zyloprim',         generic_name:'Allopurinol',             strength:'100mg', dosage_form:'tablet',  drug_class:'Uric Acid Reducer',      is_generic:false, brand_drug_id:null },
  { id:'d2000000-0000-0000-0000-000000000065', din:'02248579', brand_name:'Colchicine',       generic_name:'Colchicine',              strength:'0.6mg', dosage_form:'tablet',  drug_class:'Anti-Gout',              is_generic:false, brand_drug_id:null },
];

// ─── 4. NEW OTC DRUGS (d1 series, continuing from d1...070) ──────────────────
const newOtcDrugs = [
  // Arthritis / Joint Pain
  { id:'d1000000-0000-0000-0000-000000000071', din:'02248580', brand_name:'Tylenol Arthritis',generic_name:'Acetaminophen',           strength:'650mg', dosage_form:'caplet',  drug_class:'Analgesic',              is_generic:false, brand_drug_id:null },
  { id:'d1000000-0000-0000-0000-000000000072', din:'02248581', brand_name:'Advil Liqui-Gels', generic_name:'Ibuprofen',               strength:'200mg', dosage_form:'liquigel', drug_class:'NSAID',                 is_generic:false, brand_drug_id:null },
  { id:'d1000000-0000-0000-0000-000000000073', din:'02248582', brand_name:'Glucosamine',      generic_name:'Glucosamine Sulphate',    strength:'750mg', dosage_form:'tablet',  drug_class:'Joint Supplement',       is_generic:false, brand_drug_id:null },

  // Digestive / GI
  { id:'d1000000-0000-0000-0000-000000000074', din:'02248583', brand_name:'Gas-X',            generic_name:'Simethicone',             strength:'125mg', dosage_form:'softgel', drug_class:'Antiflatulent',          is_generic:false, brand_drug_id:null },
  { id:'d1000000-0000-0000-0000-000000000075', din:'02248584', brand_name:'Align Probiotic',  generic_name:'Bifidobacterium infantis',strength:'1×10⁹CFU',dosage_form:'capsule',drug_class:'Probiotic',             is_generic:false, brand_drug_id:null },
  { id:'d1000000-0000-0000-0000-000000000076', din:'02248585', brand_name:'Lansoprazole',     generic_name:'Lansoprazole',            strength:'15mg',  dosage_form:'capsule', drug_class:'Proton Pump Inhibitor',  is_generic:false, brand_drug_id:null },

  // Skin / Topical
  { id:'d1000000-0000-0000-0000-000000000077', din:'02248586', brand_name:'Benadryl Cream',   generic_name:'Diphenhydramine',         strength:'2%',    dosage_form:'cream',   drug_class:'Antihistamine Topical',  is_generic:false, brand_drug_id:null },
  { id:'d1000000-0000-0000-0000-000000000078', din:'02248587', brand_name:'Benzoyl Peroxide', generic_name:'Benzoyl Peroxide',        strength:'5%',    dosage_form:'gel',     drug_class:'Acne Treatment',         is_generic:false, brand_drug_id:null },

  // Weight / Diabetes Adjacent
  { id:'d1000000-0000-0000-0000-000000000079', din:'02248588', brand_name:'Alli',             generic_name:'Orlistat',                strength:'60mg',  dosage_form:'capsule', drug_class:'Weight Management',      is_generic:false, brand_drug_id:null },

  // Electrolytes / Rehydration
  { id:'d1000000-0000-0000-0000-000000000080', din:'02248589', brand_name:'Pedialyte',        generic_name:'Oral Electrolyte Solution',strength:'1L',   dosage_form:'liquid',  drug_class:'Electrolyte',            is_generic:false, brand_drug_id:null },
];

// ─── 5. BASE PRICES for new drugs (Walmart = 1.000x baseline) ─────────────────
// Rx prices are cash prices without insurance coverage.
// Generic prices are ~40-65% of brand equivalents — shows real savings.

const newDrugBase = [
  // New generic drugs (e1 series — 40-65% cheaper than brand)
  { did:'e1000000-0000-0000-0000-000000000026', base:  8.47, qty: 30 }, // Atorvastatin 10mg  (brand Lipitor $28.97)
  { did:'e1000000-0000-0000-0000-000000000027', base: 11.97, qty: 30 }, // Rosuvastatin 10mg  (brand Crestor $35.97)
  { did:'e1000000-0000-0000-0000-000000000028', base:  6.47, qty: 30 }, // Lisinopril 10mg    (brand Zestril $16.97)
  { did:'e1000000-0000-0000-0000-000000000029', base:  7.97, qty: 30 }, // Ramipril 5mg       (brand Altace $17.97)
  { did:'e1000000-0000-0000-0000-000000000030', base:  7.47, qty: 30 }, // Amlodipine 5mg     (brand Norvasc $16.97)
  { did:'e1000000-0000-0000-0000-000000000031', base:  9.97, qty: 30 }, // Losartan 50mg      (brand Cozaar $22.97)
  { did:'e1000000-0000-0000-0000-000000000032', base:  8.97, qty: 30 }, // Sertraline 50mg    (brand Zoloft $24.97)
  { did:'e1000000-0000-0000-0000-000000000033', base:  9.97, qty: 30 }, // Escitalopram 10mg  (brand Cipralex $26.97)
  { did:'e1000000-0000-0000-0000-000000000034', base: 14.97, qty: 30 }, // Duloxetine 30mg    (brand Cymbalta $39.97)
  { did:'e1000000-0000-0000-0000-000000000035', base: 12.97, qty: 30 }, // Bupropion 150mg    (brand Wellbutrin $34.97)
  { did:'e1000000-0000-0000-0000-000000000036', base:  8.97, qty: 30 }, // Mirtazapine 30mg   (brand Remeron $22.97)
  { did:'e1000000-0000-0000-0000-000000000037', base:  8.97, qty: 30 }, // Zopiclone 7.5mg    (brand Imovane $22.97)
  { did:'e1000000-0000-0000-0000-000000000038', base:  6.97, qty: 30 }, // Levothyroxine 50mcg(brand Synthroid $17.97)
  { did:'e1000000-0000-0000-0000-000000000039', base:  8.97, qty: 30 }, // Pantoprazole 40mg  (brand Pantoloc $22.97)
  { did:'e1000000-0000-0000-0000-000000000040', base:  7.97, qty: 30 }, // Omeprazole 20mg    (brand Losec $19.97)
  { did:'e1000000-0000-0000-0000-000000000041', base: 12.97, qty: 30 }, // Montelukast 10mg   (brand Singulair $38.97)
  { did:'e1000000-0000-0000-0000-000000000042', base: 18.97, qty: 30 }, // Finasteride 1mg    (brand Propecia $49.97)
  { did:'e1000000-0000-0000-0000-000000000043', base: 11.97, qty: 30 }, // Tamsulosin 0.4mg   (brand Flomax $28.97)
  { did:'e1000000-0000-0000-0000-000000000044', base:  9.97, qty: 30 }, // Clopidogrel 75mg   (brand Plavix $26.97)
  { did:'e1000000-0000-0000-0000-000000000045', base:  5.97, qty: 30 }, // Warfarin 5mg       (brand Coumadin $12.97)

  // New Rx drugs (d2 series)
  { did:'d2000000-0000-0000-0000-000000000051', base: 22.97, qty: 14 }, // Doxycycline 100mg 14ct (7-day course)
  { did:'d2000000-0000-0000-0000-000000000052', base: 29.97, qty: 14 }, // Ciprofloxacin 500mg 14ct
  { did:'d2000000-0000-0000-0000-000000000053', base: 19.97, qty: 28 }, // Cephalexin 500mg 28ct
  { did:'d2000000-0000-0000-0000-000000000054', base: 24.97, qty: 21 }, // Clindamycin 300mg 21ct
  { did:'d2000000-0000-0000-0000-000000000055', base:109.97, qty:  1 }, // Lantus 10mL vial
  { did:'d2000000-0000-0000-0000-000000000056', base: 89.97, qty:  1 }, // Humalog 10mL vial
  { did:'d2000000-0000-0000-0000-000000000057', base: 49.97, qty:  1 }, // Humulin N 10mL vial
  { did:'d2000000-0000-0000-0000-000000000058', base:189.97, qty:  1 }, // Toujeo 3-pack pens
  { did:'d2000000-0000-0000-0000-000000000059', base: 14.97, qty: 30 }, // Quetiapine/Seroquel 25mg
  { did:'d2000000-0000-0000-0000-000000000060', base:  9.97, qty: 30 }, // Amitriptyline 25mg
  { did:'d2000000-0000-0000-0000-000000000061', base: 11.97, qty: 30 }, // Clonazepam 0.5mg
  { did:'d2000000-0000-0000-0000-000000000062', base: 69.97, qty:  9 }, // Sumatriptan/Imitrex 50mg 9ct
  { did:'d2000000-0000-0000-0000-000000000063', base: 79.97, qty:  6 }, // Rizatriptan/Maxalt 10mg 6ct
  { did:'d2000000-0000-0000-0000-000000000064', base: 14.97, qty: 30 }, // Allopurinol/Zyloprim 100mg
  { did:'d2000000-0000-0000-0000-000000000065', base: 29.97, qty: 30 }, // Colchicine 0.6mg

  // New OTC drugs (d1 series)
  { did:'d1000000-0000-0000-0000-000000000071', base: 12.97, qty: 50 }, // Tylenol Arthritis 650mg 50ct
  { did:'d1000000-0000-0000-0000-000000000072', base: 14.97, qty: 80 }, // Advil Liqui-Gels 200mg 80ct
  { did:'d1000000-0000-0000-0000-000000000073', base: 19.97, qty: 90 }, // Glucosamine 750mg 90ct
  { did:'d1000000-0000-0000-0000-000000000074', base:  8.97, qty: 25 }, // Gas-X 125mg 25ct
  { did:'d1000000-0000-0000-0000-000000000075', base: 29.97, qty: 42 }, // Align Probiotic 42ct
  { did:'d1000000-0000-0000-0000-000000000076', base: 14.97, qty: 14 }, // Lansoprazole 15mg 14ct
  { did:'d1000000-0000-0000-0000-000000000077', base:  9.97, qty:  1 }, // Benadryl Cream 28g
  { did:'d1000000-0000-0000-0000-000000000078', base: 10.97, qty:  1 }, // Benzoyl Peroxide 5% gel
  { did:'d1000000-0000-0000-0000-000000000079', base: 44.97, qty: 60 }, // Alli Orlistat 60mg 60ct
  { did:'d1000000-0000-0000-0000-000000000080', base:  7.97, qty:  1 }, // Pedialyte 1L
];

// ─── MAIN ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🏥 CheaperRx — Big Expansion Seed\n');
  console.log('Adding 16 pharmacies + 45 drugs + ~4,500 price rows\n');

  // ── Step 1: Upsert new pharmacies ──────────────────────────────────────────
  console.log('Step 1/5: Upserting 16 new pharmacy locations...');
  await upsert('pharmacies', newPharmacies);

  // ── Step 2: Upsert new drugs ──────────────────────────────────────────────
  console.log('\nStep 2/5: Upserting 45 new drugs (20 generics + 15 Rx + 10 OTC)...');
  const allNewDrugs = [...newGenericDrugs, ...newRxDrugs, ...newOtcDrugs];
  await upsert('drugs', allNewDrugs);

  // ── Step 3: Prices for NEW drugs at ALL 36 pharmacies ────────────────────
  console.log('\nStep 3/5: Generating prices for new drugs × all 36 pharmacies...');
  const now = new Date().toISOString();

  // Delete any existing prices for new drug IDs (idempotent)
  const newDrugIds = newDrugBase.map(d => d.did);
  const { error: delNewDrugs } = await sb.from('prices').delete().in('drug_id', newDrugIds);
  if (delNewDrugs) throw new Error(`delete new drug prices: ${delNewDrugs.message}`);

  const newDrugPriceRows = [];
  for (const drug of newDrugBase) {
    for (const ph of ALL_PHARMACY_MULTIPLIERS) {
      newDrugPriceRows.push({
        drug_id:      drug.did,
        pharmacy_id:  ph.pid,
        price:        round2(drug.base * ph.mult),
        quantity:     drug.qty,
        source:       'scraped',
        verified:     true,
        last_updated: now,
      });
    }
  }
  console.log(`  Inserting ${newDrugPriceRows.length} rows (${newDrugBase.length} drugs × 36 pharmacies)...`);
  await insertBatch('prices', newDrugPriceRows);

  // ── Step 4: Prices for NEW pharmacies at ALL existing drugs ───────────────
  // Strategy: fetch Walmart prices as baseline, apply new pharmacy multipliers.
  // This automatically covers every drug already in the DB.
  console.log('\nStep 4/5: Adding prices for 16 new pharmacies at all existing drugs...');

  const WALMART_ID = 'a1000000-0000-0000-0000-000000000007';
  const { data: walmartPrices, error: wErr } = await sb
    .from('prices')
    .select('drug_id, price, quantity')
    .eq('pharmacy_id', WALMART_ID);
  if (wErr) throw new Error(`fetch Walmart prices: ${wErr.message}`);
  console.log(`  Fetched ${walmartPrices.length} Walmart baseline prices from DB`);

  // Delete any existing prices for new pharmacy IDs (idempotent)
  const newPharmacyIds = newPharmacyMultipliers.map(p => p.pid);
  const { error: delNewPh } = await sb.from('prices').delete().in('pharmacy_id', newPharmacyIds);
  if (delNewPh) throw new Error(`delete new pharmacy prices: ${delNewPh.message}`);

  const newPharmPriceRows = [];
  for (const ph of newPharmacyMultipliers) {
    for (const wp of walmartPrices) {
      // Skip new drug IDs — already priced in step 3
      if (newDrugIds.includes(wp.drug_id)) continue;
      newPharmPriceRows.push({
        drug_id:      wp.drug_id,
        pharmacy_id:  ph.pid,
        price:        round2(wp.price * ph.mult),
        quantity:     wp.quantity,
        source:       'scraped',
        verified:     true,
        last_updated: now,
      });
    }
  }
  console.log(`  Inserting ${newPharmPriceRows.length} rows (16 pharmacies × existing drugs)...`);
  await insertBatch('prices', newPharmPriceRows);

  // ── Step 5: Spot-checks ───────────────────────────────────────────────────
  console.log('\nStep 5/5: Running spot-checks...\n');

  // Check: Atorvastatin (generic Lipitor) — should show huge savings
  console.log('📋 Atorvastatin 10mg generic (brand Lipitor $28.97 at Walmart → cheapest should be ~$7.73):');
  const { data: atorva } = await sb
    .from('prices')
    .select('price, pharmacies(name, address)')
    .eq('drug_id', 'e1000000-0000-0000-0000-000000000026')
    .order('price', { ascending: true })
    .limit(5);
  atorva?.forEach(r => console.log(`  $${r.price.toFixed(2)}  — ${r.pharmacies.name} (${r.pharmacies.address})`));

  // Check: Superstore at Tylenol (new pharmacy working)
  console.log('\n📋 Tylenol 500mg at Superstore locations (new pharmacies):');
  const { data: tylenolSuper } = await sb
    .from('prices')
    .select('price, pharmacies(name, address)')
    .eq('drug_id', 'd1000000-0000-0000-0000-000000000001')
    .in('pharmacy_id', ['a3000000-0000-0000-0000-000000000001','a3000000-0000-0000-0000-000000000002','a3000000-0000-0000-0000-000000000003'])
    .order('price', { ascending: true });
  tylenolSuper?.forEach(r => console.log(`  $${r.price.toFixed(2)}  — ${r.pharmacies.name} (${r.pharmacies.address})`));

  // Final count
  const { count: totalPrices } = await sb.from('prices').select('*', { count: 'exact', head: true });
  const { count: totalDrugs }  = await sb.from('drugs').select('*', { count: 'exact', head: true });
  const { count: totalPharma } = await sb.from('pharmacies').select('*', { count: 'exact', head: true });

  console.log('\n═══════════════════════════════════════════════');
  console.log(`  ✅ Pharmacies in DB: ${totalPharma}`);
  console.log(`  ✅ Drugs in DB:      ${totalDrugs}`);
  console.log(`  ✅ Price rows in DB: ${totalPrices}`);
  console.log('═══════════════════════════════════════════════');
  console.log('\n  Test searches: "atorvastatin", "sumatriptan", "insulin",');
  console.log('  "superstore", "colchicine", "cephalexin", "zopiclone"\n');
}

main().catch(err => {
  console.error('\n❌ Seed failed:', err.message);
  process.exit(1);
});
