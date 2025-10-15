export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      facts: {
        Row: {
          id: number
          created_at: string
          text: string
          source: string
          category: string
          votes_positive: number
          votes_negative: number
        }
        Insert: {
          id?: number 
          created_at?: string
          text: string
          source: string
          category: string
          votes_positive?: number
          votes_negative?: number
        }
        Update: {
          id?: number
          created_at?: string
          text?: string
          source?: string
          category?: string
          votes_positive?: number
          votes_negative?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
