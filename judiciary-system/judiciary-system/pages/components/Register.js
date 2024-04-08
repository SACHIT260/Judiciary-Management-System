import React, { useState } from 'react';
import axios from 'axios';
import styles from '../styles/Register.module.css';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        mobile: '',
        role: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/register', formData);
            alert(response.data.message);
            window.location.href = '/components/Login'
        } catch (error) {
            console.error('Registration failed:', error.response.data);
            alert(response.data.message);
        }
    };

    return (
        <div style={{ margin: 'auto',height:'100dvh',width:'100dvw',background:'#1e272e',paddingTop:'10dvh' }}>
            <form className={styles.main} onSubmit={handleSubmit}>
            <h2 style={{ margin: 'auto', textAlign: 'auto' }}>Register</h2>
            <br/><br/>
                <div>
                    <label className={styles.label}>Name:</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required className={styles.input} />
                </div>
                <div>
                    <label className={styles.label}>Email:</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required className={styles.input} />
                </div>
                <div>
                    <label className={styles.label}>Password:</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required className={styles.input} />
                </div>
                <div>
                    <label className={styles.label}>Mobile:</label>
                    <input type="text" name="mobile" value={formData.mobile} onChange={handleChange} required className={styles.input} />
                </div>
                <div>
                    <label className={styles.label}>Role:</label>
                    <select name="role" value={formData.role} onChange={handleChange} required className={styles.select}>
                        <option value="">Select Role</option>
                        <option value="USER">User</option>
                        <option value="JUDGE">Judge</option>
                        <option value="LAWYER">Lawyer</option>
                        <option value="COURT_INTERPRETOR">Court Interpreter</option>
                        <option value="ACCUSER">Accuser</option>
                        <option value="ACCUSED">Accused</option>
                        <option value="ADMINISTRATOR">Administrator</option>
                    </select>
                </div>
                <button type="submit" className={styles.button} style={{marginRight:'1rem'}}>Register</button>
                <button type="submit" onClick={() => {
                    window.location.href = '/components/Login'
                }} className={styles.button}>Login</button>
            </form>
        </div>
    );
};

export default Register;
