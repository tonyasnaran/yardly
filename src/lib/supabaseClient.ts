import { createClient } from '@supabase/supabase-js';

// Validate environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL is not set');
}
if (!supabaseAnonKey) {
  throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is not set');
}

// Create a single instance of the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

// Test function to verify connection
export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase
      .from('yards')
      .select('*')
      .limit(1);

    if (error) {
      console.error('Supabase connection test failed:', error);
      return { success: false, error };
    }

    // Connection is successful even if no data exists
    return { 
      success: true, 
      data: data?.[0] || null,
      message: data?.length === 0 ? 'Connection successful but no yards found' : 'Connection successful'
    };
  } catch (error) {
    console.error('Error testing Supabase connection:', error);
    return { success: false, error };
  }
}

// Function to fetch all yards
export async function fetchYards() {
  try {
    const { data, error } = await supabase
      .from('yards')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching yards:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error in fetchYards:', error);
    return { success: false, error };
  }
}

// Function to update guest limits
export async function updateGuestLimits() {
  try {
    // First, add the guest_limit column if it doesn't exist
    const { error: alterError } = await supabase.rpc('add_guest_limit_column');
    
    if (alterError) {
      console.error('Error adding guest_limit column:', alterError);
      return { success: false, error: alterError };
    }

    // Update existing yards with guest limits
    const { error: updateError } = await supabase
      .from('yards')
      .update({ 
        guest_limit: 'Up to 15 guests',
        updated_at: new Date().toISOString()
      })
      .is('guest_limit', null);

    if (updateError) {
      console.error('Error updating guest limits:', updateError);
      return { success: false, error: updateError };
    }

    return { success: true, message: 'Guest limits updated successfully' };
  } catch (error) {
    console.error('Error in updateGuestLimits:', error);
    return { success: false, error };
  }
}

// Function to create a new yard with guest limit
export async function createYard(yardData: {
  name: string;
  description: string;
  price: number;
  image_url: string;
  amenities: string[];
  city: string;
  lat?: number;
  lng?: number;
  guest_limit: 'Up to 10 guests' | 'Up to 15 guests' | 'Up to 20 guests' | 'Up to 25 guests';
}) {
  try {
    const { data, error } = await supabase
      .from('yards')
      .insert([{
        ...yardData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select();

    if (error) {
      console.error('Error creating yard:', error);
      return { success: false, error };
    }

    return { success: true, data: data[0] };
  } catch (error) {
    console.error('Error in createYard:', error);
    return { success: false, error };
  }
}

// Function to create initial yards with varied guest limits
export async function createInitialYards() {
  try {
    // First, check if the table exists and has the correct structure
    const { data: tableInfo, error: tableError } = await supabase
      .from('yards')
      .select('id')
      .limit(1);

    if (tableError && tableError.code === '42P01') {
      // Table doesn't exist
      return { 
        success: false, 
        error: 'Yards table does not exist. Please run the database migrations first.',
        code: 'TABLE_NOT_FOUND'
      };
    }

    const initialYards = [
      {
        name: 'Beachfront Garden Oasis',
        description: 'A stunning beachfront garden space in Venice',
        price: 90,
        image_url: '/images/yards/Beachfront Garden Oasis.jpg',
        lat: 33.985,
        lng: -118.4695,
        guest_limit: 'Up to 20 guests'
      },
      {
        name: 'Bohemian Backyard',
        description: 'A vibrant, artistic outdoor space in the heart of Echo Park',
        price: 75,
        image_url: '/images/yards/Bohemian Backyard.jpg',
        lat: 34.0904,
        lng: -118.2783,
        guest_limit: 'Up to 15 guests'
      },
      {
        name: 'Los Angeles Downtown Rooftop',
        description: 'A modern rooftop space with panoramic city views',
        price: 65,
        image_url: '/images/yards/Los Angeles Downtown Rooftop.jpg',
        lat: 34.0407,
        lng: -118.2468,
        guest_limit: 'Up to 25 guests'
      },
      {
        name: 'Ocean View Patio',
        description: 'A beautiful oceanfront patio in Malibu with stunning views',
        price: 85,
        image_url: '/images/yards/Ocean View Patio.jpg',
        lat: 34.0369,
        lng: -118.7066,
        guest_limit: 'Up to 20 guests'
      },
      {
        name: 'Santa Monica Garden',
        description: 'A serene garden space in Santa Monica featuring lush landscaping',
        price: 55,
        image_url: '/images/yards/Santa Monica Garden.jpg',
        lat: 34.0195,
        lng: -118.4912,
        guest_limit: 'Up to 10 guests'
      },
      {
        name: 'Urban Rooftop Garden',
        description: 'A modern rooftop garden in West Hollywood',
        price: 60,
        image_url: '/images/yards/Urban Rooftop Garden.jpg',
        lat: 34.09,
        lng: -118.3617,
        guest_limit: 'Up to 15 guests'
      }
    ];

    // Insert the yards one by one to better handle errors
    const results = [];
    const errors = [];

    for (const yard of initialYards) {
      const { data, error } = await supabase
        .from('yards')
        .insert([yard])
        .select();

      if (error) {
        console.error('Error creating yard:', error);
        errors.push({ yard: yard.name, error });
      } else {
        results.push(data[0]);
      }
    }

    if (errors.length > 0) {
      return { 
        success: false, 
        error: 'Some yards failed to create',
        details: errors,
        created: results
      };
    }

    return { 
      success: true, 
      data: results,
      message: `Created ${results.length} yards with varied guest limits`
    };
  } catch (error) {
    console.error('Error in createInitialYards:', error);
    return { 
      success: false, 
      error,
      message: 'An unexpected error occurred while creating yards'
    };
  }
}

// Function to inspect the yards table
export async function inspectYardsTable() {
  try {
    // Get table structure
    const { data: tableInfo, error: tableError } = await supabase
      .from('yards')
      .select('*')
      .limit(1);

    if (tableError) {
      console.error('Error fetching table info:', tableError);
      return { success: false, error: tableError };
    }

    // Get all yards
    const { data: yards, error: yardsError } = await supabase
      .from('yards')
      .select('*')
      .order('created_at', { ascending: true });

    if (yardsError) {
      console.error('Error fetching yards:', yardsError);
      return { success: false, error: yardsError };
    }

    return { 
      success: true,
      tableStructure: tableInfo?.[0] ? Object.keys(tableInfo[0]) : [],
      yardsCount: yards?.length || 0,
      yards: yards || []
    };
  } catch (error) {
    console.error('Error inspecting yards table:', error);
    return { success: false, error };
  }
} 