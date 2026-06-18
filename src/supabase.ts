import { createClient } from '@supabase/supabase-js';
import { User, Vehicle, Booking, BookingStatus } from './types';

// ============================================================================
// SUPABASE LIVE CLIENT & GRACEFUL FALLBACK ENVIRONMENT DEFINITIONS
// ============================================================================

const rawSupabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const rawSupabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

// Clean the values to strip any accidentally inserted quotes (both double and single)
const SUPABASE_URL = typeof rawSupabaseUrl === 'string' ? rawSupabaseUrl.replace(/^['"]|['"]$/g, '').trim() : '';
const SUPABASE_ANON_KEY = typeof rawSupabaseAnonKey === 'string' ? rawSupabaseAnonKey.replace(/^['"]|['"]$/g, '').trim() : '';

// Initialize Supabase only if configured to prevent early module resolution crashes
export const isSupabaseConfigured = (): boolean => {
  return typeof SUPABASE_URL === 'string' && 
         SUPABASE_URL.trim() !== '' && 
         // Ensure it starts with http or https to be a valid URL
         (SUPABASE_URL.startsWith('http://') || SUPABASE_URL.startsWith('https://')) &&
         typeof SUPABASE_ANON_KEY === 'string' && 
         SUPABASE_ANON_KEY.trim() !== '';
};

export const supabase = isSupabaseConfigured()
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

// Track the latest database operations error visually so we can surface it in the UI!
let lastDbError: string | null = null;

export const getSupabaseError = (): string | null => {
  return lastDbError;
};

export const clearSupabaseError = (): void => {
  lastDbError = null;
};

// ============================================================================
// SRI LANKA FLEET SEGMENTS SEED DATA (Used as Out-of-Box Fallback)
// ============================================================================

const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: 'v-1',
    name: 'Toyota Land Cruiser Prado',
    category: 'SUV',
    transmission: 'Automatic',
    fuel_type: 'Diesel',
    seats: 7,
    price_per_day: 38000,
    deposit_amount: 100000,
    mileage_limit: '150 km/day (LKR 120 per extra km)',
    description: 'The King of Sri Lankan roads. This ultra-premium SUV offers maximum comfort, rugged capability, and status. Excellent for luxury tours, VIP travel, and weddings. Features dual zone climate control, leather interior, sunroof, and premium audio.',
    main_image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1549399542-7cd3cf17a35b?auto=format&fit=crop&w=1000&q=80'
    ],
    available: true,
    owner_contact: '+94 77 123 4567 (Samith)'
  },
  {
    id: 'v-2',
    name: 'Mercedes-Benz E300 AMG',
    category: 'Luxury Vehicles',
    transmission: 'Automatic',
    fuel_type: 'Petrol',
    seats: 5,
    price_per_day: 55000,
    deposit_amount: 150000,
    mileage_limit: '100 km/day (LKR 180 per extra km)',
    description: 'A masterpiece of premium engineering. Perfect for executive transport, weddings, or making an impression when cruising Colombo. Boasts intelligent lighting, Burmester ambient surround sound, and heated dynamic leather seats.',
    main_image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1000&q=80'
    ],
    available: true,
    owner_contact: '+94 77 987 6543 (Nimal)'
  },
  {
    id: 'v-3',
    name: 'Toyota Corolla Axio Hybrid',
    category: 'Sedan',
    transmission: 'Automatic',
    fuel_type: 'Hybrid',
    seats: 5,
    price_per_day: 14500,
    deposit_amount: 50000,
    mileage_limit: '150 km/day (LKR 60 per extra km)',
    description: 'The definitive executive sedan for comfort, reliability, and executive style. Features dynamic seat comfort, comprehensive safety assistance, and excellent fuel efficiency on dual carriageways and central expressways.',
    main_image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1000&q=80'
    ],
    available: true,
    owner_contact: '+94 71 445 2211 (Rohan)'
  },
  {
    id: 'v-4',
    name: 'Toyota Aqua S Grade',
    category: 'Economy',
    transmission: 'Automatic',
    fuel_type: 'Hybrid',
    seats: 5,
    price_per_day: 11000,
    deposit_amount: 35000,
    mileage_limit: 'Unlimited within WP',
    description: 'The ultimate fuel-efficient companion for navigating bustling Colombo streets. Easy to park, soft handling, and extremely reliable. Equipped with keyless entry, standard dashboard nav, and high efficiency hybrid drive.',
    main_image: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=80'
    ],
    available: true,
    owner_contact: '+94 72 223 3344 (Kasun)'
  },
  {
    id: 'v-5',
    name: 'Toyota KDH Super Grand Cabin',
    category: 'Van',
    transmission: 'Automatic',
    fuel_type: 'Diesel',
    seats: 14,
    price_per_day: 28000,
    deposit_amount: 80000,
    mileage_limit: '200 km/day (LKR 80 per extra km)',
    description: 'Luxury high-roof van ideal for dynamic groups, family outings, and destination trips to Sigiriya, Ella, or Galle. Features dual rotating seats, individually adjustable rear air-conditioning vents, supreme cabin space, and soft-closing passenger door.',
    main_image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1000&q=80'
    ],
    available: true,
    owner_contact: '+94 75 777 8888 (Dinesh)'
  },
  {
    id: 'v-6',
    name: 'Toyota Alphard Executive Lounge',
    category: 'Minivan',
    transmission: 'Automatic',
    fuel_type: 'Petrol',
    seats: 7,
    price_per_day: 48000,
    deposit_amount: 120000,
    mileage_limit: '150 km/day (LKR 150 per extra km)',
    description: 'The pinnacle of luxury minivan passenger transport. Extremely popular in Sri Lanka for VIP transfers, wedding couples, and executive travel. Equipped with automated pilot chairs, theater surround sound, and dual electronic siding doors.',
    main_image: 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1000&q=80'
    ],
    available: true,
    owner_contact: '+94 77 111 2222 (Shanka)'
  }
];

