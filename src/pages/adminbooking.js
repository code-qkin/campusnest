import React, { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from './firebase';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'bookings'));
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setBookings(data);
      } catch (err) {
        toast.error("Failed to load bookings.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const updateBookingStatus = async (id, status) => {
    try {
      await updateDoc(doc(db, 'bookings', id), { status });
      setBookings(prev =>
        prev.map(booking =>
          booking.id === id ? { ...booking, status } : booking
        )
      );
      toast.success(`Booking ${status}`);
    } catch (err) {
      toast.error("Failed to update booking.");
    }
  };

  if (loading) return <div>Loading bookings...</div>;

  return (
    <div className="container mt-4">
      <ToastContainer />
      <h2 className="mb-4">Admin Booking Review</h2>
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        bookings.map(booking => (
          <div key={booking.id} className="card mb-3 p-3">
            <p><strong>User:</strong> {booking.userEmail}</p>
            <p><strong>Property ID:</strong> {booking.propertyId}</p>
            <p><strong>Dates:</strong> {new Date(booking.startDate).toDateString()} - {new Date(booking.endDate).toDateString()}</p>
            <p><strong>Status:</strong> <span className={`badge ${booking.status === 'pending' ? 'bg-warning' : booking.status === 'approved' ? 'bg-success' : 'bg-secondary'}`}>{booking.status}</span></p>
            <div className="mt-2">
              {booking.status === 'pending' && (
                <>
                  <button className="btn btn-success me-2" onClick={() => updateBookingStatus(booking.id, 'approved')}>
                    Approve
                  </button>
                  <button className="btn btn-danger" onClick={() => updateBookingStatus(booking.id, 'cancelled')}>
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default AdminBookings;
