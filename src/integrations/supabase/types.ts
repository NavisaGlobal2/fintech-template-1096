export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      application_documents: {
        Row: {
          application_id: string | null
          document_type: string
          file_name: string
          file_size: number | null
          file_url: string
          id: string
          mime_type: string | null
          session_id: string | null
          uploaded_at: string | null
          user_id: string | null
          verification_status: string | null
          verified_at: string | null
        }
        Insert: {
          application_id?: string | null
          document_type: string
          file_name: string
          file_size?: number | null
          file_url: string
          id?: string
          mime_type?: string | null
          session_id?: string | null
          uploaded_at?: string | null
          user_id?: string | null
          verification_status?: string | null
          verified_at?: string | null
        }
        Update: {
          application_id?: string | null
          document_type?: string
          file_name?: string
          file_size?: number | null
          file_url?: string
          id?: string
          mime_type?: string | null
          session_id?: string | null
          uploaded_at?: string | null
          user_id?: string | null
          verification_status?: string | null
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "application_documents_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "loan_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      application_status_history: {
        Row: {
          application_id: string | null
          changed_by: string | null
          created_at: string | null
          id: string
          new_status: string
          notes: string | null
          old_status: string | null
          user_id: string
        }
        Insert: {
          application_id?: string | null
          changed_by?: string | null
          created_at?: string | null
          id?: string
          new_status: string
          notes?: string | null
          old_status?: string | null
          user_id: string
        }
        Update: {
          application_id?: string | null
          changed_by?: string | null
          created_at?: string | null
          id?: string
          new_status?: string
          notes?: string | null
          old_status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "application_status_history_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "loan_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      loan_applications: {
        Row: {
          application_data: Json | null
          completed_steps: Json | null
          created_at: string | null
          declarations: Json | null
          education_career: Json | null
          financial_info: Json | null
          id: string
          is_draft: boolean | null
          kyc_documents: Json | null
          lender_name: string
          loan_option_id: string
          loan_type_requested: string | null
          personal_info: Json | null
          professional_employment: Json | null
          program_info: Json | null
          reviewed_at: string | null
          reviewer_notes: string | null
          status: string | null
          submitted_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          application_data?: Json | null
          completed_steps?: Json | null
          created_at?: string | null
          declarations?: Json | null
          education_career?: Json | null
          financial_info?: Json | null
          id?: string
          is_draft?: boolean | null
          kyc_documents?: Json | null
          lender_name: string
          loan_option_id: string
          loan_type_requested?: string | null
          personal_info?: Json | null
          professional_employment?: Json | null
          program_info?: Json | null
          reviewed_at?: string | null
          reviewer_notes?: string | null
          status?: string | null
          submitted_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          application_data?: Json | null
          completed_steps?: Json | null
          created_at?: string | null
          declarations?: Json | null
          education_career?: Json | null
          financial_info?: Json | null
          id?: string
          is_draft?: boolean | null
          kyc_documents?: Json | null
          lender_name?: string
          loan_option_id?: string
          loan_type_requested?: string | null
          personal_info?: Json | null
          professional_employment?: Json | null
          program_info?: Json | null
          reviewed_at?: string | null
          reviewer_notes?: string | null
          status?: string | null
          submitted_at?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      loan_offers: {
        Row: {
          accepted_at: string | null
          application_id: string
          apr_rate: number | null
          assessment_id: string
          created_at: string
          declined_at: string | null
          grace_period_months: number | null
          id: string
          isa_percentage: number | null
          loan_amount: number
          offer_type: string
          offer_valid_until: string
          repayment_schedule: Json
          repayment_term_months: number
          status: string
          terms_and_conditions: Json
          user_id: string
        }
        Insert: {
          accepted_at?: string | null
          application_id: string
          apr_rate?: number | null
          assessment_id: string
          created_at?: string
          declined_at?: string | null
          grace_period_months?: number | null
          id?: string
          isa_percentage?: number | null
          loan_amount: number
          offer_type: string
          offer_valid_until: string
          repayment_schedule?: Json
          repayment_term_months: number
          status?: string
          terms_and_conditions?: Json
          user_id: string
        }
        Update: {
          accepted_at?: string | null
          application_id?: string
          apr_rate?: number | null
          assessment_id?: string
          created_at?: string
          declined_at?: string | null
          grace_period_months?: number | null
          id?: string
          isa_percentage?: number | null
          loan_amount?: number
          offer_type?: string
          offer_valid_until?: string
          repayment_schedule?: Json
          repayment_term_months?: number
          status?: string
          terms_and_conditions?: Json
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "loan_offers_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "loan_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loan_offers_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "underwriting_assessments"
            referencedColumns: ["id"]
          },
        ]
      }
      payslip_audit_logs: {
        Row: {
          action: string
          changes: Json | null
          created_at: string | null
          id: string
          payslip_id: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          changes?: Json | null
          created_at?: string | null
          id?: string
          payslip_id?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          changes?: Json | null
          created_at?: string | null
          id?: string
          payslip_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payslip_audit_logs_payslip_id_fkey"
            columns: ["payslip_id"]
            isOneToOne: false
            referencedRelation: "payslips"
            referencedColumns: ["id"]
          },
        ]
      }
      payslip_versions: {
        Row: {
          created_at: string | null
          created_by: string | null
          data: Json
          id: string
          payslip_id: string | null
          version: number
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          data: Json
          id?: string
          payslip_id?: string | null
          version: number
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          data?: Json
          id?: string
          payslip_id?: string | null
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "payslip_versions_payslip_id_fkey"
            columns: ["payslip_id"]
            isOneToOne: false
            referencedRelation: "payslips"
            referencedColumns: ["id"]
          },
        ]
      }
      payslips: {
        Row: {
          created_at: string | null
          currency_code: string
          downloaded_at: string | null
          employee_id: string
          employee_name: string
          gross_pay: number
          id: string
          net_pay: number
          pay_period_end: string
          pay_period_start: string
          pdf_url: string | null
          status: string
        }
        Insert: {
          created_at?: string | null
          currency_code: string
          downloaded_at?: string | null
          employee_id: string
          employee_name: string
          gross_pay: number
          id?: string
          net_pay: number
          pay_period_end: string
          pay_period_start: string
          pdf_url?: string | null
          status?: string
        }
        Update: {
          created_at?: string | null
          currency_code?: string
          downloaded_at?: string | null
          employee_id?: string
          employee_name?: string
          gross_pay?: number
          id?: string
          net_pay?: number
          pay_period_end?: string
          pay_period_start?: string
          pdf_url?: string | null
          status?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      underwriting_assessments: {
        Row: {
          affordability_score: number
          application_id: string
          assessed_at: string
          assessed_by: string | null
          assessment_data: Json
          decision: string
          education_score: number
          employment_score: number
          id: string
          risk_score: number
          risk_tier: string
          sponsor_score: number
          user_id: string
        }
        Insert: {
          affordability_score: number
          application_id: string
          assessed_at?: string
          assessed_by?: string | null
          assessment_data?: Json
          decision: string
          education_score: number
          employment_score: number
          id?: string
          risk_score: number
          risk_tier: string
          sponsor_score: number
          user_id: string
        }
        Update: {
          affordability_score?: number
          application_id?: string
          assessed_at?: string
          assessed_by?: string | null
          assessment_data?: Json
          decision?: string
          education_score?: number
          employment_score?: number
          id?: string
          risk_score?: number
          risk_tier?: string
          sponsor_score?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "underwriting_assessments_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "loan_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      underwriting_rules: {
        Row: {
          active: boolean
          conditions: Json
          created_at: string
          id: string
          rule_name: string
          rule_type: string
          updated_at: string
          weight: number
        }
        Insert: {
          active?: boolean
          conditions: Json
          created_at?: string
          id?: string
          rule_name: string
          rule_type: string
          updated_at?: string
          weight?: number
        }
        Update: {
          active?: boolean
          conditions?: Json
          created_at?: string
          id?: string
          rule_name?: string
          rule_type?: string
          updated_at?: string
          weight?: number
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_authorized_for_underwriting: {
        Args: { _user_id: string }
        Returns: boolean
      }
      is_techskill_domain: {
        Args: { email: string }
        Returns: boolean
      }
      transfer_temp_documents_to_user: {
        Args: { temp_session_id: string; user_id: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "underwriter" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "underwriter", "user"],
    },
  },
} as const
