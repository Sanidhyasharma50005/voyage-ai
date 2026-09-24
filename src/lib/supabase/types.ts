import { TripPlan } from '@/types/travel';

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Profile {
  id: string; // references auth.users.id
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  home_city?: string | null;
  bio?: string | null;
  is_pro: boolean;
  pro_plan_name?: string | null;
  pro_valid_until?: string | null;
  razorpay_customer_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ItineraryRecord {
  id: string;
  user_id: string;
  destination_id: string;
  destination_name: string;
  title: string;
  days_count: number;
  budget_tier: 'budget' | 'comfort' | 'luxury';
  travel_style: string;
  total_cost: number;
  dates: string;
  image_url?: string | null;
  plan_data: TripPlan;
  created_at: string;
  updated_at: string;
}

export interface OrderRecord {
  id: string;
  user_id: string | null;
  razorpay_order_id: string;
  razorpay_payment_id?: string | null;
  amount: number;
  currency: string;
  status: 'created' | 'attempted' | 'paid' | 'fulfilled' | 'failed';
  plan_code: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Partial<Profile> & { id: string; email: string };
        Update: Partial<Profile>;
        Relationships: [
          {
            foreignKeyName: 'profiles_id_fkey';
            columns: ['id'];
            isOneToOne: true;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
      itineraries: {
        Row: ItineraryRecord;
        Insert: Omit<ItineraryRecord, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<ItineraryRecord>;
        Relationships: [
          {
            foreignKeyName: 'itineraries_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };
      orders: {
        Row: OrderRecord;
        Insert: Omit<OrderRecord, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<OrderRecord>;
        Relationships: [
          {
            foreignKeyName: 'orders_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
