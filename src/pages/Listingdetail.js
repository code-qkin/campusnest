import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { doc, getDoc, collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { db } from "./firebase";
import { useAuth } from "./authen";

function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isBooked, setIsBooked] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const docRef = doc(db, "properties", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const propertyData = { id: docSnap.id, ...docSnap.data() };
          setProperty(propertyData);

          // Check if already booked
          const bookingQuery = query(
            collection(db, "bookings"),
            where("propertyId", "==", docSnap.id),
            where("status", "in", ["pending", "approved"])
          );
          const bookingSnap = await getDocs(bookingQuery);
          setIsBooked(!bookingSnap.empty);
        } else {
          setError("Property not found");
        }
      } catch (err) {
        setError("Failed to load property details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  const handleBooking = async () => {
    try {
      await addDoc(collection(db, 'bookings'), {
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

  if (loading) {
    return <div className="text-center my-5"><div className="spinner-border" role="status"></div></div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!property) {
    return null;
  }

  return (
    <div className="container my-4">
      <div className="row">
        <div className="col-md-8">
          <h2>{property.title}</h2>
          <p className="text-muted">
            <i className="bi bi-geo-alt"></i> {property.location}
          </p>

          {/* Image Gallery */}
          <div className="mb-4">
            {property.images?.length > 0 ? (
              <div id="propertyCarousel" className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-inner">
                  {property.images.map((img, index) => (
                    <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                      <img
                        src={img}
                        className="d-block w-100 rounded"
                        alt={`Property ${index + 1}`}
                        style={{ height: '400px', objectFit: 'cover' }}
                      />
                    </div>
                  ))}
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#propertyCarousel" data-bs-slide="prev">
                  <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#propertyCarousel" data-bs-slide="next">
                  <span className="carousel-control-next-icon" aria-hidden="true"></span>
                </button>
              </div>
            ) : (
              <div className="bg-light text-center p-5 rounded">
                <i className="bi bi-image" style={{ fontSize: '3rem' }}></i>
                <p>No images available</p>
              </div>
            )}
          </div>

          <h4>Description</h4>
          <p>{property.description || 'No description provided.'}</p>

          <div className="row mb-4">
            <div className="col-md-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Details</h5>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item d-flex justify-content-between">
                      <span>Type:</span>
                      <span className="text-capitalize">{property.type}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between">
                      <span>Bedrooms:</span>
                      <span>{property.bedrooms}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between">
                      <span>Bathrooms:</span>
                      <span>{property.bathrooms}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between">
                      <span>Status:</span>
                      <span className="badge bg-success">{property.status}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card sticky-top" style={{ top: '20px' }}>
            <div className="card-body">
              <h4 className="card-title">${property.price}/mo</h4>

              {currentUser ? (
                <>
                  <button
                    onClick={handleBooking}
                    className="btn btn-primary w-100 mb-3"
                    disabled={isBooked}
                  >
                    <i className="bi bi-calendar-check"></i> {isBooked ? "Already Booked" : "Book Now"}
                  </button>

                  <button
                    onClick={() => navigate(-1)}
                    className="btn btn-outline-secondary w-100"
                  >
                    <i className="bi bi-arrow-left"></i> Back to Listings
                  </button>
                </>
              ) : (
                <div className="alert alert-info">
                  Please <Link to="/login">login</Link> to book this property
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PropertyDetails;
