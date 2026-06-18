export type UserRole = 'customer' | 'admin';

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  role: UserRole;
  joined_at: string;
}

export interface Vehicle {
  id: string;
  name: string;
  category: 'Economy' | 'Sedan' | 'Minivan' | 'Van' | 'SUV' | 'Luxury Vehicles';
  transmission: 'Automatic' | 'Manual';
  fuel_type: 'Petrol' | 'Diesel' | 'Hybrid' | 'Electric';
  seats: number;
  price_per_day: number; // in LKR or USD. Let's use LKR (e.g. 15,000 LKR) or convert to transparent label. Let's display "LKR 15,000" (or simple RS / LKR).
  deposit_amount: number; // e.g. 50,000 LKR
  mileage_limit: string; // e.g., "150 km / day"
  description: string;
  main_image: string;
  images: string[];
  available: boolean;
  owner_contact: string; // Phone number or name of the owner
}

export type BookingStatus = 'pending' | 'approved' | 'rejected';

export interface Booking {
  id: string;
  user_id: string;
  user_name: string;
  user_phone: string;
  vehicle_id: string;
  vehicle_name: string;
  pickup_date: string;
  return_date: string;
  pickup_location: string;
  total_price: number;
  commission: number; // 10%
  status: BookingStatus;
  created_at: string;
  doc_nic_passport?: string; // base64 representation or file name
  doc_nic_passport_name?: string;
  doc_driving_license?: string; // base64 representation or file name
  doc_driving_license_name?: string;
}
