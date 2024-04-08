import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css'

function HomePage() {
    return (
        <main className="home-content">
            <section className="auth-actions">
                <h2>Get Started Today</h2>
                <p>Join us and experience the best rideshare service.</p>
                <div className="auth-buttons">
                    <Link to="/register" className="button button-primary">Sign Up</Link>
                    <Link to="/login" className="button button-secondary">Log In</Link>
                </div>
            </section>
        </main>
    );
}

export default HomePage;
