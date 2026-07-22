import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Vehicle, Booking, BookingStatus } from '../types';
import { loadSeedData, db, getSupabaseError, clearSupabaseError } from '../supabase';

interface AppContextType {
  currentUser: User | null;
  vehicles: Vehicle[];
  bookings: Booking[];
  loading: boolean;
  supabaseError: string | null;
  clearDbError: () => void;
  login: (email: string, role?: 'admin' | 'customer') => Promise<{ success: boolean; error?: string }>;
  register: (email: string, fullName: string, phone: string, role: 'customer' | 'admin') => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  addVehicle: (vehicle: Omit<Vehicle, 'id'>) => void;
  updateVehicle: (vehicle: Vehicle) => void;
  deleteVehicle: (id: string) => void;
  addBooking: (booking: Omit<Booking, 'id' | 'user_id' | 'user_name' | 'user_phone' | 'commission' | 'status' | 'created_at'> & {
    doc_nic_passport?: string;
    doc_nic_passport_name?: string;
    doc_driving_license?: string;
    doc_driving_license_name?: string;
    total_price?: number;
    guest_name?: string;
    guest_phone?: string;
  }) => Promise<{ success: boolean; error?: string; booking?: Booking }>;
  updateBookingStatus: (bookingId: string, status: BookingStatus) => void;
  refreshDb: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [supabaseError, setSupabaseError] = useState<string | null>(null);

  const syncErrors = () => {
    setSupabaseError(getSupabaseError());
  };

  const clearDbError = () => {
    clearSupabaseError();
    setSupabaseError(null);
  };

