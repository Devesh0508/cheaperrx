export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          city: string | null;
          province: string | null;
          role: "free" | "pro" | "admin";
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          subscription_status: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          city?: string | null;
          province?: string | null;
          role?: "free" | "pro" | "admin";
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          subscription_status?: string | null;
          created_at?: string;
        };
        Update: {
          full_name?: string | null;
          city?: string | null;
          province?: string | null;
          role?: "free" | "pro" | "admin";
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          subscription_status?: string | null;
        };
        Relationships: [];
      };
      drugs: {
        Row: {
          id: string;
          din: string | null;
          brand_name: string;
          generic_name: string;
          strength: string;
          dosage_form: string;
          drug_class: string | null;
          is_generic: boolean;
          brand_drug_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          din?: string | null;
          brand_name: string;
          generic_name: string;
          strength: string;
          dosage_form?: string;
          drug_class?: string | null;
          is_generic?: boolean;
          brand_drug_id?: string | null;
          created_at?: string;
        };
        Update: {
          din?: string | null;
          brand_name?: string;
          generic_name?: string;
          strength?: string;
          dosage_form?: string;
          drug_class?: string | null;
          is_generic?: boolean;
          brand_drug_id?: string | null;
        };
        Relationships: [];
      };
      pharmacies: {
        Row: {
          id: string;
          name: string;
          chain: string | null;
          address: string;
          city: string;
          province: string;
          postal_code: string | null;
          phone: string | null;
          accepts_odb: boolean;
          accepts_alberta_blue_cross: boolean;
          accepts_bc_pharmacare: boolean;
          has_delivery: boolean;
          delivery_fee: number | null;
          is_featured: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          chain?: string | null;
          address: string;
          city?: string;
          province?: string;
          postal_code?: string | null;
          phone?: string | null;
          accepts_odb?: boolean;
          accepts_alberta_blue_cross?: boolean;
          accepts_bc_pharmacare?: boolean;
          has_delivery?: boolean;
          delivery_fee?: number | null;
          is_featured?: boolean;
          created_at?: string;
        };
        Update: {
          name?: string;
          chain?: string | null;
          address?: string;
          city?: string;
          province?: string;
          postal_code?: string | null;
          phone?: string | null;
          accepts_odb?: boolean;
          accepts_alberta_blue_cross?: boolean;
          accepts_bc_pharmacare?: boolean;
          has_delivery?: boolean;
          delivery_fee?: number | null;
          is_featured?: boolean;
        };
        Relationships: [];
      };
      prices: {
        Row: {
          id: string;
          drug_id: string;
          pharmacy_id: string;
          price: number;
          quantity: number;
          source: string;
          verified: boolean;
          last_updated: string;
        };
        Insert: {
          id?: string;
          drug_id: string;
          pharmacy_id: string;
          price: number;
          quantity?: number;
          source?: string;
          verified?: boolean;
          last_updated?: string;
        };
        Update: {
          price?: number;
          quantity?: number;
          source?: string;
          verified?: boolean;
          last_updated?: string;
        };
        Relationships: [];
      };
      price_history: {
        Row: {
          id: string;
          drug_id: string;
          pharmacy_id: string;
          price: number;
          recorded_at: string;
        };
        Insert: {
          id?: string;
          drug_id: string;
          pharmacy_id: string;
          price: number;
          recorded_at?: string;
        };
        Update: {
          price?: number;
          recorded_at?: string;
        };
        Relationships: [];
      };
      saved_medications: {
        Row: {
          id: string;
          user_id: string;
          drug_id: string;
          family_member: string;
          nickname: string | null;
          refill_reminder: boolean;
          refill_day: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          drug_id: string;
          family_member?: string;
          nickname?: string | null;
          refill_reminder?: boolean;
          refill_day?: number | null;
          created_at?: string;
        };
        Update: {
          family_member?: string;
          nickname?: string | null;
          refill_reminder?: boolean;
          refill_day?: number | null;
        };
        Relationships: [];
      };
      price_alerts: {
        Row: {
          id: string;
          user_id: string;
          drug_id: string;
          target_price: number;
          is_active: boolean;
          last_triggered: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          drug_id: string;
          target_price: number;
          is_active?: boolean;
          last_triggered?: string | null;
          created_at?: string;
        };
        Update: {
          target_price?: number;
          is_active?: boolean;
          last_triggered?: string | null;
        };
        Relationships: [];
      };
      price_submissions: {
        Row: {
          id: string;
          user_id: string | null;
          drug_id: string;
          pharmacy_id: string;
          price_paid: number;
          verified: boolean;
          submitted_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          drug_id: string;
          pharmacy_id: string;
          price_paid: number;
          verified?: boolean;
          submitted_at?: string;
        };
        Update: {
          verified?: boolean;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_cheapest_prices: {
        Args: {
          p_drug_id: string;
          p_city: string;
          p_limit?: number;
        };
        Returns: {
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
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

// Convenience types
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Drug = Database["public"]["Tables"]["drugs"]["Row"];
export type Pharmacy = Database["public"]["Tables"]["pharmacies"]["Row"];
export type Price = Database["public"]["Tables"]["prices"]["Row"];
export type PriceHistory = Database["public"]["Tables"]["price_history"]["Row"];
export type SavedMedication = Database["public"]["Tables"]["saved_medications"]["Row"];
export type PriceAlert = Database["public"]["Tables"]["price_alerts"]["Row"];
export type PriceSubmission = Database["public"]["Tables"]["price_submissions"]["Row"];

export type UserRole = "free" | "pro" | "admin";
