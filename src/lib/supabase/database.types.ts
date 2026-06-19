export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      app_secrets: {
        Row: { name: string; value: string }
        Insert: { name: string; value: string }
        Update: { name?: string; value?: string }
        Relationships: []
      }
      collections: {
        Row: {
          accent: string
          description: string
          era: string
          metal: string
          name: string
          slug: string
          sort_order: number
          tagline: string
        }
        Insert: {
          accent: string
          description: string
          era: string
          metal: string
          name: string
          slug: string
          sort_order?: number
          tagline: string
        }
        Update: {
          accent?: string
          description?: string
          era?: string
          metal?: string
          name?: string
          slug?: string
          sort_order?: number
          tagline?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          id: string
          name: string
          order_id: string
          price_minor: number
          product_slug: string
          qty: number
        }
        Insert: {
          id?: string
          name: string
          order_id: string
          price_minor: number
          product_slug: string
          qty: number
        }
        Update: {
          id?: string
          name?: string
          order_id?: string
          price_minor?: number
          product_slug?: string
          qty?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          currency: string
          customer_email: string | null
          customer_name: string | null
          customer_phone: string | null
          id: string
          razorpay_order_id: string | null
          razorpay_payment_id: string | null
          status: string
          total_minor: number
        }
        Insert: {
          created_at?: string
          currency?: string
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          id?: string
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          status?: string
          total_minor?: number
        }
        Update: {
          created_at?: string
          currency?: string
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          id?: string
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          status?: string
          total_minor?: number
        }
        Relationships: []
      }
      products: {
        Row: {
          accent: string
          badge: string | null
          care: string
          category: string
          collection_name: string
          created_at: string
          dimensions: string
          id: string
          name: string
          price_minor: number
          purity: string
          short_desc: string
          slug: string
          story: string
          weight_grams: number
        }
        Insert: {
          accent: string
          badge?: string | null
          care: string
          category: string
          collection_name: string
          created_at?: string
          dimensions: string
          id?: string
          name: string
          price_minor: number
          purity: string
          short_desc: string
          slug: string
          story: string
          weight_grams: number
        }
        Update: {
          accent?: string
          badge?: string | null
          care?: string
          category?: string
          collection_name?: string
          created_at?: string
          dimensions?: string
          id?: string
          name?: string
          price_minor?: number
          purity?: string
          short_desc?: string
          slug?: string
          story?: string
          weight_grams?: number
        }
        Relationships: [
          {
            foreignKeyName: "products_category_fkey"
            columns: ["category"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["slug"]
          },
        ]
      }
      subscribers: {
        Row: { created_at: string; email: string; id: string }
        Insert: { created_at?: string; email: string; id?: string }
        Update: { created_at?: string; email?: string; id?: string }
        Relationships: []
      }
    }
    Views: { [_ in never]: never }
    Functions: {
      attach_razorpay_order: {
        Args: { p_order_id: string; p_rzp_order_id: string }
        Returns: undefined
      }
      mark_paid_via_webhook: {
        Args: { p_rzp_order_id: string; p_rzp_payment_id: string; p_secret: string }
        Returns: boolean
      }
      place_order: { Args: { p_customer: Json; p_items: Json }; Returns: Json }
      verify_and_mark_paid: {
        Args: {
          p_order_id: string
          p_rzp_order_id: string
          p_rzp_payment_id: string
          p_signature: string
        }
        Returns: boolean
      }
    }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
}
