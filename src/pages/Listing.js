import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where, addDoc } from 'firebase/firestore';
import { db } from './firebase';
import { useAuth } from './authen';

function PropertyList() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [bookedPropertyIds, setBookedPropertyIds] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const q = query(collection(db, 'properties'), where('status', '==', 'available'));
        const querySnapshot = await getDocs(q);
        const propertiesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProperties(propertiesData);
        setFilteredProperties(propertiesData);

        // Fetch booked property IDs
        const bookingQuery = query(
          collection(db, 'bookings'),
          where('status', 'in', ['pending', 'approved'])
        );
        const bookingSnap = await getDocs(bookingQuery);
        const bookedIds = bookingSnap.docs.map(doc => doc.data().propertyId);
        setBookedPropertyIds(bookedIds);
      } catch (err) {
        setError('Failed to load properties');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  useEffect(() => {
    const lowerSearch = searchTerm.toLowerCase();
    const filtered = properties.filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(lowerSearch) || p.location.toLowerCase().includes(lowerSearch);
      const matchesPrice = (!minPrice || parseFloat(p.price) >= parseFloat(minPrice)) && (!maxPrice || parseFloat(p.price) <= parseFloat(maxPrice));
      const matchesType = !propertyType || p.type?.toLowerCase() === propertyType.toLowerCase();
      return matchesSearch && matchesPrice && matchesType;
    });
    setFilteredProperties(filtered);
  }, [searchTerm, minPrice, maxPrice, propertyType, properties]);

  const handleBookNow = async (property) => {
    try {
      const existingBookingQuery = query(
        collection(db, "bookings"),
        where("propertyId", "==", property.id),
        where("userId", "==", currentUser.uid),
        where("status", "in", ["pending", "approved"])
      );
      const existingSnap = await getDocs(existingBookingQuery);
      if (!existingSnap.empty) {
        alert("You already have a pending or approved booking for this property.");
        return;
      }

      await addDoc(collection(db, "bookings"), {
        userId: currentUser.uid,
        propertyId: property.id,
        propertyName: property.title,
        startDate: new Date().toISOString(),
        endDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(),
        status: 'pending',
        createdAt: new Date(),
        price: property.price,
        propertyData: property,
      });
      alert("Booking created! Proceed to checkout.");
      navigate('/dashboard/userhome');
    } catch (err) {
      console.error("Failed to book:", err);
      alert("Error booking property.");
    }
  };

  if (loading) return <div className="text-center my-5"><div className="spinner-border"></div></div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container my-4">
      <h3>Available Listings</h3>
      {/* Filters here... */}
      <div className="row">
        {filteredProperties.length === 0 ? (
          <div className="text-muted">No properties match your filters.</div>
        ) : (
          filteredProperties.map(property => {
            const isBooked = bookedPropertyIds.includes(property.id);
            return (
              <div key={property.id} className="col-md-6 col-lg-4 mb-4">
                <div className="card h-100">
                  {/* Image and Info */}
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{property.title}</h5>
                    <p className="card-text text-muted">
                      <i className="bi bi-geo-alt"></i> {property.location}
                    </p>
                    <div className="d-flex justify-content-between mb-3">
                      <span className="badge bg-primary">${property.price}/mo</span>
                      <span>{property.bedrooms} 🛏 | {property.bathrooms} 🛁</span>
                    </div>
                    <div className="d-grid gap-2 mt-auto">
                      <Link to={`/dashboard/listing/${property.id}`} className="btn btn-outline-primary">
                        <i className="bi bi-eye"></i> View Details
                      </Link>
                      {currentUser && (
                        <button
                          onClick={() => handleBookNow(property)}
                          className="btn btn-primary"
                          disabled={isBooked}
                        >
                          <i className="bi bi-calendar-check"></i> {isBooked ? 'Already Booked' : 'Book Now'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default PropertyList;
