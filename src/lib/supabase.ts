// Supabase client configuration
// In demo mode, this is a minimal mock client
// For production, replace with actual Supabase SDK

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Mock Supabase client for demo purposes
export const supabase = {
  from: (tableName: string) => ({
    select: (columns?: string) => ({
      order: (column: string, options?: any) => ({
        data: [],
        error: null,
      }),
      limit: (count: number) => ({
        data: [],
        error: null,
      }),
      data: [],
      error: null,
    }),
    insert: async (data: any) => ({
      data: null,
      error: new Error('Demo mode - insert disabled'),
    }),
    update: async (data: any) => ({
      data: null,
      error: new Error('Demo mode - update disabled'),
    }),
  }),
}

export type SupabaseClient = typeof supabase
