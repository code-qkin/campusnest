import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from './firebase';
import { useAuth } from './authen';

function PropertyList() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
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

        const propertiesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setProperties(propertiesData);
        setFilteredProperties(propertiesData);
      } catch (err) {
        setError('Failed to load properties');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Filtering logic
  useEffect(() => {
    const lowerSearch = searchTerm.toLowerCase();
    const filtered = properties.filter(p => {
      const matchesSearch =
        p.title.toLowerCase().includes(lowerSearch) ||
        p.location.toLowerCase().includes(lowerSearch);

      const matchesPrice =
        (!minPrice || parseFloat(p.price) >= parseFloat(minPrice)) &&
        (!maxPrice || parseFloat(p.price) <= parseFloat(maxPrice));

      const matchesType =
        !propertyType || p.type?.toLowerCase() === propertyType.toLowerCase();

      return matchesSearch && matchesPrice && matchesType;
    });

    setFilteredProperties(filtered);
  }, [searchTerm, minPrice, maxPrice, propertyType, properties]);

  if (loading) {
    return <div className="text-center my-5"><div className="spinner-border" role="status"></div></div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="container my-4">
      <h3>Available Listing</h3>

      {/* Filters Section */}
      <div className="row mb-4">
        <div className="col-md-4 mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Search by title or location"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-2 mb-2">
          <input
            type="number"
            className="form-control"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
        </div>
        <div className="col-md-2 mb-2">
          <input
            type="number"
            className="form-control"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
        <div className="col-md-4 mb-2">
          <select
            className="form-select"
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="Apartment">Apartment</option>
            <option value="Self-contain">Self-contain</option>
            <option value="Shared">Shared</option>
            <option value="Studio">Studio</option>
          </select>
        </div>
      </div>

      <div className="row">
        {filteredProperties.length === 0 ? (
          <div className="text-muted">No properties match your filters.</div>
        ) : (
          filteredProperties.map(property => (
            <div key={property.id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100">
                {property.images?.[0] ? (
                  <img
                    src={property.images[0]}
                    className="card-img-top property-image"
                    alt={property.title}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                ) : (
                  <div className="text-white text-center p-4" style={{ height: '200px', backgroundColor: '#244a71' }}>
                    No Image Available
                  </div>
                )}

                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{property.title}</h5>
                  <p className="card-text text-muted">
                    <i className="bi bi-geo-alt"></i> {property.location}
                  </p>

                  <div className="mt-auto">
                    <div className="d-flex justify-content-between mb-3">
                      <span className="badge" style={{ backgroundColor: '#244a71' }}>
                        ${property.price}/mo
                      </span>
                      <span>
                        {property.bedrooms} <i className="bi bi-door-open"></i> | {property.bathrooms} <i className="bi bi-bucket"></i>
                      </span>
                    </div>

                    <div className="d-grid gap-2">
                      <Link
                        to={`/dashboard/listing/${property.id}`}
                        className="btn btn-outline-primary"
                        style={{ borderColor: '#244a71', color: '#244a71' }}
                      >
                        <i className="bi bi-eye"></i> View Details
                      </Link>

                      {currentUser && (
                        <button
                          onClick={() => navigate(`/dashboard/book/${property.id}`)}
                          className="btn btn-primary"
                          style={{ backgroundColor: '#244a71' }}
                        >
                          <i className="bi bi-calendar-check"></i> Book Now
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default PropertyList;
