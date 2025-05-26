import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from './authen';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { query, where, getDocs } from 'firebase/firestore';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function Booking() {
  const { id: propertyId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (startDate >= endDate) {
      return setError('End date must be after start date');
    }

    setLoading(true);

    try {
      // Check for existing booking by same user for the same property
      const bookingQuery = query(
        collection(db, 'bookings'),
        where('userId', '==', currentUser.uid),
        where('propertyId', '==', propertyId)
      );

      const querySnapshot = await getDocs(bookingQuery);

      const hasDuplicate = querySnapshot.docs.some(doc => {
        const data = doc.data();
        const existingStart = new Date(data.startDate);
        const existingEnd = new Date(data.endDate);
        return (
          (startDate <= existingEnd) && (endDate >= existingStart)
        );
      });

      if (hasDuplicate) {
        setError('You already have a booking for this property during the selected dates.');
        setLoading(false);
        return;
      }

      // Proceed with booking
      await addDoc(collection(db, 'bookings'), {
        propertyId,
        userId: currentUser.uid,
        userEmail: currentUser.email,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        message,
        status: 'pending',
        createdAt: serverTimestamp()
      });

      setSuccess(true);
      setTimeout(() => navigate('/dashboard/userhome'), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h3>Book Property</h3>
            </div>
            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}
              {success && (
                <div className="alert alert-success">
                  Booking request submitted! Redirecting...
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Check-in Date</label>
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      minDate={new Date()}
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Check-out Date</label>
                    <DatePicker
                      selected={endDate}
                      onChange={(date) => setEndDate(date)}
                      minDate={startDate}
                      className="form-control"
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Special Requests</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  ></textarea>
                </div>

                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                  <button
                    type="button"
                    className="btn btn-secondary me-md-2"
                    onClick={() => navigate(-1)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Submitting...' : 'Confirm Booking'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Booking;