import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./pages/authen";
import Home from "./pages/Home.js";
import Dashboard from "./pages/userdashboard.js";
import PostListing from "./pages/postlisting.js";
import Listing from "./pages/Listing.js";
import Signin from "./pages/Sign-in.js";
import Profile from "./pages/Profile.js";
import Booking from "./pages/booking.js";
import Signup from "./pages/Sign-up.js";
import AdminSignup from "./pages/adminsign-up.js";
import AdminDashboard from "./pages/admindashboard.js";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import AdminGuard from "./pages/adminguard.js";
import PropertyDetails from "./pages/Listingdetail.js";
import Userhome from "./pages/userhome.js";
import AdminBookings from "./pages/adminbooking.js";
import Checkout from "./pages/checkout.js";
import CheckoutSuccess from "./pages/checkoutsuccess.js";

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/admin/properties/new" element={<PostListing />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/login" element={<Signin />} />
                    <Route path="/admin/signup" element={<AdminSignup />} />
                    <Route path="/admin" element={
                        <AdminDashboard />
                    } />

                    <Route path="/admin/bookings" element={
                        <AdminBookings />
                    } />
                    <Route path="/dashboard" element={<Dashboard />}>
                        <Route index element={<Navigate to="userhome" />} />
                        <Route path="userhome" element={<Userhome />} />
                        <Route path="listing" element={<Listing />} />
                        <Route path="profile" element={<Profile />} />
                        <Route path="book/:id" element={<Booking />} />
                        <Route path="listing/:id" element={<PropertyDetails />} />
                        <Route path="checkout/:id" element={<Checkout />} />
                        <Route path="checkout-success" element={<CheckoutSuccess />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;