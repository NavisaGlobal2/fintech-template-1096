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
          reviewer_notes: string | null
          session_id: string | null
          uploaded_at: string | null
          user_id: string | null
          verification_status: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          application_id?: string | null
          document_type: string
          file_name: string
          file_size?: number | null
          file_url: string
          id?: string
          mime_type?: string | null
          reviewer_notes?: string | null
          session_id?: string | null
          uploaded_at?: string | null
          user_id?: string | null
          verification_status?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          application_id?: string | null
          document_type?: string
          file_name?: string
          file_size?: number | null
          file_url?: string
          id?: string
          mime_type?: string | null
          reviewer_notes?: string | null
          session_id?: string | null
          uploaded_at?: string | null
          user_id?: string | null
          verification_status?: string | null
          verified_at?: string | null
          verified_by?: string | null
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
      contract_signatures: {
        Row: {
          contract_id: string | null
          created_at: string
          dependency_signature_id: string | null
          guarantor_id: string | null
          id: string
          ip_address: unknown | null
          signature_data: string | null
          signature_order: number | null
          signed_at: string | null
          signer_email: string
          signer_id: string
          signer_name: string
          signer_type: string
          status: string
          user_agent: string | null
        }
        Insert: {
          contract_id?: string | null
          created_at?: string
          dependency_signature_id?: string | null
          guarantor_id?: string | null
          id?: string
          ip_address?: unknown | null
          signature_data?: string | null
          signature_order?: number | null
          signed_at?: string | null
          signer_email: string
          signer_id: string
          signer_name: string
          signer_type: string
          status?: string
          user_agent?: string | null
        }
        Update: {
          contract_id?: string | null
          created_at?: string
          dependency_signature_id?: string | null
          guarantor_id?: string | null
          id?: string
          ip_address?: unknown | null
          signature_data?: string | null
          signature_order?: number | null
          signed_at?: string | null
          signer_email?: string
          signer_id?: string
          signer_name?: string
          signer_type?: string
          status?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contract_signatures_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "loan_contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contract_signatures_dependency_signature_id_fkey"
            columns: ["dependency_signature_id"]
            isOneToOne: false
            referencedRelation: "contract_signatures"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contract_signatures_guarantor_id_fkey"
            columns: ["guarantor_id"]
            isOneToOne: false
            referencedRelation: "loan_guarantors"
            referencedColumns: ["id"]
          },
        ]
      }
      document_review_audit: {
        Row: {
          action: string
          created_at: string | null
          document_id: string
          id: string
          new_status: string
          notes: string | null
          previous_status: string | null
          reviewer_id: string
        }
        Insert: {
          action: string
          created_at?: string | null
          document_id: string
          id?: string
          new_status: string
          notes?: string | null
          previous_status?: string | null
          reviewer_id: string
        }
        Update: {
          action?: string
          created_at?: string | null
          document_id?: string
          id?: string
          new_status?: string
          notes?: string | null
          previous_status?: string | null
          reviewer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_review_audit_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "application_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      guarantor_documents: {
        Row: {
          document_type: string
          file_name: string
          file_size: number | null
          file_url: string
          guarantor_id: string
          id: string
          mime_type: string | null
          reviewer_notes: string | null
          uploaded_at: string | null
          verification_status: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          document_type: string
          file_name: string
          file_size?: number | null
          file_url: string
          guarantor_id: string
          id?: string
          mime_type?: string | null
          reviewer_notes?: string | null
          uploaded_at?: string | null
          verification_status?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          document_type?: string
          file_name?: string
          file_size?: number | null
          file_url?: string
          guarantor_id?: string
          id?: string
          mime_type?: string | null
          reviewer_notes?: string | null
          uploaded_at?: string | null
          verification_status?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "guarantor_documents_guarantor_id_fkey"
            columns: ["guarantor_id"]
            isOneToOne: false
            referencedRelation: "loan_guarantors"
            referencedColumns: ["id"]
          },
        ]
      }
      lender_products: {
        Row: {
          application_url: string | null
          category: Database["public"]["Enums"]["lender_category"]
          co_signer_required: boolean | null
          created_at: string
          created_by: string | null
          eligibility_criteria: Json | null
          eligible_countries: string[] | null
          eligible_employment_types: string[] | null
          features: string[] | null
          grace_period_months: number | null
          id: string
          lender_id: string
          max_amount: number
          max_apr: number
          max_term_months: number
          min_amount: number
          min_apr: number
          min_credit_score: number | null
          min_income: number | null
          min_term_months: number
          product_name: string
          status: Database["public"]["Enums"]["product_status"]
          terms_and_conditions: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          application_url?: string | null
          category: Database["public"]["Enums"]["lender_category"]
          co_signer_required?: boolean | null
          created_at?: string
          created_by?: string | null
          eligibility_criteria?: Json | null
          eligible_countries?: string[] | null
          eligible_employment_types?: string[] | null
          features?: string[] | null
          grace_period_months?: number | null
          id?: string
          lender_id: string
          max_amount: number
          max_apr: number
          max_term_months: number
          min_amount: number
          min_apr: number
          min_credit_score?: number | null
          min_income?: number | null
          min_term_months: number
          product_name: string
          status?: Database["public"]["Enums"]["product_status"]
          terms_and_conditions?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          application_url?: string | null
          category?: Database["public"]["Enums"]["lender_category"]
          co_signer_required?: boolean | null
          created_at?: string
          created_by?: string | null
          eligibility_criteria?: Json | null
          eligible_countries?: string[] | null
          eligible_employment_types?: string[] | null
          features?: string[] | null
          grace_period_months?: number | null
          id?: string
          lender_id?: string
          max_amount?: number
          max_apr?: number
          max_term_months?: number
          min_amount?: number
          min_apr?: number
          min_credit_score?: number | null
          min_income?: number | null
          min_term_months?: number
          product_name?: string
          status?: Database["public"]["Enums"]["product_status"]
          terms_and_conditions?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lender_products_lender_id_fkey"
            columns: ["lender_id"]
            isOneToOne: false
            referencedRelation: "lenders"
            referencedColumns: ["id"]
          },
        ]
      }
      lenders: {
        Row: {
          address: Json | null
          contact_email: string | null
          contact_phone: string | null
          countries_served: string[] | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          logo_url: string | null
          min_credit_score: number | null
          name: string
          processing_time_days: number | null
          slug: string
          special_offers: string | null
          specialties: Database["public"]["Enums"]["lender_category"][] | null
          status: Database["public"]["Enums"]["lender_status"]
          updated_at: string
          updated_by: string | null
          website_url: string | null
        }
        Insert: {
          address?: Json | null
          contact_email?: string | null
          contact_phone?: string | null
          countries_served?: string[] | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          logo_url?: string | null
          min_credit_score?: number | null
          name: string
          processing_time_days?: number | null
          slug: string
          special_offers?: string | null
          specialties?: Database["public"]["Enums"]["lender_category"][] | null
          status?: Database["public"]["Enums"]["lender_status"]
          updated_at?: string
          updated_by?: string | null
          website_url?: string | null
        }
        Update: {
          address?: Json | null
          contact_email?: string | null
          contact_phone?: string | null
          countries_served?: string[] | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          logo_url?: string | null
          min_credit_score?: number | null
          name?: string
          processing_time_days?: number | null
          slug?: string
          special_offers?: string | null
          specialties?: Database["public"]["Enums"]["lender_category"][] | null
          status?: Database["public"]["Enums"]["lender_status"]
          updated_at?: string
          updated_by?: string | null
          website_url?: string | null
        }
        Relationships: []
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
      loan_contracts: {
        Row: {
          application_id: string | null
          contract_data: Json
          contract_pdf_url: string | null
          contract_type: string
          created_at: string
          executed_at: string | null
          id: string
          offer_id: string | null
          signed_at: string | null
          status: string
          template_version: string | null
          updated_at: string
          user_id: string
          version: number
        }
        Insert: {
          application_id?: string | null
          contract_data?: Json
          contract_pdf_url?: string | null
          contract_type?: string
          created_at?: string
          executed_at?: string | null
          id?: string
          offer_id?: string | null
          signed_at?: string | null
          status?: string
          template_version?: string | null
          updated_at?: string
          user_id: string
          version?: number
        }
        Update: {
          application_id?: string | null
          contract_data?: Json
          contract_pdf_url?: string | null
          contract_type?: string
          created_at?: string
          executed_at?: string | null
          id?: string
          offer_id?: string | null
          signed_at?: string | null
          status?: string
          template_version?: string | null
          updated_at?: string
          user_id?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "loan_contracts_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "loan_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loan_contracts_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "loan_offers"
            referencedColumns: ["id"]
          },
        ]
      }
      loan_guarantors: {
        Row: {
          created_at: string | null
          documents_submitted_at: string | null
          guarantor_email: string
          guarantor_name: string | null
          guarantor_phone: string | null
          guarantor_relationship: string | null
          id: string
          invitation_expires_at: string | null
          invitation_token: string | null
          invited_at: string | null
          offer_id: string
          rejection_reason: string | null
          status: string
          updated_at: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          created_at?: string | null
          documents_submitted_at?: string | null
          guarantor_email: string
          guarantor_name?: string | null
          guarantor_phone?: string | null
          guarantor_relationship?: string | null
          id?: string
          invitation_expires_at?: string | null
          invitation_token?: string | null
          invited_at?: string | null
          offer_id: string
          rejection_reason?: string | null
          status?: string
          updated_at?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          created_at?: string | null
          documents_submitted_at?: string | null
          guarantor_email?: string
          guarantor_name?: string | null
          guarantor_phone?: string | null
          guarantor_relationship?: string | null
          id?: string
          invitation_expires_at?: string | null
          invitation_token?: string | null
          invited_at?: string | null
          offer_id?: string
          rejection_reason?: string | null
          status?: string
          updated_at?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "loan_guarantors_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "loan_offers"
            referencedColumns: ["id"]
          },
        ]
      }
      loan_offers: {
        Row: {
          acceptance_conditions: Json | null
          accepted_at: string | null
          accepted_by: string | null
          application_id: string
          apr_rate: number | null
          assessment_id: string | null
          created_at: string
          created_by_underwriter: string | null
          declined_at: string | null
          grace_period_months: number | null
          guarantor_requirements: Json | null
          id: string
          is_manual_offer: boolean | null
          isa_percentage: number | null
          lender_product_id: string | null
          loan_amount: number
          manual_assessment_notes: string | null
          offer_type: string
          offer_valid_until: string
          repayment_schedule: Json
          repayment_term_months: number
          requires_guarantor: boolean | null
          status: string
          terms_and_conditions: Json
          user_id: string
        }
        Insert: {
          acceptance_conditions?: Json | null
          accepted_at?: string | null
          accepted_by?: string | null
          application_id: string
          apr_rate?: number | null
          assessment_id?: string | null
          created_at?: string
          created_by_underwriter?: string | null
          declined_at?: string | null
          grace_period_months?: number | null
          guarantor_requirements?: Json | null
          id?: string
          is_manual_offer?: boolean | null
          isa_percentage?: number | null
          lender_product_id?: string | null
          loan_amount: number
          manual_assessment_notes?: string | null
          offer_type: string
          offer_valid_until: string
          repayment_schedule?: Json
          repayment_term_months: number
          requires_guarantor?: boolean | null
          status?: string
          terms_and_conditions?: Json
          user_id: string
        }
        Update: {
          acceptance_conditions?: Json | null
          accepted_at?: string | null
          accepted_by?: string | null
          application_id?: string
          apr_rate?: number | null
          assessment_id?: string | null
          created_at?: string
          created_by_underwriter?: string | null
          declined_at?: string | null
          grace_period_months?: number | null
          guarantor_requirements?: Json | null
          id?: string
          is_manual_offer?: boolean | null
          isa_percentage?: number | null
          lender_product_id?: string | null
          loan_amount?: number
          manual_assessment_notes?: string | null
          offer_type?: string
          offer_valid_until?: string
          repayment_schedule?: Json
          repayment_term_months?: number
          requires_guarantor?: boolean | null
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
          {
            foreignKeyName: "loan_offers_lender_product_id_fkey"
            columns: ["lender_product_id"]
            isOneToOne: false
            referencedRelation: "lender_products"
            referencedColumns: ["id"]
          },
        ]
      }
      loan_payments: {
        Row: {
          amount: number
          contract_id: string | null
          created_at: string
          currency: string
          failure_reason: string | null
          id: string
          payment_type: string
          processed_date: string | null
          scheduled_date: string | null
          status: string
          stripe_payment_intent_id: string | null
          user_id: string
        }
        Insert: {
          amount: number
          contract_id?: string | null
          created_at?: string
          currency?: string
          failure_reason?: string | null
          id?: string
          payment_type: string
          processed_date?: string | null
          scheduled_date?: string | null
          status?: string
          stripe_payment_intent_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          contract_id?: string | null
          created_at?: string
          currency?: string
          failure_reason?: string | null
          id?: string
          payment_type?: string
          processed_date?: string | null
          scheduled_date?: string | null
          status?: string
          stripe_payment_intent_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "loan_payments_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "loan_contracts"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          data: Json | null
          id: string
          message: string
          read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data?: Json | null
          id?: string
          message: string
          read?: boolean
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json | null
          id?: string
          message?: string
          read?: boolean
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      payment_methods: {
        Row: {
          brand: string | null
          created_at: string
          exp_month: number | null
          exp_year: number | null
          id: string
          is_default: boolean | null
          last_four: string | null
          stripe_payment_method_id: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          brand?: string | null
          created_at?: string
          exp_month?: number | null
          exp_year?: number | null
          id?: string
          is_default?: boolean | null
          last_four?: string | null
          stripe_payment_method_id: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          brand?: string | null
          created_at?: string
          exp_month?: number | null
          exp_year?: number | null
          id?: string
          is_default?: boolean | null
          last_four?: string | null
          stripe_payment_method_id?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
      user_notification_preferences: {
        Row: {
          application_updates: boolean
          created_at: string
          document_updates: boolean
          email_notifications: boolean
          id: string
          in_app_notifications: boolean
          marketing_emails: boolean
          offer_notifications: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          application_updates?: boolean
          created_at?: string
          document_updates?: boolean
          email_notifications?: boolean
          id?: string
          in_app_notifications?: boolean
          marketing_emails?: boolean
          offer_notifications?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          application_updates?: boolean
          created_at?: string
          document_updates?: boolean
          email_notifications?: boolean
          id?: string
          in_app_notifications?: boolean
          marketing_emails?: boolean
          offer_notifications?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_role_audit_log: {
        Row: {
          action: string
          assigned_at: string
          assigned_by: string | null
          id: string
          notes: string | null
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          action: string
          assigned_at?: string
          assigned_by?: string | null
          id?: string
          notes?: string | null
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          action?: string
          assigned_at?: string
          assigned_by?: string | null
          id?: string
          notes?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
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
      update_document_verification_status: {
        Args: {
          doc_id: string
          new_status: string
          reviewer_notes_param?: string
        }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "underwriter" | "user"
      lender_category:
        | "education_loans"
        | "career_development"
        | "upskilling"
        | "professional_training"
        | "certification_programs"
      lender_status: "active" | "inactive" | "pending_approval"
      product_status: "active" | "inactive" | "draft"
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
      lender_category: [
        "education_loans",
        "career_development",
        "upskilling",
        "professional_training",
        "certification_programs",
      ],
      lender_status: ["active", "inactive", "pending_approval"],
      product_status: ["active", "inactive", "draft"],
    },
  },
} as const
