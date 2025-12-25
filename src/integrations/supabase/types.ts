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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      "Computer 1": {
        Row: {
          correct_option: string | null
          marks: number | null
          negative_marks: number | null
          option_1: string | null
          option_2: string | null
          option_3: string | null
          option_4: string | null
          question_text: string | null
          "S. No": number
          Subject: string | null
        }
        Insert: {
          correct_option?: string | null
          marks?: number | null
          negative_marks?: number | null
          option_1?: string | null
          option_2?: string | null
          option_3?: string | null
          option_4?: string | null
          question_text?: string | null
          "S. No": number
          Subject?: string | null
        }
        Update: {
          correct_option?: string | null
          marks?: number | null
          negative_marks?: number | null
          option_1?: string | null
          option_2?: string | null
          option_3?: string | null
          option_4?: string | null
          question_text?: string | null
          "S. No"?: number
          Subject?: string | null
        }
        Relationships: []
      }
      "Computer 2": {
        Row: {
          "Correct Option": string | null
          Mark: number | null
          "Negative Mark": number | null
          "Option A": string | null
          "Option B": string | null
          "Option C": string | null
          "Option D": string | null
          Question: string | null
          "S. No": number
          "Section ID": string | null
        }
        Insert: {
          "Correct Option"?: string | null
          Mark?: number | null
          "Negative Mark"?: number | null
          "Option A"?: string | null
          "Option B"?: string | null
          "Option C"?: string | null
          "Option D"?: string | null
          Question?: string | null
          "S. No": number
          "Section ID"?: string | null
        }
        Update: {
          "Correct Option"?: string | null
          Mark?: number | null
          "Negative Mark"?: number | null
          "Option A"?: string | null
          "Option B"?: string | null
          "Option C"?: string | null
          "Option D"?: string | null
          Question?: string | null
          "S. No"?: number
          "Section ID"?: string | null
        }
        Relationships: []
      }
      "Computer 3": {
        Row: {
          "Correct Option": string | null
          Mark: number | null
          "Negative Mark": number | null
          "Option A": string | null
          "Option B": string | null
          "Option C": string | null
          "Option D": string | null
          Question: string | null
          "S. No": number
          "Section ID": string | null
        }
        Insert: {
          "Correct Option"?: string | null
          Mark?: number | null
          "Negative Mark"?: number | null
          "Option A"?: string | null
          "Option B"?: string | null
          "Option C"?: string | null
          "Option D"?: string | null
          Question?: string | null
          "S. No": number
          "Section ID"?: string | null
        }
        Update: {
          "Correct Option"?: string | null
          Mark?: number | null
          "Negative Mark"?: number | null
          "Option A"?: string | null
          "Option B"?: string | null
          "Option C"?: string | null
          "Option D"?: string | null
          Question?: string | null
          "S. No"?: number
          "Section ID"?: string | null
        }
        Relationships: []
      }
      "Computer 4": {
        Row: {
          "Correct Option": string | null
          Mark: number | null
          "Negative Mark": number | null
          "Option A": string | null
          "Option B": string | null
          "Option C": string | null
          "Option D": string | null
          Question: string | null
          "S. No": number
          "Section ID": string | null
        }
        Insert: {
          "Correct Option"?: string | null
          Mark?: number | null
          "Negative Mark"?: number | null
          "Option A"?: string | null
          "Option B"?: string | null
          "Option C"?: string | null
          "Option D"?: string | null
          Question?: string | null
          "S. No": number
          "Section ID"?: string | null
        }
        Update: {
          "Correct Option"?: string | null
          Mark?: number | null
          "Negative Mark"?: number | null
          "Option A"?: string | null
          "Option B"?: string | null
          "Option C"?: string | null
          "Option D"?: string | null
          Question?: string | null
          "S. No"?: number
          "Section ID"?: string | null
        }
        Relationships: []
      }
      "Computer 5": {
        Row: {
          "Correct Option": string | null
          Mark: number | null
          "Negative Mark": number | null
          "Option A": string | null
          "Option B": string | null
          "Option C": string | null
          "Option D": string | null
          Question: string | null
          "S. No": number
          "Section ID": string | null
        }
        Insert: {
          "Correct Option"?: string | null
          Mark?: number | null
          "Negative Mark"?: number | null
          "Option A"?: string | null
          "Option B"?: string | null
          "Option C"?: string | null
          "Option D"?: string | null
          Question?: string | null
          "S. No": number
          "Section ID"?: string | null
        }
        Update: {
          "Correct Option"?: string | null
          Mark?: number | null
          "Negative Mark"?: number | null
          "Option A"?: string | null
          "Option B"?: string | null
          "Option C"?: string | null
          "Option D"?: string | null
          Question?: string | null
          "S. No"?: number
          "Section ID"?: string | null
        }
        Relationships: []
      }
      "Dehli Police 2023": {
        Row: {
          "Correct Option": number | null
          Option1: string | null
          Option2: string | null
          Option3: string | null
          Option4: string | null
          "S.No.": number
        }
        Insert: {
          "Correct Option"?: number | null
          Option1?: string | null
          Option2?: string | null
          Option3?: string | null
          Option4?: string | null
          "S.No.": number
        }
        Update: {
          "Correct Option"?: number | null
          Option1?: string | null
          Option2?: string | null
          Option3?: string | null
          Option4?: string | null
          "S.No."?: number
        }
        Relationships: []
      }
      "Delhi Police Mock 1": {
        Row: {
          "Correct Option": string | null
          Mark: number | null
          "Negative Mark": number | null
          "Option A": string | null
          "Option B": string | null
          "Option C": string | null
          "Option D": string | null
          Question: string | null
          "S. No": number
          "Section ID": string | null
        }
        Insert: {
          "Correct Option"?: string | null
          Mark?: number | null
          "Negative Mark"?: number | null
          "Option A"?: string | null
          "Option B"?: string | null
          "Option C"?: string | null
          "Option D"?: string | null
          Question?: string | null
          "S. No": number
          "Section ID"?: string | null
        }
        Update: {
          "Correct Option"?: string | null
          Mark?: number | null
          "Negative Mark"?: number | null
          "Option A"?: string | null
          "Option B"?: string | null
          "Option C"?: string | null
          "Option D"?: string | null
          Question?: string | null
          "S. No"?: number
          "Section ID"?: string | null
        }
        Relationships: []
      }
      "Delhi Police Mock 10": {
        Row: {
          "Correct Option": string | null
          Mark: number | null
          "Negative Mark": number | null
          "Option A": string | null
          "Option B": string | null
          "Option C": string | null
          "Option D": string | null
          Question: string | null
          "S. No": number
          "Section ID": string | null
        }
        Insert: {
          "Correct Option"?: string | null
          Mark?: number | null
          "Negative Mark"?: number | null
          "Option A"?: string | null
          "Option B"?: string | null
          "Option C"?: string | null
          "Option D"?: string | null
          Question?: string | null
          "S. No": number
          "Section ID"?: string | null
        }
        Update: {
          "Correct Option"?: string | null
          Mark?: number | null
          "Negative Mark"?: number | null
          "Option A"?: string | null
          "Option B"?: string | null
          "Option C"?: string | null
          "Option D"?: string | null
          Question?: string | null
          "S. No"?: number
          "Section ID"?: string | null
        }
        Relationships: []
      }
      "Delhi Police Mock 2": {
        Row: {
          "Correct Option": string | null
          Mark: number | null
          "Negative Mark": number | null
          "Option A": string | null
          "Option B": string | null
          "Option C": string | null
          "Option D": string | null
          Question: string | null
          "S. No": number
          "Section ID": string | null
        }
        Insert: {
          "Correct Option"?: string | null
          Mark?: number | null
          "Negative Mark"?: number | null
          "Option A"?: string | null
          "Option B"?: string | null
          "Option C"?: string | null
          "Option D"?: string | null
          Question?: string | null
          "S. No": number
          "Section ID"?: string | null
        }
        Update: {
          "Correct Option"?: string | null
          Mark?: number | null
          "Negative Mark"?: number | null
          "Option A"?: string | null
          "Option B"?: string | null
          "Option C"?: string | null
          "Option D"?: string | null
          Question?: string | null
          "S. No"?: number
          "Section ID"?: string | null
        }
        Relationships: []
      }
      "Delhi Police Mock 3": {
        Row: {
          "Correct Option": string | null
          Mark: number | null
          "Negative Mark": number | null
          "Option A": string | null
          "Option B": string | null
          "Option C": string | null
          "Option D": string | null
          Question: string | null
          "S. No": number
          "Section ID": string | null
        }
        Insert: {
          "Correct Option"?: string | null
          Mark?: number | null
          "Negative Mark"?: number | null
          "Option A"?: string | null
          "Option B"?: string | null
          "Option C"?: string | null
          "Option D"?: string | null
          Question?: string | null
          "S. No": number
          "Section ID"?: string | null
        }
        Update: {
          "Correct Option"?: string | null
          Mark?: number | null
          "Negative Mark"?: number | null
          "Option A"?: string | null
          "Option B"?: string | null
          "Option C"?: string | null
          "Option D"?: string | null
          Question?: string | null
          "S. No"?: number
          "Section ID"?: string | null
        }
        Relationships: []
      }
      "Delhi Police Mock 4": {
        Row: {
          "Correct Option": string | null
          Mark: number | null
          "Negative Mark": number | null
          "Option A": string | null
          "Option B": string | null
          "Option C": string | null
          "Option D": string | null
          Question: string | null
          "S. No": number
          "Section ID": string | null
        }
        Insert: {
          "Correct Option"?: string | null
          Mark?: number | null
          "Negative Mark"?: number | null
          "Option A"?: string | null
          "Option B"?: string | null
          "Option C"?: string | null
          "Option D"?: string | null
          Question?: string | null
          "S. No": number
          "Section ID"?: string | null
        }
        Update: {
          "Correct Option"?: string | null
          Mark?: number | null
          "Negative Mark"?: number | null
          "Option A"?: string | null
          "Option B"?: string | null
          "Option C"?: string | null
          "Option D"?: string | null
          Question?: string | null
          "S. No"?: number
          "Section ID"?: string | null
        }
        Relationships: []
      }
      "Delhi Police Mock 5": {
        Row: {
          "Correct Option": string | null
          Mark: number | null
          "Negative Mark": number | null
          "Option A": string | null
          "Option B": string | null
          "Option C": string | null
          "Option D": string | null
          Question: string | null
          "S. No": number
          "Section ID": string | null
        }
        Insert: {
          "Correct Option"?: string | null
          Mark?: number | null
          "Negative Mark"?: number | null
          "Option A"?: string | null
          "Option B"?: string | null
          "Option C"?: string | null
          "Option D"?: string | null
          Question?: string | null
          "S. No": number
          "Section ID"?: string | null
        }
        Update: {
          "Correct Option"?: string | null
          Mark?: number | null
          "Negative Mark"?: number | null
          "Option A"?: string | null
          "Option B"?: string | null
          "Option C"?: string | null
          "Option D"?: string | null
          Question?: string | null
          "S. No"?: number
          "Section ID"?: string | null
        }
        Relationships: []
      }
      "Delhi Police Mock 6": {
        Row: {
          "Correct Option": string | null
          Mark: number | null
          "Negative Mark": number | null
          "Option A": string | null
          "Option B": string | null
          "Option C": string | null
          "Option D": string | null
          Question: string | null
          "S. No": number
          "Section ID": string | null
        }
        Insert: {
          "Correct Option"?: string | null
          Mark?: number | null
          "Negative Mark"?: number | null
          "Option A"?: string | null
          "Option B"?: string | null
          "Option C"?: string | null
          "Option D"?: string | null
          Question?: string | null
          "S. No": number
          "Section ID"?: string | null
        }
        Update: {
          "Correct Option"?: string | null
          Mark?: number | null
          "Negative Mark"?: number | null
          "Option A"?: string | null
          "Option B"?: string | null
          "Option C"?: string | null
          "Option D"?: string | null
          Question?: string | null
          "S. No"?: number
          "Section ID"?: string | null
        }
        Relationships: []
      }
      "Delhi Police Mock 7": {
        Row: {
          "Correct Option": string | null
          Mark: number | null
          "Negative Mark": number | null
          "Option A": string | null
          "Option B": string | null
          "Option C": string | null
          "Option D": string | null
          Question: string | null
          "S. No": number
          "Section ID": string | null
        }
        Insert: {
          "Correct Option"?: string | null
          Mark?: number | null
          "Negative Mark"?: number | null
          "Option A"?: string | null
          "Option B"?: string | null
          "Option C"?: string | null
          "Option D"?: string | null
          Question?: string | null
          "S. No": number
          "Section ID"?: string | null
        }
        Update: {
          "Correct Option"?: string | null
          Mark?: number | null
          "Negative Mark"?: number | null
          "Option A"?: string | null
          "Option B"?: string | null
          "Option C"?: string | null
          "Option D"?: string | null
          Question?: string | null
          "S. No"?: number
          "Section ID"?: string | null
        }
        Relationships: []
      }
      "Delhi Police Mock 8": {
        Row: {
          "Correct Option": string | null
          Mark: number | null
          "Negative Mark": number | null
          "Option A": string | null
          "Option B": string | null
          "Option C": string | null
          "Option D": string | null
          Question: string | null
          "S. No": number
          "Section ID": string | null
        }
        Insert: {
          "Correct Option"?: string | null
          Mark?: number | null
          "Negative Mark"?: number | null
          "Option A"?: string | null
          "Option B"?: string | null
          "Option C"?: string | null
          "Option D"?: string | null
          Question?: string | null
          "S. No": number
          "Section ID"?: string | null
        }
        Update: {
          "Correct Option"?: string | null
          Mark?: number | null
          "Negative Mark"?: number | null
          "Option A"?: string | null
          "Option B"?: string | null
          "Option C"?: string | null
          "Option D"?: string | null
          Question?: string | null
          "S. No"?: number
          "Section ID"?: string | null
        }
        Relationships: []
      }
      "Delhi Police Mock 9": {
        Row: {
          "Correct Option": string | null
          Mark: number | null
          "Negative Mark": number | null
          "Option A": string | null
          "Option B": string | null
          "Option C": string | null
          "Option D": string | null
          Question: string | null
          "S. No": number
          "Section ID": string | null
        }
        Insert: {
          "Correct Option"?: string | null
          Mark?: number | null
          "Negative Mark"?: number | null
          "Option A"?: string | null
          "Option B"?: string | null
          "Option C"?: string | null
          "Option D"?: string | null
          Question?: string | null
          "S. No": number
          "Section ID"?: string | null
        }
        Update: {
          "Correct Option"?: string | null
          Mark?: number | null
          "Negative Mark"?: number | null
          "Option A"?: string | null
          "Option B"?: string | null
          "Option C"?: string | null
          "Option D"?: string | null
          Question?: string | null
          "S. No"?: number
          "Section ID"?: string | null
        }
        Relationships: []
      }
      "General Awareness 1": {
        Row: {
          "Correct Option": string | null
          Mark: number | null
          "Negative Mark": number | null
          "Option A": string | null
          "Option B": string | null
          "Option C": string | null
          "Option D": string | null
          Question: string | null
          "S. No": number
          "Section ID": string | null
        }
        Insert: {
          "Correct Option"?: string | null
          Mark?: number | null
          "Negative Mark"?: number | null
          "Option A"?: string | null
          "Option B"?: string | null
          "Option C"?: string | null
          "Option D"?: string | null
          Question?: string | null
          "S. No": number
          "Section ID"?: string | null
        }
        Update: {
          "Correct Option"?: string | null
          Mark?: number | null
          "Negative Mark"?: number | null
          "Option A"?: string | null
          "Option B"?: string | null
          "Option C"?: string | null
          "Option D"?: string | null
          Question?: string | null
          "S. No"?: number
          "Section ID"?: string | null
        }
        Relationships: []
      }
      "General Awareness 2": {
        Row: {
          "Correct Option": string | null
          Mark: number | null
          "Negative Mark": number | null
          "Option A": string | null
          "Option B": string | null
          "Option C": string | null
          "Option D": string | null
          Question: string | null
          "S. No": number
          "Section ID": string | null
        }
        Insert: {
          "Correct Option"?: string | null
          Mark?: number | null
          "Negative Mark"?: number | null
          "Option A"?: string | null
          "Option B"?: string | null
          "Option C"?: string | null
          "Option D"?: string | null
          Question?: string | null
          "S. No": number
          "Section ID"?: string | null
        }
        Update: {
          "Correct Option"?: string | null
          Mark?: number | null
          "Negative Mark"?: number | null
          "Option A"?: string | null
          "Option B"?: string | null
          "Option C"?: string | null
          "Option D"?: string | null
          Question?: string | null
          "S. No"?: number
          "Section ID"?: string | null
        }
        Relationships: []
      }
      "General Awareness 3": {
        Row: {
          "Correct Option": string | null
          Mark: number | null
          "Negative Mark": number | null
          "Option A": string | null
          "Option B": string | null
          "Option C": string | null
          "Option D": string | null
          Question: string | null
          "S. No": number
          "Section ID": string | null
        }
        Insert: {
          "Correct Option"?: string | null
          Mark?: number | null
          "Negative Mark"?: number | null
          "Option A"?: string | null
          "Option B"?: string | null
          "Option C"?: string | null
          "Option D"?: string | null
          Question?: string | null
          "S. No": number
          "Section ID"?: string | null
        }
        Update: {
          "Correct Option"?: string | null
          Mark?: number | null
          "Negative Mark"?: number | null
          "Option A"?: string | null
          "Option B"?: string | null
          "Option C"?: string | null
          "Option D"?: string | null
          Question?: string | null
          "S. No"?: number
          "Section ID"?: string | null
        }
        Relationships: []
      }
      "General Awareness 4": {
        Row: {
          "Correct Option": string | null
          Mark: number | null
          "Negative Mark": number | null
          "Option A": string | null
          "Option B": string | null
          "Option C": string | null
          "Option D": string | null
          Question: string | null
          "S. No": number
          "Section ID": string | null
        }
        Insert: {
          "Correct Option"?: string | null
          Mark?: number | null
          "Negative Mark"?: number | null
          "Option A"?: string | null
          "Option B"?: string | null
          "Option C"?: string | null
          "Option D"?: string | null
          Question?: string | null
          "S. No": number
          "Section ID"?: string | null
        }
        Update: {
          "Correct Option"?: string | null
          Mark?: number | null
          "Negative Mark"?: number | null
          "Option A"?: string | null
          "Option B"?: string | null
          "Option C"?: string | null
          "Option D"?: string | null
          Question?: string | null
          "S. No"?: number
          "Section ID"?: string | null
        }
        Relationships: []
      }
      "General Awareness 5": {
        Row: {
          "Correct Option": string | null
          Mark: number | null
          "Negative Mark": number | null
          "Option A": string | null
          "Option B": string | null
          "Option C": string | null
          "Option D": string | null
          Question: string | null
          "S. No": number
          "Section ID": string | null
        }
        Insert: {
          "Correct Option"?: string | null
          Mark?: number | null
          "Negative Mark"?: number | null
          "Option A"?: string | null
          "Option B"?: string | null
          "Option C"?: string | null
          "Option D"?: string | null
          Question?: string | null
          "S. No": number
          "Section ID"?: string | null
        }
        Update: {
          "Correct Option"?: string | null
          Mark?: number | null
          "Negative Mark"?: number | null
          "Option A"?: string | null
          "Option B"?: string | null
          "Option C"?: string | null
          "Option D"?: string | null
          Question?: string | null
          "S. No"?: number
          "Section ID"?: string | null
        }
        Relationships: []
      }
      legal_docs: {
        Row: {
          content: string | null
          id: number
          slug: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          id: number
          slug?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          id?: number
          slug?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      "Maths 1": {
        Row: {
          "Correct Option": string | null
          Mark: number | null
          "Negative Mark": number | null
          "Option A": string | null
          "Option B": string | null
          "Option C": string | null
          "Option D": string | null
          Question: string | null
          "S. No": number
          "Section ID": string | null
        }
        Insert: {
          "Correct Option"?: string | null
          Mark?: number | null
          "Negative Mark"?: number | null
          "Option A"?: string | null
          "Option B"?: string | null
          "Option C"?: string | null
          "Option D"?: string | null
          Question?: string | null
          "S. No": number
          "Section ID"?: string | null
        }
        Update: {
          "Correct Option"?: string | null
          Mark?: number | null
          "Negative Mark"?: number | null
          "Option A"?: string | null
          "Option B"?: string | null
          "Option C"?: string | null
          "Option D"?: string | null
          Question?: string | null
          "S. No"?: number
          "Section ID"?: string | null
        }
        Relationships: []
      }
      "Maths 2": {
        Row: {
          "Correct Option": string | null
          Mark: number | null
          "Negative Mark": number | null
          "Option A": string | null
          "Option B": string | null
          "Option C": string | null
          "Option D": string | null
          Question: string | null
          "S. No": number
          "Section ID": string | null
        }
        Insert: {
          "Correct Option"?: string | null
          Mark?: number | null
          "Negative Mark"?: number | null
          "Option A"?: string | null
          "Option B"?: string | null
          "Option C"?: string | null
          "Option D"?: string | null
          Question?: string | null
          "S. No": number
          "Section ID"?: string | null
        }
        Update: {
          "Correct Option"?: string | null
          Mark?: number | null
          "Negative Mark"?: number | null
          "Option A"?: string | null
          "Option B"?: string | null
          "Option C"?: string | null
          "Option D"?: string | null
          Question?: string | null
          "S. No"?: number
          "Section ID"?: string | null
        }
        Relationships: []
      }
      "Maths 3": {
        Row: {
          "Correct Option": string | null
          Mark: number | null
          "Negative Mark": number | null
          "Option A": string | null
          "Option B": string | null
          "Option C": string | null
          "Option D": string | null
          Question: string | null
          "S. No": number
          "Section ID": string | null
        }
        Insert: {
          "Correct Option"?: string | null
          Mark?: number | null
          "Negative Mark"?: number | null
          "Option A"?: string | null
          "Option B"?: string | null
          "Option C"?: string | null
          "Option D"?: string | null
          Question?: string | null
          "S. No": number
          "Section ID"?: string | null
        }
        Update: {
          "Correct Option"?: string | null
          Mark?: number | null
          "Negative Mark"?: number | null
          "Option A"?: string | null
          "Option B"?: string | null
          "Option C"?: string | null
          "Option D"?: string | null
          Question?: string | null
          "S. No"?: number
          "Section ID"?: string | null
        }
        Relationships: []
      }
      "Maths 4": {
        Row: {
          "Correct Option": string | null
          Mark: number | null
          "Negative Mark": number | null
          "Option A": string | null
          "Option B": string | null
          "Option C": string | null
          "Option D": string | null
          Question: string | null
          "S. No": number
          "Section ID": string | null
        }
        Insert: {
          "Correct Option"?: string | null
          Mark?: number | null
          "Negative Mark"?: number | null
          "Option A"?: string | null
          "Option B"?: string | null
          "Option C"?: string | null
          "Option D"?: string | null
          Question?: string | null
          "S. No": number
          "Section ID"?: string | null
        }
        Update: {
          "Correct Option"?: string | null
          Mark?: number | null
          "Negative Mark"?: number | null
          "Option A"?: string | null
          "Option B"?: string | null
          "Option C"?: string | null
          "Option D"?: string | null
          Question?: string | null
          "S. No"?: number
          "Section ID"?: string | null
        }
        Relationships: []
      }
      "Maths 5": {
        Row: {
          "Correct Option": string | null
          Mark: number | null
          "Negative Mark": number | null
          "Option A": string | null
          "Option B": string | null
          "Option C": string | null
          "Option D": string | null
          Question: string | null
          "S. No": number
          "Section ID": string | null
        }
        Insert: {
          "Correct Option"?: string | null
          Mark?: number | null
          "Negative Mark"?: number | null
          "Option A"?: string | null
          "Option B"?: string | null
          "Option C"?: string | null
          "Option D"?: string | null
          Question?: string | null
          "S. No": number
          "Section ID"?: string | null
        }
        Update: {
          "Correct Option"?: string | null
          Mark?: number | null
          "Negative Mark"?: number | null
          "Option A"?: string | null
          "Option B"?: string | null
          "Option C"?: string | null
          "Option D"?: string | null
          Question?: string | null
          "S. No"?: number
          "Section ID"?: string | null
        }
        Relationships: []
      }
      "Maths 6": {
        Row: {
          correct_answer: string | null
          correct_option_index: number | null
          marks: number | null
          "Negative marks": number | null
          option_1: string | null
          option_2: string | null
          option_3: string | null
          option_4: string | null
          question_text: string
          section_id: string | null
        }
        Insert: {
          correct_answer?: string | null
          correct_option_index?: number | null
          marks?: number | null
          "Negative marks"?: number | null
          option_1?: string | null
          option_2?: string | null
          option_3?: string | null
          option_4?: string | null
          question_text: string
          section_id?: string | null
        }
        Update: {
          correct_answer?: string | null
          correct_option_index?: number | null
          marks?: number | null
          "Negative marks"?: number | null
          option_1?: string | null
          option_2?: string | null
          option_3?: string | null
          option_4?: string | null
          question_text?: string
          section_id?: string | null
        }
        Relationships: []
      }
      orders: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          razorpay_order_id: string | null
          razorpay_payment_id: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          id?: string
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          new_plan: string
          old_plan: string | null
          pro_rata: boolean | null
          razorpay_order_id: string | null
          razorpay_payment_id: string | null
          razorpay_signature: string | null
          status: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          id?: string
          new_plan: string
          old_plan?: string | null
          pro_rata?: boolean | null
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          razorpay_signature?: string | null
          status?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          new_plan?: string
          old_plan?: string | null
          pro_rata?: boolean | null
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          razorpay_signature?: string | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: number
          is_pro: boolean
          plan_name: string | null
          pro_until: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: number
          is_pro?: boolean
          plan_name?: string | null
          pro_until?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: number
          is_pro?: boolean
          plan_name?: string | null
          pro_until?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      "Reasoning  4": {
        Row: {
          "Correct Option": string | null
          Mark: number | null
          "Negative Mark": number | null
          "Option A": string | null
          "Option B": string | null
          "Option C": string | null
          "Option D": string | null
          Question: string | null
          "S. No": number
          "Section ID": string | null
        }
        Insert: {
          "Correct Option"?: string | null
          Mark?: number | null
          "Negative Mark"?: number | null
          "Option A"?: string | null
          "Option B"?: string | null
          "Option C"?: string | null
          "Option D"?: string | null
          Question?: string | null
          "S. No": number
          "Section ID"?: string | null
        }
        Update: {
          "Correct Option"?: string | null
          Mark?: number | null
          "Negative Mark"?: number | null
          "Option A"?: string | null
          "Option B"?: string | null
          "Option C"?: string | null
          "Option D"?: string | null
          Question?: string | null
          "S. No"?: number
          "Section ID"?: string | null
        }
        Relationships: []
      }
      "Reasoning 1": {
        Row: {
          "Correct Option": string | null
          Mark: number | null
          "Negative Mark": number | null
          "Option A": string | null
          "Option B": string | null
          "Option C": string | null
          "Option D": string | null
          Question: string | null
          "S. No": number
          "Section ID": string | null
        }
        Insert: {
          "Correct Option"?: string | null
          Mark?: number | null
          "Negative Mark"?: number | null
          "Option A"?: string | null
          "Option B"?: string | null
          "Option C"?: string | null
          "Option D"?: string | null
          Question?: string | null
          "S. No": number
          "Section ID"?: string | null
        }
        Update: {
          "Correct Option"?: string | null
          Mark?: number | null
          "Negative Mark"?: number | null
          "Option A"?: string | null
          "Option B"?: string | null
          "Option C"?: string | null
          "Option D"?: string | null
          Question?: string | null
          "S. No"?: number
          "Section ID"?: string | null
        }
        Relationships: []
      }
      "Reasoning 2": {
        Row: {
          "Correct Option": string | null
          Mark: number | null
          "Negative Mark": number | null
          "Option A": string | null
          "Option B": string | null
          "Option C": string | null
          "Option D": string | null
          Question: string | null
          "S. No": number
          "Section ID": string | null
        }
        Insert: {
          "Correct Option"?: string | null
          Mark?: number | null
          "Negative Mark"?: number | null
          "Option A"?: string | null
          "Option B"?: string | null
          "Option C"?: string | null
          "Option D"?: string | null
          Question?: string | null
          "S. No": number
          "Section ID"?: string | null
        }
        Update: {
          "Correct Option"?: string | null
          Mark?: number | null
          "Negative Mark"?: number | null
          "Option A"?: string | null
          "Option B"?: string | null
          "Option C"?: string | null
          "Option D"?: string | null
          Question?: string | null
          "S. No"?: number
          "Section ID"?: string | null
        }
        Relationships: []
      }
      "Reasoning 3": {
        Row: {
          "Correct Option": string | null
          Mark: number | null
          "Negative Mark": number | null
          "Option A": string | null
          "Option B": string | null
          "Option C": string | null
          "Option D": string | null
          Question: string | null
          "S. No": number
          "Section ID": string | null
        }
        Insert: {
          "Correct Option"?: string | null
          Mark?: number | null
          "Negative Mark"?: number | null
          "Option A"?: string | null
          "Option B"?: string | null
          "Option C"?: string | null
          "Option D"?: string | null
          Question?: string | null
          "S. No": number
          "Section ID"?: string | null
        }
        Update: {
          "Correct Option"?: string | null
          Mark?: number | null
          "Negative Mark"?: number | null
          "Option A"?: string | null
          "Option B"?: string | null
          "Option C"?: string | null
          "Option D"?: string | null
          Question?: string | null
          "S. No"?: number
          "Section ID"?: string | null
        }
        Relationships: []
      }
      "Reasoning 5": {
        Row: {
          "Correct Option": string | null
          Mark: number | null
          "Negative Mark": number | null
          "Option A": string | null
          "Option B": string | null
          "Option C": string | null
          "Option D": string | null
          Question: string | null
          "S. No": number
          "Section ID": string | null
        }
        Insert: {
          "Correct Option"?: string | null
          Mark?: number | null
          "Negative Mark"?: number | null
          "Option A"?: string | null
          "Option B"?: string | null
          "Option C"?: string | null
          "Option D"?: string | null
          Question?: string | null
          "S. No": number
          "Section ID"?: string | null
        }
        Update: {
          "Correct Option"?: string | null
          Mark?: number | null
          "Negative Mark"?: number | null
          "Option A"?: string | null
          "Option B"?: string | null
          "Option C"?: string | null
          "Option D"?: string | null
          Question?: string | null
          "S. No"?: number
          "Section ID"?: string | null
        }
        Relationships: []
      }
      "Reasoning 6": {
        Row: {
          correct_answer: string | null
          marks: number | null
          negative_marks: number | null
          option_1: string | null
          option_2: string | null
          option_3: string | null
          option_4: string | null
          question_text: string
          section_id: string | null
        }
        Insert: {
          correct_answer?: string | null
          marks?: number | null
          negative_marks?: number | null
          option_1?: string | null
          option_2?: string | null
          option_3?: string | null
          option_4?: string | null
          question_text: string
          section_id?: string | null
        }
        Update: {
          correct_answer?: string | null
          marks?: number | null
          negative_marks?: number | null
          option_1?: string | null
          option_2?: string | null
          option_3?: string | null
          option_4?: string | null
          question_text?: string
          section_id?: string | null
        }
        Relationships: []
      }
      "Reasoning 7": {
        Row: {
          correct_answer: string | null
          marks: number | null
          negative_marks: number | null
          option_1: string | null
          option_2: string | null
          option_3: string | null
          option_4: string | null
          question_text: string
          section_id: string | null
        }
        Insert: {
          correct_answer?: string | null
          marks?: number | null
          negative_marks?: number | null
          option_1?: string | null
          option_2?: string | null
          option_3?: string | null
          option_4?: string | null
          question_text: string
          section_id?: string | null
        }
        Update: {
          correct_answer?: string | null
          marks?: number | null
          negative_marks?: number | null
          option_1?: string | null
          option_2?: string | null
          option_3?: string | null
          option_4?: string | null
          question_text?: string
          section_id?: string | null
        }
        Relationships: []
      }
      "SSC GD English Mock 1": {
        Row: {
          "Correct Option": string | null
          Mark: number | null
          "Negative Mark": number | null
          "Option A": string | null
          "Option B": string | null
          "Option C": string | null
          "Option D": string | null
          "Question Text": string | null
          "S. No": number
          "Section ID": string | null
        }
        Insert: {
          "Correct Option"?: string | null
          Mark?: number | null
          "Negative Mark"?: number | null
          "Option A"?: string | null
          "Option B"?: string | null
          "Option C"?: string | null
          "Option D"?: string | null
          "Question Text"?: string | null
          "S. No": number
          "Section ID"?: string | null
        }
        Update: {
          "Correct Option"?: string | null
          Mark?: number | null
          "Negative Mark"?: number | null
          "Option A"?: string | null
          "Option B"?: string | null
          "Option C"?: string | null
          "Option D"?: string | null
          "Question Text"?: string | null
          "S. No"?: number
          "Section ID"?: string | null
        }
        Relationships: []
      }
      "SSC GD English Mock 10": {
        Row: {
          "Correct Option": string | null
          Mark: number | null
          "Negative Mark": number | null
          "Option A": string | null
          "Option B": string | null
          "Option C": string | null
          "Option D": string | null
          "Question Text": string | null
          "S. No": number
          "Section ID": string | null
        }
        Insert: {
          "Correct Option"?: string | null
          Mark?: number | null
          "Negative Mark"?: number | null
          "Option A"?: string | null
          "Option B"?: string | null
          "Option C"?: string | null
          "Option D"?: string | null
          "Question Text"?: string | null
          "S. No": number
          "Section ID"?: string | null
        }
        Update: {
          "Correct Option"?: string | null
          Mark?: number | null
          "Negative Mark"?: number | null
          "Option A"?: string | null
          "Option B"?: string | null
          "Option C"?: string | null
          "Option D"?: string | null
          "Question Text"?: string | null
          "S. No"?: number
          "Section ID"?: string | null
        }
        Relationships: []
      }
      "SSC GD English Mock 2": {
        Row: {
          "Correct Option": string | null
          Mark: number | null
          "Negative Mark": number | null
          "Option A": string | null
          "Option B": string | null
          "Option C": string | null
          "Option D": string | null
          "Question Text": string | null
          "S. No": number
          "Section ID": string | null
        }
        Insert: {
          "Correct Option"?: string | null
          Mark?: number | null
          "Negative Mark"?: number | null
          "Option A"?: string | null
          "Option B"?: string | null
          "Option C"?: string | null
          "Option D"?: string | null
          "Question Text"?: string | null
          "S. No": number
          "Section ID"?: string | null
        }
        Update: {
          "Correct Option"?: string | null
          Mark?: number | null
          "Negative Mark"?: number | null
          "Option A"?: string | null
          "Option B"?: string | null
          "Option C"?: string | null
          "Option D"?: string | null
          "Question Text"?: string | null
          "S. No"?: number
          "Section ID"?: string | null
        }
        Relationships: []
      }
      "SSC GD English Mock 3": {
        Row: {
          "Correct Option": string | null
          Mark: number | null
          "Negative Mark": number | null
          "Option A": string | null
          "Option B": string | null
          "Option C": string | null
          "Option D": string | null
          "Question Text": string | null
          "S. No": number
          "Section ID": string | null
        }
        Insert: {
          "Correct Option"?: string | null
          Mark?: number | null
          "Negative Mark"?: number | null
          "Option A"?: string | null
          "Option B"?: string | null
          "Option C"?: string | null
          "Option D"?: string | null
          "Question Text"?: string | null
          "S. No": number
          "Section ID"?: string | null
        }
        Update: {
          "Correct Option"?: string | null
          Mark?: number | null
          "Negative Mark"?: number | null
          "Option A"?: string | null
          "Option B"?: string | null
          "Option C"?: string | null
          "Option D"?: string | null
          "Question Text"?: string | null
          "S. No"?: number
          "Section ID"?: string | null
        }
        Relationships: []
      }
      "SSC GD English Mock 4": {
        Row: {
          "Correct Option": string | null
          Mark: number | null
          "Negative Mark": number | null
          "Option A": string | null
          "Option B": string | null
          "Option C": string | null
          "Option D": string | null
          "Question Text": string | null
          "S. No": number
          "Section ID": string | null
        }
        Insert: {
          "Correct Option"?: string | null
          Mark?: number | null
          "Negative Mark"?: number | null
          "Option A"?: string | null
          "Option B"?: string | null
          "Option C"?: string | null
          "Option D"?: string | null
          "Question Text"?: string | null
          "S. No": number
          "Section ID"?: string | null
        }
        Update: {
          "Correct Option"?: string | null
          Mark?: number | null
          "Negative Mark"?: number | null
          "Option A"?: string | null
          "Option B"?: string | null
          "Option C"?: string | null
          "Option D"?: string | null
          "Question Text"?: string | null
          "S. No"?: number
          "Section ID"?: string | null
        }
        Relationships: []
      }
      "SSC GD English Mock 5": {
        Row: {
          "Correct Option": string | null
          "Option A": string | null
          "Option B": string | null
          "Option C": string | null
          "Option D": string | null
          "Question Text": string | null
          "S. No": number
          "Section ID": string | null
        }
        Insert: {
          "Correct Option"?: string | null
          "Option A"?: string | null
          "Option B"?: string | null
          "Option C"?: string | null
          "Option D"?: string | null
          "Question Text"?: string | null
          "S. No": number
          "Section ID"?: string | null
        }
        Update: {
          "Correct Option"?: string | null
          "Option A"?: string | null
          "Option B"?: string | null
          "Option C"?: string | null
          "Option D"?: string | null
          "Question Text"?: string | null
          "S. No"?: number
          "Section ID"?: string | null
        }
        Relationships: []
      }
      "SSC GD English Mock 6": {
        Row: {
          "Correct Option": string | null
          "Option A": string | null
          "Option B": string | null
          "Option C": string | null
          "Option D": string | null
          "Question Text": string | null
          "S. No": number
          "Section ID": string | null
        }
        Insert: {
          "Correct Option"?: string | null
          "Option A"?: string | null
          "Option B"?: string | null
          "Option C"?: string | null
          "Option D"?: string | null
          "Question Text"?: string | null
          "S. No": number
          "Section ID"?: string | null
        }
        Update: {
          "Correct Option"?: string | null
          "Option A"?: string | null
          "Option B"?: string | null
          "Option C"?: string | null
          "Option D"?: string | null
          "Question Text"?: string | null
          "S. No"?: number
          "Section ID"?: string | null
        }
        Relationships: []
      }
      "SSC GD English Mock 7": {
        Row: {
          "Correct Option": string | null
          Mark: number | null
          "Negative Mark": number | null
          "Option A": string | null
          "Option B": string | null
          "Option C": string | null
          "Option D": string | null
          "Question Text": string | null
          "S. No": number
          "Section ID": string | null
        }
        Insert: {
          "Correct Option"?: string | null
          Mark?: number | null
          "Negative Mark"?: number | null
          "Option A"?: string | null
          "Option B"?: string | null
          "Option C"?: string | null
          "Option D"?: string | null
          "Question Text"?: string | null
          "S. No": number
          "Section ID"?: string | null
        }
        Update: {
          "Correct Option"?: string | null
          Mark?: number | null
          "Negative Mark"?: number | null
          "Option A"?: string | null
          "Option B"?: string | null
          "Option C"?: string | null
          "Option D"?: string | null
          "Question Text"?: string | null
          "S. No"?: number
          "Section ID"?: string | null
        }
        Relationships: []
      }
      "SSC GD English Mock 8": {
        Row: {
          "Correct Option": string | null
          Mark: number | null
          "Negative Mark": number | null
          "Option A": string | null
          "Option B": string | null
          "Option C": string | null
          "Option D": string | null
          "Question Text": string | null
          "S. No": number
          "Section ID": string | null
        }
        Insert: {
          "Correct Option"?: string | null
          Mark?: number | null
          "Negative Mark"?: number | null
          "Option A"?: string | null
          "Option B"?: string | null
          "Option C"?: string | null
          "Option D"?: string | null
          "Question Text"?: string | null
          "S. No": number
          "Section ID"?: string | null
        }
        Update: {
          "Correct Option"?: string | null
          Mark?: number | null
          "Negative Mark"?: number | null
          "Option A"?: string | null
          "Option B"?: string | null
          "Option C"?: string | null
          "Option D"?: string | null
          "Question Text"?: string | null
          "S. No"?: number
          "Section ID"?: string | null
        }
        Relationships: []
      }
      "SSC GD English Mock 9": {
        Row: {
          "Correct Option": string | null
          "Option A": string | null
          "Option B": string | null
          "Option C": string | null
          "Option D": string | null
          "Question Text": string | null
          "S. No": number
          "Section ID": string | null
        }
        Insert: {
          "Correct Option"?: string | null
          "Option A"?: string | null
          "Option B"?: string | null
          "Option C"?: string | null
          "Option D"?: string | null
          "Question Text"?: string | null
          "S. No": number
          "Section ID"?: string | null
        }
        Update: {
          "Correct Option"?: string | null
          "Option A"?: string | null
          "Option B"?: string | null
          "Option C"?: string | null
          "Option D"?: string | null
          "Question Text"?: string | null
          "S. No"?: number
          "Section ID"?: string | null
        }
        Relationships: []
      }
      "SSC GD Hindi Mock 1": {
        Row: {
          "Correct Option": string | null
          Mark: number | null
          "Negative Mark": number | null
          "Option A": string | null
          "Option B": string | null
          "Option C": string | null
          "Option D": string | null
          "Question Text": string | null
          "S. No": number
          "Section ID": string | null
        }
        Insert: {
          "Correct Option"?: string | null
          Mark?: number | null
          "Negative Mark"?: number | null
          "Option A"?: string | null
          "Option B"?: string | null
          "Option C"?: string | null
          "Option D"?: string | null
          "Question Text"?: string | null
          "S. No": number
          "Section ID"?: string | null
        }
        Update: {
          "Correct Option"?: string | null
          Mark?: number | null
          "Negative Mark"?: number | null
          "Option A"?: string | null
          "Option B"?: string | null
          "Option C"?: string | null
          "Option D"?: string | null
          "Question Text"?: string | null
          "S. No"?: number
          "Section ID"?: string | null
        }
        Relationships: []
      }
      "SSC GD Hindi Mock 10": {
        Row: {
          "Correct Option": string | null
          "Option A": string | null
          "Option B": string | null
          "Option C": string | null
          "Option D": string | null
          "Question Text": string | null
          "S. No.": number
          "Section ID": string | null
        }
        Insert: {
          "Correct Option"?: string | null
          "Option A"?: string | null
          "Option B"?: string | null
          "Option C"?: string | null
          "Option D"?: string | null
          "Question Text"?: string | null
          "S. No.": number
          "Section ID"?: string | null
        }
        Update: {
          "Correct Option"?: string | null
          "Option A"?: string | null
          "Option B"?: string | null
          "Option C"?: string | null
          "Option D"?: string | null
          "Question Text"?: string | null
          "S. No."?: number
          "Section ID"?: string | null
        }
        Relationships: []
      }
      "SSC GD Hindi Mock 2": {
        Row: {
          "Correct Option": string | null
          Mark: number | null
          "Negative Mark": number | null
          "Option A": string | null
          "Option B": string | null
          "Option C": string | null
          "Option D": string | null
          "Question Text": string | null
          "S. No": number
          "Section ID": string | null
        }
        Insert: {
          "Correct Option"?: string | null
          Mark?: number | null
          "Negative Mark"?: number | null
          "Option A"?: string | null
          "Option B"?: string | null
          "Option C"?: string | null
          "Option D"?: string | null
          "Question Text"?: string | null
          "S. No": number
          "Section ID"?: string | null
        }
        Update: {
          "Correct Option"?: string | null
          Mark?: number | null
          "Negative Mark"?: number | null
          "Option A"?: string | null
          "Option B"?: string | null
          "Option C"?: string | null
          "Option D"?: string | null
          "Question Text"?: string | null
          "S. No"?: number
          "Section ID"?: string | null
        }
        Relationships: []
      }
      "SSC GD Hindi Mock 3": {
        Row: {
          "Correct Option": string | null
          Mark: number | null
          "Negative Mark": number | null
          "Option A": string | null
          "Option B": string | null
          "Option C": string | null
          "Option D": string | null
          "Question Text": string | null
          "S. No": number
          "Section ID": string | null
        }
        Insert: {
          "Correct Option"?: string | null
          Mark?: number | null
          "Negative Mark"?: number | null
          "Option A"?: string | null
          "Option B"?: string | null
          "Option C"?: string | null
          "Option D"?: string | null
          "Question Text"?: string | null
          "S. No": number
          "Section ID"?: string | null
        }
        Update: {
          "Correct Option"?: string | null
          Mark?: number | null
          "Negative Mark"?: number | null
          "Option A"?: string | null
          "Option B"?: string | null
          "Option C"?: string | null
          "Option D"?: string | null
          "Question Text"?: string | null
          "S. No"?: number
          "Section ID"?: string | null
        }
        Relationships: []
      }
      "SSC GD Hindi Mock 4": {
        Row: {
          "Correct Option": string | null
          Mark: number | null
          "Negative Mark": number | null
          "Option A": string | null
          "Option B": string | null
          "Option C": string | null
          "Option D": string | null
          "Question Text": string | null
          "S. No": number
          "Section ID": string | null
        }
        Insert: {
          "Correct Option"?: string | null
          Mark?: number | null
          "Negative Mark"?: number | null
          "Option A"?: string | null
          "Option B"?: string | null
          "Option C"?: string | null
          "Option D"?: string | null
          "Question Text"?: string | null
          "S. No": number
          "Section ID"?: string | null
        }
        Update: {
          "Correct Option"?: string | null
          Mark?: number | null
          "Negative Mark"?: number | null
          "Option A"?: string | null
          "Option B"?: string | null
          "Option C"?: string | null
          "Option D"?: string | null
          "Question Text"?: string | null
          "S. No"?: number
          "Section ID"?: string | null
        }
        Relationships: []
      }
      "SSC GD Hindi Mock 5": {
        Row: {
          "Correct Option": string | null
          Mark: number | null
          "Negative Mark": number | null
          "Option A": string | null
          "Option B": string | null
          "Option C": string | null
          "Option D": string | null
          "Question Text": string | null
          "S. No": number
          "Section ID": string | null
        }
        Insert: {
          "Correct Option"?: string | null
          Mark?: number | null
          "Negative Mark"?: number | null
          "Option A"?: string | null
          "Option B"?: string | null
          "Option C"?: string | null
          "Option D"?: string | null
          "Question Text"?: string | null
          "S. No": number
          "Section ID"?: string | null
        }
        Update: {
          "Correct Option"?: string | null
          Mark?: number | null
          "Negative Mark"?: number | null
          "Option A"?: string | null
          "Option B"?: string | null
          "Option C"?: string | null
          "Option D"?: string | null
          "Question Text"?: string | null
          "S. No"?: number
          "Section ID"?: string | null
        }
        Relationships: []
      }
      "SSC GD Hindi Mock 6": {
        Row: {
          "Correct Option": string | null
          Mark: number | null
          "Negative Mark": number | null
          "Option A": string | null
          "Option B": string | null
          "Option C": string | null
          "Option D": string | null
          "Question Text": string | null
          "S. No": number
          "Section ID": string | null
        }
        Insert: {
          "Correct Option"?: string | null
          Mark?: number | null
          "Negative Mark"?: number | null
          "Option A"?: string | null
          "Option B"?: string | null
          "Option C"?: string | null
          "Option D"?: string | null
          "Question Text"?: string | null
          "S. No": number
          "Section ID"?: string | null
        }
        Update: {
          "Correct Option"?: string | null
          Mark?: number | null
          "Negative Mark"?: number | null
          "Option A"?: string | null
          "Option B"?: string | null
          "Option C"?: string | null
          "Option D"?: string | null
          "Question Text"?: string | null
          "S. No"?: number
          "Section ID"?: string | null
        }
        Relationships: []
      }
      "SSC GD Hindi Mock 7": {
        Row: {
          "Correct Option": string | null
          Mark: number | null
          "Negative Mark": number | null
          "Option A": string | null
          "Option B": string | null
          "Option C": string | null
          "Option D": string | null
          "Question Text": string | null
          "S. No": number
          "Section ID": string | null
        }
        Insert: {
          "Correct Option"?: string | null
          Mark?: number | null
          "Negative Mark"?: number | null
          "Option A"?: string | null
          "Option B"?: string | null
          "Option C"?: string | null
          "Option D"?: string | null
          "Question Text"?: string | null
          "S. No": number
          "Section ID"?: string | null
        }
        Update: {
          "Correct Option"?: string | null
          Mark?: number | null
          "Negative Mark"?: number | null
          "Option A"?: string | null
          "Option B"?: string | null
          "Option C"?: string | null
          "Option D"?: string | null
          "Question Text"?: string | null
          "S. No"?: number
          "Section ID"?: string | null
        }
        Relationships: []
      }
      "SSC GD Hindi Mock 8": {
        Row: {
          "Correct Option": string | null
          Mark: number | null
          "Negative Mark": number | null
          "Option A": string | null
          "Option B": string | null
          "Option C": string | null
          "Option D": string | null
          "Question Text": string | null
          "S. No": number
          "Section ID": string | null
        }
        Insert: {
          "Correct Option"?: string | null
          Mark?: number | null
          "Negative Mark"?: number | null
          "Option A"?: string | null
          "Option B"?: string | null
          "Option C"?: string | null
          "Option D"?: string | null
          "Question Text"?: string | null
          "S. No": number
          "Section ID"?: string | null
        }
        Update: {
          "Correct Option"?: string | null
          Mark?: number | null
          "Negative Mark"?: number | null
          "Option A"?: string | null
          "Option B"?: string | null
          "Option C"?: string | null
          "Option D"?: string | null
          "Question Text"?: string | null
          "S. No"?: number
          "Section ID"?: string | null
        }
        Relationships: []
      }
      "SSC GD Hindi Mock 9": {
        Row: {
          "Correct Option": string | null
          Mark: number | null
          "Negative Mark": number | null
          "Option A": string | null
          "Option B": string | null
          "Option C": string | null
          "Option D": string | null
          "Question Text": string | null
          "S. No.": number
          "Section ID": string | null
        }
        Insert: {
          "Correct Option"?: string | null
          Mark?: number | null
          "Negative Mark"?: number | null
          "Option A"?: string | null
          "Option B"?: string | null
          "Option C"?: string | null
          "Option D"?: string | null
          "Question Text"?: string | null
          "S. No.": number
          "Section ID"?: string | null
        }
        Update: {
          "Correct Option"?: string | null
          Mark?: number | null
          "Negative Mark"?: number | null
          "Option A"?: string | null
          "Option B"?: string | null
          "Option C"?: string | null
          "Option D"?: string | null
          "Question Text"?: string | null
          "S. No."?: number
          "Section ID"?: string | null
        }
        Relationships: []
      }
      test_attempts: {
        Row: {
          correct_answers: number
          created_at: string
          id: string
          max_score: number
          percentage: number
          score: number
          test_name: string
          time_taken: number
          unattempted: number
          user_id: string
          wrong_answers: number
        }
        Insert: {
          correct_answers?: number
          created_at?: string
          id?: string
          max_score: number
          percentage: number
          score: number
          test_name: string
          time_taken?: number
          unattempted?: number
          user_id: string
          wrong_answers?: number
        }
        Update: {
          correct_answers?: number
          created_at?: string
          id?: string
          max_score?: number
          percentage?: number
          score?: number
          test_name?: string
          time_taken?: number
          unattempted?: number
          user_id?: string
          wrong_answers?: number
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          challenging_topics: string | null
          created_at: string
          daily_study_hours: string | null
          id: number
          peak_study_time: string | null
          proficiency_level: string | null
          questionnaire_completed: string | null
          revision_frequency: string | null
          study_pace: string | null
          user_id: string | null
        }
        Insert: {
          challenging_topics?: string | null
          created_at?: string
          daily_study_hours?: string | null
          id?: number
          peak_study_time?: string | null
          proficiency_level?: string | null
          questionnaire_completed?: string | null
          revision_frequency?: string | null
          study_pace?: string | null
          user_id?: string | null
        }
        Update: {
          challenging_topics?: string | null
          created_at?: string
          daily_study_hours?: string | null
          id?: number
          peak_study_time?: string | null
          proficiency_level?: string | null
          questionnaire_completed?: string | null
          revision_frequency?: string | null
          study_pace?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_global_leaderboard: {
        Args: never
        Returns: {
          avg_percentage: number
          full_name: string
          total_points: number
          total_tests: number
          user_id: string
        }[]
      }
      get_leaderboard_profiles: {
        Args: never
        Returns: {
          full_name: string
          user_id: string
        }[]
      }
      get_test_leaderboard: {
        Args: { test_name_param: string }
        Returns: {
          full_name: string
          percentage: number
          score: number
          time_taken: number
          user_id: string
        }[]
      }
      get_test_questions_without_answers: {
        Args: { test_name_param: string }
        Returns: {
          id: number
          marks: number
          negative_marks: number
          option_1: string
          option_2: string
          option_3: string
          option_4: string
          question_text: string
        }[]
      }
      get_test_solutions: {
        Args: { p_test_name: string; p_user_id: string }
        Returns: {
          correct_option: string
          id: number
          marks: number
          negative_marks: number
          option_1: string
          option_2: string
          option_3: string
          option_4: string
          question_text: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      submit_test_answers: {
        Args: {
          p_answers: Json
          p_test_name: string
          p_time_taken: number
          p_user_id: string
        }
        Returns: Json
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
