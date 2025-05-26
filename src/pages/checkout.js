import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from './firebase';
import { doc, getDoc, addDoc, collection } from 'firebase/firestore';
import { useAuth } from './authen';

function Checkout() {
  const { id } = useParams(); // Property ID from route
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const docRef = doc(db, 'properties', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProperty({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError('Property not found.');
        }
      } catch (err) {
        setError('Failed to load property.');
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  const calculateTotalPrice = () => {
    if (!property || !startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()) + 1;
    return months > 0 ? months * property.price : 0;
  };

  const handleBooking = async () => {
    if (!startDate || !endDate) {
      alert('Please select valid start and end dates.');
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      alert('End date must be after start date.');
      return;
    }

    try {
      const totalPrice = calculateTotalPrice();

      // 1. Create the approved booking
      await addDoc(collection(db, 'bookings'), {
        userId: currentUser.uid,
        propertyId: property.id,
        propertyName: property.title || 'Property',
        startDate,
        endDate,
        status: 'approved',
        totalPrice,
        createdAt: new Date().toISOString()
      });

      // 2. Log to booking history
      await addDoc(collection(db, 'history'), {
        userId: currentUser.uid,
        action: 'Booking Approved',
        propertyId: property.id,
        propertyName: property.title,
        timestamp: new Date().toISOString(),
      });

      // 3. Redirect to success page
      navigate('/dashboard/checkout-success');
    } catch (err) {
      alert('Failed to book: ' + err.message);
    }
  };

  if (loading) return <div className="p-4">Loading property...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container py-4">
      <h2>Checkout</h2>
      <div className="card mt-3">
        <div className="card-body">
          <h4>{property.title}</h4>
          <p><strong>Location:</strong> {property.location}</p>
          <p><strong>Monthly Price:</strong> ${property.price}</p>

          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">Start Date</label>
              <input
                type="date"
                className="form-control"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">End Date</label>
              <input
                type="date"
                className="form-control"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <p><strong>Total Price:</strong> ${calculateTotalPrice()}</p>

          <button className="btn btn-success" onClick={handleBooking}>
            Confirm Booking
          </button>
          <button className="btn btn-secondary ms-2" onClick={() => navigate(-1)}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
