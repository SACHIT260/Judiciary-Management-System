import React from 'react';
import styles from './styles/Hom.module.css'

export const Home = () => {
    return <>
        <div className={styles.head}>
            <h1 style={{color:'#FDA7DF'}}>Welcome to the Judiciary Management System</h1>
        </div>
        <div className={styles.pa} style={{color:'#c8d6e5'}}>
            <p style={{width:'60dvw',height:'10dvh',margin:'auto',textAlign:'center'}}>
                This system provides a comprehensive platform for managing various aspects of the judiciary process.
                It facilitates tasks such as case registration, scheduling the case, assigning case to judge, and more.
            </p>
        </div>
        <div className={styles.box}>
            <h2 style={{color:'#ee5253'}}>Key Features:</h2>
            <ul style={{color:'#c8d6e5'}}>
                <li>Case Registrationt: Register the  cases efficiently from initiation to resolution.</li>
                <li>Scheduling: The schedule of the case is assigned.</li>
                <li>Assigning case to Judge: Judge is assigned to a particular case.</li>
            </ul>
        </div>
    </>
}