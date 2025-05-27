import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse } from '@fortawesome/free-solid-svg-icons'
import { faFacebook, faGoogle, faXTwitter, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons'
import { Link } from 'react-router-dom';
import home from '../img/home.png'
import '../css/home.css';
import emailjs from 'emailjs-com';

function Home() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });

    const [status, setStatus] = useState({ type: '', message: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const { name, email, message } = formData;

        if (!name || !email || !message) {
            setStatus({ type: 'error', message: 'Please fill all fields.' });
            return;
        }

        // Replace these with your actual EmailJS values
        const SERVICE_ID = 'service_3cfv2q7';
        const TEMPLATE_ID = 'template_dly4i9l';
        const USER_ID = 'SLALN4X9dMZEZ9NrD';

        emailjs
            .send(SERVICE_ID, TEMPLATE_ID, formData, USER_ID)
            .then(() => {
                setStatus({ type: 'success', message: 'Message sent successfully!' });
                setFormData({ name: '', email: '', message: '' });
            })
            .catch(() => {
                setStatus({ type: 'error', message: 'Failed to send. Try again later.' });
            });

    };
    return (
        <>
            <div className='container-fluid app-container'>
                <nav className="navbar navme navbar-expand-lg">
                    <div className="container-fluid">
                        <Link className="navbar-brand nav-color" to='/'><FontAwesomeIcon icon={faHouse} /><span className='ps-2 fw-bold'>Campus Nest</span></Link>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                <li className="nav-item">
                                    <a className="nav-link" aria-current="page" href="#">About</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" aria-current="page" href="#">Team</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" aria-current="page" href="#">Contact</a>
                                </li>
                            </ul>
                            <form className="d-flex" role="search">
                                <Link className="btn btn-me btn-outline-secondary me-3 fw-bold" to='/signup'>Sign up</Link>
                                <Link className="btn btn-me btn-outline-secondary fw-bold" to='/login'>Sign in</Link>
                            </form>
                        </div>
                    </div>
                </nav>
                <section className="hero">
                    <div className="container-fluid">
                        <div className="row align-items-center pt-4">
                            <div className="col-md-7 text-center text-md-start">
                                <h1 className='fw-bold'>Find Your Perfect Student Home</h1>
                                <p className="lead">Browse verified listings around your campus</p>
                            </div>
                            <div className="col-md-5 text-center">
                                <img src={home} alt="Hero house illustration" className="w-100" />
                            </div>
                        </div>
                    </div>
                </section>
                <div className="container-fluid py-3">
                    <h1 className="mb-4 fw-bold">About</h1>
                    <p className="lead">
                        Campus Nest is a student-first housing platform built to make finding off-campus rentals simple, safe, and stress-free.
                        Whether you're new to the city or just looking for a better place to stay, we've got your back.
                    </p>

                    <div className="row my-5">
                        <div className="col-md-6">
                            <h3 className="fw-semibold">What We Do</h3>
                            <ul className="list-group list-group-flush border-none">
                                <li className="list-group-item">Connect students with verified local landlords</li>
                                <li className="list-group-item">Offer detailed listings with photos, amenities, and rent details</li>
                                <li className="list-group-item">Enable map-based searching for proximity to campus</li>
                                <li className="list-group-item">Provide reviews from real students</li>
                            </ul>
                        </div>
                        <div className="col-md-6">
                            <h3 className="fw-semibold">Why Choose Us?</h3>
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item">Curated listings just for students</li>
                                <li className="list-group-item">No hidden fees or scams — verified content</li>
                                <li className="list-group-item">Friendly support team that understands student life</li>
                                <li className="list-group-item">Designed for comfort, safety, and convenience</li>
                            </ul>
                        </div>
                    </div>

                    <div className="card primary-bg text-white shadow-lg p-4 rounded">
                        <h4 className="fw-bold">Our Mission</h4>
                        <p>
                            To make student housing more accessible, transparent, and community-driven — one nest at a time.
                        </p>
                    </div>
                </div>
                {/* Team Section */}
                <section className="container-fluid my-5">
                    <h2 className="mb-4 fw-bold">Meet the Team</h2>
                    <div id="teamCarousel" className="carousel slide" data-bs-ride="carousel">
                        <div className="carousel-inner">
                            {['Alice', 'Bob', 'Charlie'].map((name, index) => (
                                <div
                                    className={`carousel-item ${index === 0 ? 'active' : ''}`}
                                    key={index}
                                >
                                    <div className="d-flex justify-content-center">
                                        <div className="card text-center" style={{ width: '20rem',backgroundColor: '#244a71',color: 'white', }} >
                                            <img
                                                src={`https://www.svgrepo.com/show/192244/man-user.svg`}
                                                className="card-img-top rounded-circle mx-auto mt-3"
                                                alt={name}
                                                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                            />
                                            <div className="card-body">
                                                <h5 className="card-title">{name}</h5>
                                                <p className="card-text">Frontend Developer</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Carousel controls */}
                        <button className="carousel-control-prev" type="button" data-bs-target="#teamCarousel" data-bs-slide="prev">
                            <span className="carousel-control-prev-icon"></span>
                        </button>
                        <button className="carousel-control-next" type="button" data-bs-target="#teamCarousel" data-bs-slide="next">
                            <span className="carousel-control-next-icon"></span>
                        </button>
                    </div>
                </section>

                {/* Reviews Section */}
                <section className="my-5">
                    <h2 className="mb-4 fw-bold">What Users Are Saying</h2>
                    <div id="reviewCarousel" className="carousel slide" data-bs-ride="carousel">
                        <div className="carousel-inner">
                            {[
                                {
                                    user: 'Jane Doe',
                                    text: 'CampusNest helped me find a roommate in 2 days!',
                                },
                                {
                                    user: 'Mark Smith',
                                    text: 'Super clean UI and very responsive team.',
                                },
                                {
                                    user: 'Nina Patel',
                                    text: 'Loved the listing filtering options.',
                                },
                            ].map((review, index) => (
                                <div
                                    className={`carousel-item ${index === 0 ? 'active' : ''}`}
                                    key={index}
                                >
                                    <div className="d-flex justify-content-center" >
                                        <div className="card w-75 text-center " style={{ backgroundColor: '#244a71',color: 'white' }}>
                                            <div className="card-body">
                                                <p className="card-text">"{review.text}"</p>
                                                <h6 className="card-subtitle  mt-3">— {review.user}</h6>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Carousel controls */}
                        <button className="carousel-control-prev" type="button" data-bs-target="#reviewCarousel" data-bs-slide="prev">
                            <span className="carousel-control-prev-icon"></span>
                        </button>
                        <button className="carousel-control-next" type="button" data-bs-target="#reviewCarousel" data-bs-slide="next">
                            <span className="carousel-control-next-icon"></span>
                        </button>
                    </div>
                </section>
                <section className="py-3">
                    <h2 className="mb-4 fw-bold">Contact Us</h2>
                    <div className="row justify-content-center">
                        <div className="col-md-5">
                            {status.message && (
                                <div
                                    className={`alert ${status.type === 'success' ? 'alert-success' : 'alert-danger'
                                        }`}
                                >
                                    {status.message}
                                </div>
                            )}
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">Your Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter your name"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email address</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="name@example.com"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="message" className="form-label">Message</label>
                                    <textarea
                                        className="form-control"
                                        id="message"
                                        name="message"
                                        rows="4"
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="Write your message here..."
                                    ></textarea>
                                </div>
                                <button type="submit" className="btn" style={{ backgroundColor: '#244a71',color: 'white' }}>
                                    Send Message
                                </button>
                            </form>
                        </div>
                    </div>
                </section>
            </div>
            <footer className="footer text-white py-4" style={{ backgroundColor: '#244a71', }}>
                <div className="container text-center">
                    <div className="mb-3">
                        <a href="https://facebook.com" className="text-white me-3">
                            <FontAwesomeIcon icon={faFacebook} size="lg" />
                        </a>
                        <a href="https://twitter.com" className="text-white me-3">
                            <FontAwesomeIcon icon={faXTwitter} size="lg" />
                        </a>
                        <a href="https://instagram.com" className="text-white me-3">
                            <FontAwesomeIcon icon={faInstagram} size="lg" />
                        </a>
                        <a href="https://linkedin.com" className="text-white">
                            <FontAwesomeIcon icon={faLinkedin} size="lg" />
                        </a>
                    </div>
                    <p className="mb-0">&copy; {new Date().getFullYear()} CampusNest. All rights reserved.</p>
                </div>
            </footer>

        </>
    )
}

export default Home;