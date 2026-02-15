export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      rooms: {
        Row: {
          id: string
          name: string
          description: string | null
          owner_id: string
          deck_type: string
          timer_duration: number | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          owner_id: string
          deck_type?: string
          timer_duration?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          owner_id?: string
          deck_type?: string
          timer_duration?: number | null
          created_at?: string
        }
        Relationships: []
      }
      participants: {
        Row: {
          id: string
          room_id: string
          user_id: string
          name: string
          avatar_color: string | null
          is_online: boolean
          last_seen: string
        }
        Insert: {
          id?: string
          room_id: string
          user_id: string
          name: string
          avatar_color?: string | null
          is_online?: boolean
          last_seen?: string
        }
        Update: {
          id?: string
          room_id?: string
          user_id?: string
          name?: string
          avatar_color?: string | null
          is_online?: boolean
          last_seen?: string
        }
        Relationships: [
          {
            foreignKeyName: "participants_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          }
        ]
      }
      stories: {
        Row: {
          id: string
          room_id: string
          title: string
          description: string | null
          status: string
          points: string | null
          started_at: string | null
          ended_at: string | null
          position: number
          created_at: string
        }
        Insert: {
          id?: string
          room_id: string
          title: string
          description?: string | null
          status?: string
          points?: string | null
          started_at?: string | null
          ended_at?: string | null
          position?: number
          created_at?: string
        }
        Update: {
          id?: string
          room_id?: string
          title?: string
          description?: string | null
          status?: string
          points?: string | null
          started_at?: string | null
          ended_at?: string | null
          position?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "stories_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          }
        ]
      }
      votes: {
        Row: {
          id: string
          story_id: string
          user_id: string
          user_name: string
          value: string
          voted_at: string
        }
        Insert: {
          id?: string
          story_id: string
          user_id: string
          user_name: string
          value: string
          voted_at?: string
        }
        Update: {
          id?: string
          story_id?: string
          user_id?: string
          user_name?: string
          value?: string
          voted_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "votes_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          }
        ]
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

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never
