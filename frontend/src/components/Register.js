// src/Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import './Register.css';

function Register() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('rider'); // Assuming 'rider' and 'driver' are the roles
        // States for driver-specific information
    const [make, setMake] = useState('');
    const [model, setModel] = useState('');
    const [year, setYear] = useState('');
    const [licensePlate, setLicensePlate] = useState('');
    const [driversLicenseNumber, setDriversLicenseNumber] = useState('');
    const [validUntil, setValidUntil] = useState('');
    const [available, setAvailable] = useState(false);


    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = {
            email,
            password,
            role,
            ...(role === 'driver' && {
              vehicleInfo: { make, model, year, licensePlate },
              driverLicense: { licenseNumber: driversLicenseNumber, validUntil },
              driverAvailability: available,
            }),
        };
        console.log('form data', formData)

        try {
            await axios.post(`${process.env.REACT_APP_USER_SERVICE_URL}/users/register`, formData);
            alert('Registration successful!');
            navigate('/dashboard')
        } catch (error) {
            alert('Registration failed: ' + error.response.data.message);
        }
    };

    return (
        <form className="register-form" onSubmit={handleSubmit}>
            <h2 className="register-title">Register</h2>
            <div className="register-input-container">
                <input className="register-input"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                />
            </div>
            <div>
                <input
                className="register-input"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                />
            </div>
            <div>
                <select className="register-input" value={role} onChange={(e) => setRole(e.target.value)} required>
                <option value="rider">Rider</option>
                <option value="driver">Driver</option>
                </select>
            </div>
            {role === 'driver' && (
                <>
                <div>
                    <input
                        className="register-input" 
                        type="text"
                        placeholder="Vehicle Make"
                        value={make}
                        onChange={(e) => setMake(e.target.value)} 
                        required />
                </div>
                <div>
                    <input
                        className="register-input"
                        type="text" placeholder="Vehicle Model"
                        value={model} 
                        onChange={(e) => setModel(e.target.value)}
                        required />
                </div>
                <div>
                    <input 
                        className="register-input"
                        type="number" placeholder="Vehicle Year"
                        value={year} 
                        onChange={(e) => setYear(e.target.value)} 
                        required />
                </div>
                <div>
                    <input 
                        className="register-input" 
                        type="text" placeholder="License Plate" 
                        value={licensePlate}
                        onChange={(e) => setLicensePlate(e.target.value)}
                        required />
                </div>
                <div>
                    <input 
                        className="register-input" type="text" placeholder="Driver's License Number" value={driversLicenseNumber} onChange={(e) => setDriversLicenseNumber(e.target.value)} 
                        required />
                </div>
                <div>
                    <input 
                        className="register-input" 
                        type="date" placeholder="License Valid Until" 
                        value={validUntil}
                        onChange={(e) => setValidUntil(e.target.value)} 
                        required />
                </div>
                <div>
                    <label>
                        Available for Rides
                        <input
                            className="register-checkbox" 
                            type="checkbox"
                            checked={available}
                            onChange={(e) => setAvailable(e.target.checked)}
                        />
                    </label>
                </div>
                </>
            )}
            <button className="register-submit button-primary" type="submit">Register</button>
        </form>
    );
}

export default Register;
