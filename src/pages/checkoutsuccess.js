import React from 'react';
import { Link } from 'react-router-dom';

function CheckoutSuccess() {
  return (
    <div className="container text-center py-5">
      <h2 className="text-success">🎉 Booking Successful!</h2>
      <p>Your booking has been confirmed and marked as <strong>approved</strong>.</p>
      <Link to="/dashboard" className="btn btn-primary mt-3">
        Go to Dashboard
      </Link>
    </div>
  );
}

export default CheckoutSuccess;
