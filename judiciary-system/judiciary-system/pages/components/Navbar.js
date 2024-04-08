import { useEffect, useState } from "react";
import styles from "../styles/Navbar.module.css";
import CaseForm from "./CaseForm";
import { useRouter } from 'next/router'; // Import useRouter from Next.js

export const Navbar = () => {
    const router = useRouter(); // Access router instance
    const [userDate, setUserDate] = useState(null);
    useEffect(() => {
        // Check if window is defined to avoid SSR issues
        if (typeof window !== 'undefined') {
            setUserDate(JSON.parse(localStorage.getItem('userData')));
        }
    }, []); // Empty dependency array ensures the effect runs only once on component mount

    const handleRegisterClick = () => {
        router.push('/components/Register'); // Navigate to Register page
    };

    const handleLoginClick = () => {
        router.push('/components/Login'); // Navigate to Login page
    };

    const handleCaseForm = () => {
        router.push('/components/CaseForm');
    }
    const handleLogout = () => {
        localStorage.removeItem('userData');
        window.location.href = '/';
    }
    const handleCaseList = () => {
        router.push('/components/CaseLists');
    }
    // handleCaseList
    return (
        <>
            <div className="container">
                <nav>
                    <ul className={styles.ul}>
                        <span className={styles.li}>Home</span>
                        <span className={styles.li} onClick={handleRegisterClick}>Register</span>
                        {
                            userDate && (
                                <span className={styles.li} onClick={handleLogout}>Logout</span>
                            )
                        }
                        {
                            !userDate && (
                                <span className={styles.li} onClick={handleLoginClick}>Login</span>
                            )
                        }

                        {
                            (userDate && (userDate.role !== 'ADMINISTRATOR' || userDate.role !== 'JUDGE' || userDate.role !== 'LAWYER' || userDate.role !== 'COURT_INTERPRETOR')) && (
                                <span className={styles.li} onClick={handleCaseForm}>Case Form</span>
                            )
                        }
                        <span className={styles.li} onClick={handleCaseList}>See CaseLists</span>
                    </ul>
                </nav>
            </div>
        </>
    );
};

export default Navbar;
