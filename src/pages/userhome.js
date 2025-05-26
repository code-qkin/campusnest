import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './authen';
import { db } from './firebase';
import { updateDoc, doc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';

function UserHome() {
  const { currentUser, logout } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  const cancelBooking = async (bookingId) => {
    try {
      const cancelledBooking = bookings.find(b => b.id === bookingId);
      const propertyId = cancelledBooking?.propertyId;

      await deleteDoc(doc(db, 'bookings', bookingId));

      const updatedBookings = bookings.filter(b => b.id !== bookingId);
      setBookings(updatedBookings);

      const stillHasBookings = updatedBookings.some(b => b.propertyId === propertyId);
      if (!stillHasBookings) {
        setProperties(prev => prev.filter(p => p.id !== propertyId));
      }

      alert('Booking permanently removed.');
    } catch (err) {
      alert('Failed to delete booking: ' + err.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (currentUser) {
          const bookingsQuery = query(
            collection(db, 'bookings'),
            where('userId', '==', currentUser.uid)
          );
          const bookingsSnapshot = await getDocs(bookingsQuery);
          const bookingsData = bookingsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setBookings(bookingsData);

          const propertyIds = bookingsData.map(b => b.propertyId).slice(0, 10);
          if (propertyIds.length > 0) {
            const propertiesQuery = query(
              collection(db, 'properties'),
              where('__name__', 'in', propertyIds)
            );
            const propertiesSnapshot = await getDocs(propertiesQuery);
            setProperties(propertiesSnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            })));
          } else {
            setProperties([]);
          }
        }
      } catch (err) {
        setError('Failed to load data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  const filteredBookings = bookings.filter(booking => {
    if (booking.status === 'cancelled') return false;
    const now = new Date();
    const end = new Date(booking.endDate);
    if (filter === 'all') return booking.status !== 'cancelled';
    if (filter === 'upcoming') return end >= now;
    if (filter === 'past') return end < now;
    return booking.status === filter;
  });

  if (!currentUser) return <div>Loading user data...</div>;

  return (
    <div className="container-fluid">
      <div className="card mb-4">
        <div className="card-header">
          <h4>Welcome, {currentUser.email}</h4>
        </div>
        <div className="card-body">
          <h5>Your Recent Activity</h5>
          {error && <div className="alert alert-danger">{error}</div>}
          <div className="row mt-4">
            <div className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5>My Bookings ({bookings.length})</h5>

                  {/* Filters */}
                  <div className="mb-3">
                    <button className="btn btn-outline-primary me-2" onClick={() => setFilter('all')}>All</button>
                    <button className="btn btn-outline-success me-2" onClick={() => setFilter('approved')}>Approved</button>
                    <button className="btn btn-outline-warning me-2" onClick={() => setFilter('pending')}>Pending</button>
                    <button className="btn btn-outline-danger me-2" onClick={() => setFilter('cancelled')}>Cancelled</button>
                    <button className="btn btn-outline-secondary me-2" onClick={() => setFilter('upcoming')}>Upcoming</button>
                    <button className="btn btn-outline-dark" onClick={() => setFilter('past')}>Past</button>
                  </div>

                  {loading ? (
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  ) : (
                    <>
                      {filteredBookings.length > 0 ? (
                        <ul className="list-group">
                          {filteredBookings.map(booking => (
                            <li key={booking.id} className="list-group-item">
                              <strong>{booking.propertyName || 'Property'}</strong><br />
                              Dates: {new Date(booking.startDate).toLocaleDateString()} to {new Date(booking.endDate).toLocaleDateString()}<br />
                              Status: <span className={`badge ${booking.status === 'approved' ? 'bg-success' :
                                booking.status === 'pending' ? 'bg-warning' : 'bg-danger'}`}>
                                {booking.status}
                              </span>
                              {booking.status === 'pending' && (
                                <div className="mt-2 d-flex gap-2">
                                  <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => cancelBooking(booking.id)}
                                  >
                                    Cancel Booking
                                  </button>
                                  <button
                                    className="btn btn-sm btn-primary"
                                    onClick={() => navigate(`/dashboard/checkout/${booking.propertyId}`)}
                                  >
                                    Checkout
                                  </button>
                                </div>
                              )}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>No bookings match this filter</p>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Properties */}
            <div className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5>My Properties ({properties.length})</h5>
                  {loading ? (
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  ) : (
                    <>
                      {properties.length > 0 ? (
                        <div className="list-group">
                          {properties.map(property => (
                            <Link
                              key={property.id}
                              to={`/dashboard/listing/${property.id}`}
                              className="list-group-item list-group-item-action"
                            >
                              <div className="d-flex justify-content-between">
                                <strong>{property.title}</strong>
                                <span>${property.price}/mo</span>
                              </div>
                              <small className="text-muted">{property.location}</small>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-3">
                          <p>You haven't listed any properties yet</p>
                          <Link to="/dashboard/listing" className="btn btn-primary">
                            Browse Listings
                          </Link>
                        </div>
                      )}
                      {properties.length > 0 && (
                        <Link to="/dashboard/listing" className="btn btn-secondary mt-3">
                          View All Properties
                        </Link>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>  
    </div>
  );
}

export default UserHome;
