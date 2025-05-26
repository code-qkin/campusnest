import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase'; // removed storage

function AdminPropertyForm() {
  const [property, setProperty] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    bedrooms: 1,
    bathrooms: 1,
    type: 'apartment',
    status: 'available'
  });

  const [imageUrls, setImageUrls] = useState(['']);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProperty(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUrlChange = (index, value) => {
    const updatedUrls = [...imageUrls];
    updatedUrls[index] = value;
    setImageUrls(updatedUrls);
  };

  const addImageField = () => {
    setImageUrls([...imageUrls, '']);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setUploading(true);

    try {
      const filteredImageUrls = imageUrls.filter(url => url.trim() !== '');

      const propertyData = {
        ...property,
        price: Number(property.price),
        bedrooms: Number(property.bedrooms),
        bathrooms: Number(property.bathrooms),
        images: filteredImageUrls,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await addDoc(collection(db, 'properties'), propertyData);

      setSuccess(true);
      setProperty({
        title: '',
        description: '',
        price: '',
        location: '',
        bedrooms: 1,
        bathrooms: 1,
        type: 'apartment',
        status: 'available'
      });
      setImageUrls(['']);

      setTimeout(() => {
        navigate('/listing');
      }, 2000);

    } catch (err) {
      setError(`Failed to create property: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container my-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h3>Add New Property</h3>
            </div>
            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}
              {success && (
                <div className="alert alert-success">
                  Property created successfully! Redirecting...
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Title */}
                <div className="mb-3">
                  <label className="form-label">Title*</label>
                  <input
                    type="text"
                    className="form-control"
                    name="title"
                    value={property.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Description */}
                <div className="mb-3">
                  <label className="form-label">Description*</label>
                  <textarea
                    className="form-control"
                    name="description"
                    rows="4"
                    value={property.description}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                {/* Price and Location */}
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Price (per month)*</label>
                    <input
                      type="number"
                      className="form-control"
                      name="price"
                      value={property.price}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Location*</label>
                    <input
                      type="text"
                      className="form-control"
                      name="location"
                      value={property.location}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Property Details */}
                <div className="row g-3 mb-3">
                  <div className="col-md-4">
                    <label className="form-label">Type*</label>
                    <select
                      className="form-select"
                      name="type"
                      value={property.type}
                      onChange={handleChange}
                      required
                    >
                      <option value="apartment">Apartment</option>
                      <option value="house">House</option>
                      <option value="condo">Condo</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Bedrooms*</label>
                    <select
                      className="form-select"
                      name="bedrooms"
                      value={property.bedrooms}
                      onChange={handleChange}
                      required
                    >
                      {[1, 2, 3, 4, 5].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Bathrooms*</label>
                    <select
                      className="form-select"
                      name="bathrooms"
                      value={property.bathrooms}
                      onChange={handleChange}
                      required
                    >
                      {[1, 1.5, 2, 2.5, 3].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Image URLs */}
                <div className="mb-3">
                  <label className="form-label">Image URLs</label>
                  {imageUrls.map((url, index) => (
                    <div key={index} className="input-group mb-2">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="https://example.com/image.jpg"
                        value={url}
                        onChange={(e) => handleImageUrlChange(index, e.target.value)}
                      />
                    </div>
                  ))}
                  <button type="button" className="btn btn-sm btn-outline-primary" onClick={addImageField}>
                    Add Another Image URL
                  </button>
                </div>

                {/* Submit Buttons */}
                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                  <button
                    type="button"
                    className="btn btn-secondary me-md-2"
                    onClick={() => navigate('/admin')}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={uploading}
                  >
                    {uploading ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status"></span>
                        <span className="ms-2">Saving...</span>
                      </>
                    ) : 'Save Property'}
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

export default AdminPropertyForm;
