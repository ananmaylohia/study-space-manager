import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { API_BASE_URL } from '@/lib/api';

export interface StudySpace {
  space_id: string;
  space_name: string;
  location: string;
  capacity: number;
  type: 'silent' | 'discussion' | 'open';
}

export interface Booking {
  booking_id: string;
  user_id: string;
  user_email: string;
  space_id: string;
  space_name?: string;
  date: string;
  start_time: string;
  end_time: string;
  status: 'active' | 'completed' | 'cancelled';
  check_in_time?: string;
  check_out_time?: string;
}

export interface NoiseReport {
  report_id: string;
  space_id: string;
  space_name?: string;
  user_id: string;
  user_email: string;
  timestamp: string;
  description: string;
}

interface DataContextType {
  studySpaces: StudySpace[];
  bookings: Booking[];
  noiseReports: NoiseReport[];
  addBooking: (booking: Omit<Booking, 'booking_id' | 'status'>) => Promise<void>;
  checkIn: (bookingId: string) => Promise<void>;
  checkOut: (bookingId: string) => Promise<void>;
  addNoiseReport: (report: Omit<NoiseReport, 'report_id' | 'timestamp'>) => Promise<void>;
  refreshBookings: () => Promise<void>;
  refreshNoiseReports: () => Promise<void>;
  refreshSpaces: () => Promise<void>;
}

const fallbackStudySpaces: StudySpace[] = [
  { space_id: '1', space_name: 'Library Zone A', location: 'Main Library, 2nd Floor', capacity: 20, type: 'silent' },
  { space_id: '2', space_name: 'Group Study Room 1', location: 'Academic Block, Room 101', capacity: 8, type: 'discussion' },
  { space_id: '3', space_name: 'Open Study Hall', location: 'Student Center', capacity: 50, type: 'open' },
  { space_id: '4', space_name: 'Library Zone B', location: 'Main Library, 3rd Floor', capacity: 15, type: 'silent' },
  { space_id: '5', space_name: 'Seminar Room 2', location: 'Academic Block, Room 205', capacity: 12, type: 'discussion' },
];

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [studySpaces, setStudySpaces] = useState<StudySpace[]>(fallbackStudySpaces);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [noiseReports, setNoiseReports] = useState<NoiseReport[]>([]);

  const refreshSpaces = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/spaces`);
      if (response.ok) {
        const data = await response.json();
        setStudySpaces(data.map((s: any) => ({
          space_id: s.id.toString(),
          space_name: s.name,
          location: s.location,
          capacity: s.total_seats,
          type: s.type,
        })));
      }
    } catch { console.warn('Backend not available, using fallback spaces'); }
  };

  const refreshBookings = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings`);
      if (response.ok) {
        const data = await response.json();
        setBookings(data.map((b: any) => ({
          booking_id: b.id.toString(),
          user_id: b.user_id.toString(),
          user_email: b.user_email,
          space_id: b.study_space_id.toString(),
          space_name: b.space_name,
          date: b.booking_date,
          start_time: b.start_time,
          end_time: b.end_time,
          status: b.status,
          check_in_time: b.check_in_time,
          check_out_time: b.check_out_time,
        })));
      }
    } catch { console.warn('Backend not available for bookings'); }
  };

  const refreshNoiseReports = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/noise-reports`);
      if (response.ok) {
        const data = await response.json();
        setNoiseReports(data.map((r: any) => ({
          report_id: r.id.toString(),
          user_id: r.user_id.toString(),
          space_id: r.study_space_id.toString(),
          space_name: r.space_name,
          user_email: r.user_email,
          timestamp: r.timestamp,
          description: r.description,
        })));
      }
    } catch { console.warn('Backend not available for noise reports'); }
  };

  useEffect(() => {
    refreshSpaces();
    refreshBookings();
    refreshNoiseReports();
  }, []);

  const addBooking = async (booking: Omit<Booking, 'booking_id' | 'status'>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: parseInt(booking.user_id),
          study_space_id: parseInt(booking.space_id),
          booking_date: booking.date,
          start_time: booking.start_time,
          end_time: booking.end_time,
        }),
      });
      if (response.ok) await refreshBookings();
      else throw new Error('Failed to create booking');
    } catch {
      console.warn('Backend not available, using local booking');
      setBookings(prev => [...prev, {
        ...booking,
        booking_id: Math.random().toString(36).substr(2, 9),
        status: 'active' as const,
      }]);
    }
  };

  const checkIn = async (bookingId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/checkin`, { method: 'PUT' });
      if (response.ok) {
        setBookings(prev => prev.map(b =>
          b.booking_id === bookingId ? { ...b, check_in_time: new Date().toISOString() } : b
        ));
      }
    } catch {
      setBookings(prev => prev.map(b =>
        b.booking_id === bookingId ? { ...b, check_in_time: new Date().toISOString() } : b
      ));
    }
  };

  const checkOut = async (bookingId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/checkout`, { method: 'PUT' });
      if (response.ok) {
        setBookings(prev => prev.map(b =>
          b.booking_id === bookingId ? { ...b, check_out_time: new Date().toISOString(), status: 'completed' as const } : b
        ));
      }
    } catch {
      setBookings(prev => prev.map(b =>
        b.booking_id === bookingId ? { ...b, check_out_time: new Date().toISOString(), status: 'completed' as const } : b
      ));
    }
  };

  const addNoiseReport = async (report: Omit<NoiseReport, 'report_id' | 'timestamp'>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/noise-report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: parseInt(report.user_id),
          study_space_id: parseInt(report.space_id),
          description: report.description,
        }),
      });
      if (response.ok) await refreshNoiseReports();
      else throw new Error('Failed to create noise report');
    } catch {
      console.warn('Backend not available, using local noise report');
      setNoiseReports(prev => [...prev, {
        ...report,
        report_id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
      }]);
    }
  };

  return (
    <DataContext.Provider value={{
      studySpaces, bookings, noiseReports,
      addBooking, checkIn, checkOut, addNoiseReport,
      refreshBookings, refreshNoiseReports, refreshSpaces,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) throw new Error('useData must be used within a DataProvider');
  return context;
};