  useEffect(() => {
    // 1. Initial seed load
    loadSeedData();

    // 2. Load lists dynamically from DB (or LocalStorage fallback)
    const loadInitialData = async () => {
      setLoading(true);
      try {
        const storedVehicles = await db.getVehicles();
        const storedBookings = await db.getBookings();

        setVehicles(storedVehicles);
        setBookings(storedBookings);

        // 3. Load active session
        const storedUser = localStorage.getItem('ridelanka_current_user');
        if (storedUser) {
          setCurrentUser(JSON.parse(storedUser));
          // } else {
          //   // Find standard template user or let user use auth
          //   const users = await db.getUsers();
          //   const autoUser = users.find(u => u.email === 'kavindugayan024@gmail.com');
          //   if (autoUser) {
          //     setCurrentUser(autoUser);
          //     localStorage.setItem('ridelanka_current_user', JSON.stringify(autoUser));
          //   }
        }
      } catch (err) {
        console.error('Failed to load initial data:', err);
      } finally {
        syncErrors();
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const refreshDb = async () => {
    setLoading(true);
    try {
      const storedVehicles = await db.getVehicles();
      const storedBookings = await db.getBookings();
      setVehicles(storedVehicles);
      setBookings(storedBookings);
    } catch (err) {
      console.error('Refresh database failed:', err);
    } finally {
      syncErrors();
      setLoading(false);
    }
  };

  const login = async (email: string, role?: 'admin' | 'customer') => {
    const users = await db.getUsers();
    let matched = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    // If matching a specific role requested in preview
    if (role && matched && matched.role !== role) {
      matched = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.role === role);
    }

    if (matched) {
      setCurrentUser(matched);
      localStorage.setItem('ridelanka_current_user', JSON.stringify(matched));
      syncErrors();
      return { success: true };
    } else {
      // Auto register to make previewing very easy!
      const newUserId = 'u-' + Math.random().toString(36).substr(2, 9);
      const isNewAdmin = email.includes('admin');
      const newUser: User = {
        id: newUserId,
        email,
        full_name: email.split('@')[0].toUpperCase(),
        phone: '+94 77 ' + Math.floor(1000000 + Math.random() * 9000000),
        role: isNewAdmin ? 'admin' : 'customer',
        joined_at: new Date().toISOString()
      };

      await db.saveUser(newUser);
      syncErrors();
      setCurrentUser(newUser);
      localStorage.setItem('ridelanka_current_user', JSON.stringify(newUser));
      return { success: true };
    }
  };

  const register = async (email: string, fullName: string, phone: string, role: 'customer' | 'admin') => {
    const users = await db.getUsers();

    const exists = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      setCurrentUser(exists);
      localStorage.setItem('ridelanka_current_user', JSON.stringify(exists));
      syncErrors();
      return { success: true }; // Allow logging back in instantly via register action
    }

    const newUser: User = {
      id: 'u-' + Math.random().toString(36).substring(2, 9),
      email,
      full_name: fullName,
      phone,
      role,
      joined_at: new Date().toISOString()
    };

    await db.saveUser(newUser);
    syncErrors();
    setCurrentUser(newUser);
    localStorage.setItem('ridelanka_current_user', JSON.stringify(newUser));
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('ridelanka_current_user');
    clearDbError();
  };

  const addVehicle = async (vehicleData: Omit<Vehicle, 'id'>) => {
    const newVehicle: Vehicle = {
      ...vehicleData,
      id: 'v-' + Math.random().toString(36).substring(2, 9),
    };
    await db.saveVehicle(newVehicle);
    syncErrors();
    const updated = await db.getVehicles();
    setVehicles(updated);
  };

  const updateVehicle = async (updatedVehicle: Vehicle) => {
    await db.saveVehicle(updatedVehicle);
    syncErrors();
    const updated = await db.getVehicles();
    setVehicles(updated);
  };

  const deleteVehicle = async (id: string) => {
    await db.deleteVehicle(id);
    syncErrors();
    const updated = await db.getVehicles();
    setVehicles(updated);
  };

  const addBooking = async (
    bookingData: Omit<Booking, 'id' | 'user_id' | 'user_name' | 'user_phone' | 'commission' | 'status' | 'created_at'> & {
      doc_nic_passport?: string;
      doc_nic_passport_name?: string;
      doc_driving_license?: string;
      doc_driving_license_name?: string;
      total_price?: number;
      guest_name?: string;
      guest_phone?: string;
    }
  ) => {
    if (!currentUser && (!bookingData.guest_name || !bookingData.guest_phone)) {
      return { success: false, error: 'Please enter your name and phone number or sign in to submit a booking' };
    }

  // Enforce business logic rule: Booking requests must be at least 1 day in advance
    const pickupDate = new Date(bookingData.pickup_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
        const minLeadTimeMs = 1 * 24 * 60 * 60 * 1000; // 1 day in milliseconds
    const timeDiffMs = pickupDate.getTime() - today.getTime();

    if (timeDiffMs < minLeadTimeMs) {
      return {
        success: false,
        error: 'Booking requests must be submitted at least 1 day in advance to verify vehicle owner availability.'
      };
    }

    let calculatedPrice = 0;
    let commission = 0;

    if (bookingData.vehicle_id.startsWith('tour-')) {
      calculatedPrice = bookingData.total_price || 120000;
      commission = Math.round(calculatedPrice * 0.10);
    } else {
      const originalVeh = vehicles.find(v => v.id === bookingData.vehicle_id);
      if (!originalVeh) return { success: false, error: 'Vehicle not found' };

      const price_per_day = originalVeh.price_per_day;
      const returnDate = new Date(bookingData.return_date);
      const days = Math.ceil((returnDate.getTime() - pickupDate.getTime()) / (1000 * 60 * 60 * 24)) || 1;
      calculatedPrice = price_per_day * days;
      commission = Math.round(calculatedPrice * 0.10); // 10% commission
    }

    const userId = currentUser ? currentUser.id : ('guest-' + Math.floor(10000 + Math.random() * 90000));
    const userName = currentUser ? currentUser.full_name : (bookingData.guest_name || 'Guest User');
    const userPhone = currentUser ? currentUser.phone : (bookingData.guest_phone || 'N/A');

    const newBooking: Booking = {
      id: 'b-' + Math.floor(100 + Math.random() * 900),
      user_id: userId,
      user_name: userName,
      user_phone: userPhone,
      vehicle_id: bookingData.vehicle_id,
      vehicle_name: bookingData.vehicle_name,
      pickup_date: bookingData.pickup_date,
      return_date: bookingData.return_date,
      pickup_location: bookingData.pickup_location,
      total_price: calculatedPrice,
      commission,
      status: 'pending',
      created_at: new Date().toISOString(),
      doc_nic_passport: bookingData.doc_nic_passport,
      doc_nic_passport_name: bookingData.doc_nic_passport_name || '',
      doc_driving_license: bookingData.doc_driving_license,
       doc_driving_license_name: bookingData.doc_driving_license_name || ''
    };

    await db.saveBooking(newBooking);
    syncErrors();
    const updated = await db.getBookings();
    setBookings(updated);

    return { success: true, booking: newBooking };
  };

  const updateBookingStatus = async (bookingId: string, status: BookingStatus) => {
    await db.updateBookingStatus(bookingId, status);
    syncErrors();
    const updated = await db.getBookings();
    setBookings(updated);
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      vehicles,
      bookings,
      loading,
      supabaseError,
      clearDbError,
      login,
      register,
      logout,
      addVehicle,
      updateVehicle,
      deleteVehicle,
      addBooking,
      updateBookingStatus,
      refreshDb
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
