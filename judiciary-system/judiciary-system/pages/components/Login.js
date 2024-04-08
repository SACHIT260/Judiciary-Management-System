import React, { useState } from 'react';
import axios from 'axios';
import styles from '../styles/Register.module.css'
const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/login', formData);
            if (response.data.flag == true)
                localStorage.setItem('userData', JSON.stringify(response.data.data));
            alert(response.data.message);
            window.location.href = '/'
        } catch (error) {
            console.error('Registration failed:', error.response.data);
            alert(response.data.message);
        }
    };

    return (
        <div style={{ margin: 'auto', height: '100dvh', width: '100dvw', background: '#1e272e', paddingTop: '15dvh' }}>
            <form style={{ height: '40dvh', width: '30dvw' }} className={styles.main} onSubmit={handleSubmit}>
                <h2>Login</h2>
                <div>
                    <label className={styles.label}>Email:</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className={styles.input} required />
                </div>
                <br />
                <div>
                    <label className={styles.label}>Password:</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} className={styles.input} required />
                </div>
                <br />
                <button type="submit" className={styles.button} style={{ marginRight: '1rem' }}>Login</button>
                <button type="submit" onClick={() => {
                    window.location.href = '/components/Register'
                }} className={styles.button}>Register</button>
            </form>
        </div>
    );
};

export default Login;