const INITIAL_USERS: User[] = [
  {
    id: 'u-admin',
    email: 'admin@ridelanka.com',
    full_name: 'RideLanka Admin',
    phone: '0723350075',
    role: 'admin',
    joined_at: '2026-01-01T00:00:00Z'
  },
  {
    id: 'u-customer',
    email: 'kavindugayan024@gmail.com',
    full_name: 'Kavindu Gayan',
    phone: '+94 77 112 2334',
    role: 'customer',
    joined_at: '2026-05-15T08:30:00Z'
  }
];

const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'b-101',
    user_id: 'u-customer',
    user_name: 'Kavindu Gayan',
    user_phone: '+94 77 112 2334',
    vehicle_id: 'v-1',
    vehicle_name: 'Toyota Land Cruiser Prado',
    pickup_date: '2026-06-15',
    return_date: '2026-06-22',
    pickup_location: 'Bandaranaike Intl Airport (CMB)',
    total_price: 266000, 
    commission: 26600,
    status: 'approved',
    created_at: '2026-05-20T10:15:00Z',
    doc_nic_passport_name: 'NIC_Kavindu.pdf',
    doc_driving_license_name: 'License_Kavindu.jpg'
  },
  {
    id: 'b-102',
    user_id: 'u-customer',
    user_name: 'Kavindu Gayan',
    user_phone: '+94 77 112 2334',
    vehicle_id: 'v-4',
    vehicle_name: 'Toyota Aqua S Grade',
    pickup_date: '2026-07-01',
    return_date: '2026-07-08',
    pickup_location: 'Colombo 03 (Colpetty)',
    total_price: 77000,
    commission: 7700,
    status: 'pending',
    created_at: '2026-05-27T16:45:00Z',
    doc_nic_passport_name: 'Passport_Scan.pdf',
    doc_driving_license_name: 'License_Scan.jpg'
  }
];

