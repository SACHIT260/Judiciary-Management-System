import React, { useState, useEffect } from 'react';
import { Button, TextField } from '@mui/material';
import { makeStyles } from '@mui/styles';
import axios from 'axios';
import styles from '../styles/caseform.module.css'
const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            width: '25ch',
        },
    },
}));

const CaseForm = () => {
    const classes = useStyles();
    const [caseTitle, setCaseTitle] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState('');
    const [userDate, setUserDate] = useState(null);
    useEffect(() => {
        // Check if window is defined to avoid SSR issues
        if (typeof window !== 'undefined') {
            setUserDate(JSON.parse(localStorage.getItem('userData')));
        }
    }, []);

    const handleTitleChange = (event) => {
        setCaseTitle(event.target.value);
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        console.log(file);
        if (file) {
            if (file.type === 'application/pdf') {
                setSelectedFile(file);
                setError('');
            } else {
                setSelectedFile(null);
                setError('Please select a PDF file.');
            }
        }
        // console.log(selectedFile);
        // console.log(selectedFile);
    };

    const handleSubmit = async (event) => {
        console.log(selectedFile);
        event.preventDefault();
        if (!selectedFile) {
            setError('Please select a file.');
            return;
        }
        console.log(selectedFile);
        const formData = new FormData();
        if (selectedFile) {
            formData.append('document', selectedFile);
        }
        formData.append('caseTitle', caseTitle);
        try {
            // const response = await axios.post('/api/send-case', formData, {
            //     headers: {
            //         'Content-Type': 'multipart/form-data',
            //     },
            // });
            const response = await axios.post('/api/postcase', {
                caseTitle: caseTitle,
                userId: userDate.id
            });
            alert(response.data.message);
            setCaseTitle('');
            setSelectedFile(null);
        } catch (error) {
            console.error('Error:', error);
            setError('Failed to submit the form.');
        }
    };

    return (
        <>
            <div className={styles.maincase} style={{ height: '60vh', width: '60vw', background: '#fab1a0' }}>
                <form className={classes.root} onSubmit={handleSubmit} encType="multipart/form-data">
                    <div>
                        <TextField
                            label="Case Title"
                            value={caseTitle}
                            onChange={handleTitleChange}
                            required
                            background='white'
                        />
                    </div>
                    <div>
                        <input
                            type="file"
                            id="fileInput"
                            accept=".pdf"
                            onChange={handleFileChange}
                            required
                        />
                        <label htmlFor="fileInput">
                            <Button variant="contained" component="span">
                                Upload Document (PDF only)
                            </Button>
                        </label>
                        <div style={{ color: 'red' }}>{error}</div>
                    </div>
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <div>
                        <Button type="submit" variant="contained" color="primary">
                            Submit
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default CaseForm;
