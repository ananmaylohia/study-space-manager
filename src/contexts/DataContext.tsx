import React, { createContext, useContext, useState, ReactNode } from 'react';

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
  user_id: string;
  user_email: string;
  timestamp: string;
  description: string;
}

interface DataContextType {
  studySpaces: StudySpace[];
  bookings: Booking[];
  noiseReports: NoiseReport[];
  addBooking: (booking: Omit<Booking, 'booking_id'>) => void;
  checkIn: (bookingId: string) => void;
  checkOut: (bookingId: string) => void;
  addNoiseReport: (report: Omit<NoiseReport, 'report_id'>) => void;
}

const initialStudySpaces: StudySpace[] = [
  { space_id: '1', space_name: 'Library Zone A', location: 'Main Library, 2nd Floor', capacity: 20, type: 'silent' },
  { space_id: '2', space_name: 'Group Study Room 1', location: 'Academic Block, Room 101', capacity: 8, type: 'discussion' },
  { space_id: '3', space_name: 'Open Study Hall', location: 'Student Center', capacity: 50, type: 'open' },
  { space_id: '4', space_name: 'Library Zone B', location: 'Main Library, 3rd Floor', capacity: 15, type: 'silent' },
  { space_id: '5', space_name: 'Seminar Room 2', location: 'Academic Block, Room 205', capacity: 12, type: 'discussion' },
];

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [studySpaces] = useState<StudySpace[]>(initialStudySpaces);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [noiseReports, setNoiseReports] = useState<NoiseReport[]>([]);

  const addBooking = (booking: Omit<Booking, 'booking_id'>) => {
    const newBooking: Booking = {
      ...booking,
      booking_id: Math.random().toString(36).substr(2, 9),
    };
    setBookings(prev => [...prev, newBooking]);
  };

  const checkIn = (bookingId: string) => {
    setBookings(prev =>
      prev.map(b =>
        b.booking_id === bookingId
          ? { ...b, check_in_time: new Date().toISOString() }
          : b
      )
    );
  };

  const checkOut = (bookingId: string) => {
    setBookings(prev =>
      prev.map(b =>
        b.booking_id === bookingId
          ? { ...b, check_out_time: new Date().toISOString(), status: 'completed' as const }
          : b
      )
    );
  };

  const addNoiseReport = (report: Omit<NoiseReport, 'report_id'>) => {
    const newReport: NoiseReport = {
      ...report,
      report_id: Math.random().toString(36).substr(2, 9),
    };
    setNoiseReports(prev => [...prev, newReport]);
  };

  return (
    <DataContext.Provider
      value={{
        studySpaces,
        bookings,
        noiseReports,
        addBooking,
        checkIn,
        checkOut,
        addNoiseReport,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