// Seed databases
export const loadSeedData = () => {
  const rawVehicles = localStorage.getItem('ridelanka_vehicles');
  if (rawVehicles) {
    try {
      const parsed: Vehicle[] = JSON.parse(rawVehicles);
      const hasOutdatedCategory = parsed.some(v => v.category as string === 'Luxury' || v.category as string === 'Premium');
      if (hasOutdatedCategory) {
        localStorage.removeItem('ridelanka_vehicles');
      }
    } catch {
      localStorage.removeItem('ridelanka_vehicles');
    }
  }

  if (!localStorage.getItem('ridelanka_vehicles')) {
    localStorage.setItem('ridelanka_vehicles', JSON.stringify(INITIAL_VEHICLES));
  }
  if (!localStorage.getItem('ridelanka_users')) {
    localStorage.setItem('ridelanka_users', JSON.stringify(INITIAL_USERS));
  }
  if (!localStorage.getItem('ridelanka_bookings')) {
    localStorage.setItem('ridelanka_bookings', JSON.stringify(INITIAL_BOOKINGS));
  }
};

// ============================================================================
// DYNAMIC PERSISTENCE LAYER CONTROLLER (Supabase SQL API <=> LocalStorage Sync)
// ============================================================================

export const db = {
  // --- USERS SECTION ---
  async getUsers(): Promise<User[]> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.from('users').select('*');
      if (!error && data) {
        lastDbError = null;
        if (data.length > 0) {
          return data as User[];
        } else {
          console.warn('Supabase fetch users yielded 0 records, falling back to local storage.');
        }
      }
      if (error) {
        lastDbError = `Fetch users: ${error.message} (${error.code || ''})`;
      }
      console.error('Supabase fetch users failed, utilizing fallback:', error);
    }
    return JSON.parse(localStorage.getItem('ridelanka_users') || '[]');
  },

  async saveUser(user: User): Promise<User> {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from('users').upsert(user);
      if (!error) {
        lastDbError = null;
        return user;
      }
      lastDbError = `Save user: ${error.message} (${error.code || ''})`;
      console.error('Supabase write user failed:', error);
    }
    const currentList = JSON.parse(localStorage.getItem('ridelanka_users') || '[]');
    const filtered = currentList.filter((u: User) => u.id !== user.id);
    const updated = [...filtered, user];
    localStorage.setItem('ridelanka_users', JSON.stringify(updated));
    return user;
  },

  // --- VEHICLES SECTION ---
  async getVehicles(): Promise<Vehicle[]> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.from('vehicles').select('*');
      if (!error && data) {
        lastDbError = null;
        if (data.length > 0) {
          return data as Vehicle[];
        } else {
          console.warn('Supabase fetch vehicles yielded 0 records, falling back to local storage.');
        }
      }
      if (error) {
        lastDbError = `Fetch vehicles: ${error.message} (${error.code || ''})`;
      }
      console.error('Supabase fetch vehicles failed, utilizing fallback:', error);
    }
    return JSON.parse(localStorage.getItem('ridelanka_vehicles') || '[]');
  },

  async saveVehicle(vehicle: Vehicle): Promise<Vehicle> {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from('vehicles').upsert(vehicle);
      if (!error) {
        lastDbError = null;
        return vehicle;
      }
      lastDbError = `Save vehicle failed: ${error.message} [Code: ${error.code || ''}]. Please check if Row Level Security (RLS) is disabled or has a write policy in Supabase!`;
      console.error('Supabase save vehicle failed:', error);
    }
    const currentList = JSON.parse(localStorage.getItem('ridelanka_vehicles') || '[]');
    const filtered = currentList.filter((v: Vehicle) => v.id !== vehicle.id);
    const updated = [vehicle, ...filtered];
    localStorage.setItem('ridelanka_vehicles', JSON.stringify(updated));
    return vehicle;
  },

  async deleteVehicle(id: string): Promise<boolean> {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from('vehicles').delete().eq('id', id);
      if (!error) {
        lastDbError = null;
        return true;
      }
      lastDbError = `Delete vehicle: ${error.message} (${error.code || ''})`;
      console.error('Supabase delete vehicle failed:', error);
    }
    const currentList = JSON.parse(localStorage.getItem('ridelanka_vehicles') || '[]');
    const updated = currentList.filter((v: Vehicle) => v.id !== id);
    localStorage.setItem('ridelanka_vehicles', JSON.stringify(updated));
    return true;
  },

  // --- BOOKINGS SECTION ---
  async getBookings(): Promise<Booking[]> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.from('bookings').select('*');
      if (!error && data) {
        lastDbError = null;
        if (data.length > 0) {
          return data as Booking[];
        } else {
          console.warn('Supabase fetch bookings yielded 0 records, falling back to local storage.');
        }
      }
      if (error) {
        lastDbError = `Fetch bookings: ${error.message} (${error.code || ''})`;
      }
      console.error('Supabase fetch bookings failed, utilizing fallback:', error);
    }
    return JSON.parse(localStorage.getItem('ridelanka_bookings') || '[]');
  },

  async saveBooking(booking: Booking): Promise<Booking> {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from('bookings').upsert(booking);
      if (!error) {
        lastDbError = null;
        return booking;
      }
      lastDbError = `Save booking failed: ${error.message} [Code: ${error.code || ''}]. Please check if Row Level Security (RLS) is disabled or has an insert policy in Supabase!`;
      console.error('Supabase save booking failed:', error);
    }
    const currentList = JSON.parse(localStorage.getItem('ridelanka_bookings') || '[]');
    const filtered = currentList.filter((b: Booking) => b.id !== booking.id);
    const updated = [booking, ...filtered];
    localStorage.setItem('ridelanka_bookings', JSON.stringify(updated));
    return booking;
  },

  async updateBookingStatus(id: string, status: BookingStatus): Promise<boolean> {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from('bookings').update({ status }).eq('id', id);
      if (!error) {
        lastDbError = null;
        return true;
      }
      lastDbError = `Update booking failed: ${error.message} [Code: ${error.code || ''}]`;
      console.error('Supabase status update failed:', error);
    }
    const currentList = JSON.parse(localStorage.getItem('ridelanka_bookings') || '[]');
    const updated = currentList.map((b: Booking) => b.id === id ? { ...b, status } : b);
    localStorage.setItem('ridelanka_bookings', JSON.stringify(updated));
    return true;
  }
};

