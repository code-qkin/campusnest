import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from './firebase';
import {
  doc,
  getDoc,
  addDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  Timestamp
} from 'firebase/firestore';
import { useAuth } from './authen';
import { deleteDoc } from 'firebase/firestore'; // ✅ Add this at the top

function Checkout() {
  const { id } = useParams();
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
    const start = new Date(startDate);
    const end = new Date(endDate);
    const totalPrice = calculateTotalPrice();

    const bookingsRef = collection(db, 'bookings');

    // 1. Check for date overlap
    const overlapQuery = query(
      bookingsRef,
      where('propertyId', '==', property.id),
      where('status', 'in', ['pending', 'approved'])
    );
    const overlapSnapshot = await getDocs(overlapQuery);

    const isOverlap = overlapSnapshot.docs.some(doc => {
      const data = doc.data();
      const existingStart = new Date(data.startDate);
      const existingEnd = new Date(data.endDate);
      return start <= existingEnd && end >= existingStart;
    });

    if (isOverlap) {
      alert('This property is already booked during the selected dates.');
      return;
    }

    // 2. Delete previous pending bookings for this user/property
    const userPendingQuery = query(
      bookingsRef,
      where('userId', '==', currentUser.uid),
      where('propertyId', '==', property.id),
      where('status', '==', 'pending')
    );
    const pendingSnapshot = await getDocs(userPendingQuery);
    for (const docSnap of pendingSnapshot.docs) {
      await deleteDoc(docSnap.ref); // ✅ fixed line
    }

    // 3. Create new approved booking
    await addDoc(bookingsRef, {
      userId: currentUser.uid,
      propertyId: property.id,
      propertyName: property.title || 'Property',
      startDate,
      endDate,
      status: 'approved',
      totalPrice,
      createdAt: new Date().toISOString()
    });

    // 4. Add to history
    await addDoc(collection(db, 'history'), {
      userId: currentUser.uid,
      action: 'Booking Approved',
      propertyId: property.id,
      propertyName: property.title,
      timestamp: new Date().toISOString()
    });

    // ✅ Redirect
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
