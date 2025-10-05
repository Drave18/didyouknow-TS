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
      }
    }
  }
}