// ============================================================================
// SQL SCHEMA SETUP GUIDE (Copy Paste directly to Supabase SQL Editor!)
// ============================================================================
/*
-- ⚠️ RESET & CREATE SCHEMA: COPY-PASTE AND RUN THE ENTIRE BLOCK BELOW INTO YOUR SUPABASE SQL EDITOR:

-- 1. DROP EXISTING TABLES IN REVERSE ORDER OF DEPENDENCY
DROP TABLE IF EXISTS public.bookings CASCADE;
DROP TABLE IF EXISTS public.vehicles CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- 2. CREATE USERS PROFILE TABLE
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    role TEXT CHECK (role IN ('admin', 'customer')) DEFAULT 'customer',
    joined_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CREATE VEHICLES LISTINGS TABLE
CREATE TABLE IF NOT EXISTS public.vehicles (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Economy', 'Sedan', 'Minivan', 'Van', 'SUV', 'Luxury Vehicles')),
    transmission TEXT NOT NULL CHECK (transmission IN ('Automatic', 'Manual')),
    fuel_type TEXT NOT NULL CHECK (fuel_type IN ('Petrol', 'Diesel', 'Hybrid', 'Electric')),
    seats INTEGER NOT NULL,
    price_per_day INTEGER NOT NULL,
    deposit_amount INTEGER NOT NULL,
    mileage_limit TEXT NOT NULL,
    description TEXT NOT NULL,
    main_image TEXT NOT NULL,
    images JSONB DEFAULT '[]'::jsonb,
    available BOOLEAN DEFAULT TRUE,
    owner_contact TEXT NOT NULL
);

-- 4. CREATE BOOKINGS TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS public.bookings (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    user_name TEXT NOT NULL,
    user_phone TEXT NOT NULL,
    vehicle_id TEXT NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
    vehicle_name TEXT NOT NULL,
    pickup_date TEXT NOT NULL,
    return_date TEXT NOT NULL,
    pickup_location TEXT NOT NULL,
    total_price INTEGER NOT NULL,
    commission INTEGER NOT NULL,
    status TEXT CHECK (status IN ('pending', 'approved', 'rejected', 'completed')) DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    doc_nic_passport TEXT,
    doc_nic_passport_name TEXT,
    doc_driving_license TEXT,
    doc_driving_license_name TEXT
);

-- 5. DISABLE ROW LEVEL SECURITY (RLS) SO PUBLIC READ/WRITE CAN OPERATE SAFELY
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings DISABLE ROW LEVEL SECURITY;

-- 6. INSERT COLD SEED DATA FOR FIRST LAUNCH
-- Populate Users
INSERT INTO public.users (id, email, full_name, phone, role) VALUES 
('u-admin', 'admin@ridelanka.com', 'RideLanka Admin', '0723350075', 'admin'),
('u-customer', 'kavindugayan024@gmail.com', 'Kavindu Gayan', '+94 77 112 2334', 'customer')
ON CONFLICT (id) DO NOTHING;

-- Populate Vehicles
INSERT INTO public.vehicles (id, name, category, transmission, fuel_type, seats, price_per_day, deposit_amount, mileage_limit, description, main_image, images, available, owner_contact) VALUES 
('v-1', 'Toyota Land Cruiser Prado', 'SUV', 'Automatic', 'Diesel', 7, 38000, 100000, '150 km/day (LKR 120 per extra km)', 'The King of Sri Lankan roads. This ultra-premium SUV offers maximum comfort, rugged capability, and status. Excellent for luxury tours, VIP travel, and weddings. Features dual zone climate control, leather interior, sunroof, and premium audio.', 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1000&q=80', '["https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1000&q=80"]'::jsonb, true, '+94 77 123 4567 (Samith)'),
('v-2', 'Mercedes-Benz E300 AMG', 'Luxury Vehicles', 'Automatic', 'Petrol', 5, 55000, 150000, '100 km/day (LKR 180 per extra km)', 'A masterpiece of premium engineering. Perfect for executive transport, weddings, or making an impression when cruising Colombo. Boasts intelligent lighting, Burmester ambient surround sound, and heated dynamic leather seats.', 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1000&q=80', '["https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1000&q=80"]'::jsonb, true, '+94 77 987 6543 (Nimal)'),
('v-3', 'Toyota Corolla Axio Hybrid', 'Sedan', 'Automatic', 'Hybrid', 5, 14500, 50000, '150 km/day (LKR 60 per extra km)', 'The definitive executive sedan for comfort, reliability, and executive style. Features dynamic seat comfort, comprehensive safety assistance, and excellent fuel efficiency on dual carriageways and central expressways.', 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1000&q=80', '["https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1000&q=80"]'::jsonb, true, '+94 71 445 2211 (Rohan)'),
('v-4', 'Toyota Aqua S Grade', 'Economy', 'Automatic', 'Hybrid', 5, 11000, 35000, 'Unlimited within WP', 'The ultimate fuel-efficient companion for navigating bustling Colombo streets. Easy to park, soft handling, and extremely reliable. Equipped with keyless entry, standard dashboard nav, and high efficiency hybrid drive.', 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1000&q=80', '["https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1000&q=80"]'::jsonb, true, '+94 72 223 3344 (Kasun)')
ON CONFLICT (id) DO NOTHING;
*/
