import React from 'react'
import Register from './components/Register';
import Login from './components/Login';
import Slot from './components/Slot';
import CaseLists from './components/CaseLists';
import CaseForm from './components/CaseForm';
import { Home } from './Home';
import { Navbar } from './components/Navbar';
const index = () => {
    return (
        <>
            <div style={{ background: '#222f3e', height: '100dvh', width: '100dvw', padding: '2rem 5rem',boxSizing:'border-box' }}>
                <div><Navbar /></div>
                <div><Home /></div>
            </div>
        </>
    )
}

export default index