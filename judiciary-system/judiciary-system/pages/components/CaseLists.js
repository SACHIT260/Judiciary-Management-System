import React, { useEffect, useState } from 'react'
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, Button } from '@mui/material';
import { makeStyles } from '@mui/styles';
import axios from 'axios';
import Slot from './Slot';
import Checkbox from '@mui/material/Checkbox';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
const useStyles = makeStyles((theme) => ({
    table: {
        minWidth: 650,
    },
    assignButton: {
        //   marginTop: theme.spacing(2),
    },
    header: {
        margin: 'auto',
        fontWeight: 800,
        fontFamily: 'monospace',
        textAlign: 'center',
        fontSize: '5rem',
    },
}));
const CaseLists = () => {
    const [data, setData] = useState([]);
    const [caseId, setCaseId] = useState(null);
    const [showSlot, setShowSlot] = useState(false);
    const classes = useStyles();
    const [favorStates, setFavorStates] = useState({});
    const getAllLists = async () => {
        const userData = JSON.parse(localStorage.getItem('userData'));
        setUserDate(userData);
        console.log("userData of siabsis", userData);
        (async () => {
            let userID = -1;
            try {
                if (userData && (userData.role != 'ADMINISTRATOR' && userData.role != 'JUDGE' && userData.role != 'COURT_INTERPRETOR')) {
                    userID = userData.id;
                }
                const caseLists = await axios.post('/api/getcaselist', {
                    id: userID
                });
                console.log(caseLists);
                setData(caseLists?.data?.message);
            }
            catch (err) {
                console.log(err);
            }
        })();
    }
    useEffect(() => {
        getAllLists();
    }, []);
    const handleChange = (id) => {
        setFavorStates(prevStates => ({
            ...prevStates,
            [id]: !prevStates[id]
        }));
    };
    function convertISOToLocalDateTime(isoString) {
        const date = new Date(isoString);
        return date.toLocaleString();
    }
    const [userDate, setUserDate] = useState({});
    const handleHearCase = async (id) => {
        console.log(favorStates);
        const value = favorStates[id] || false;;
        const hearcase = await axios.post('/api/hear-case', {
            id: id,
            value: value
        }).then((res) => {
            alert('Result Updated');
            getAllLists();
        }).catch((err) => {
            alert('Server Error');
        })
    }
    const handleAssignJudge = (id) => {
        setCaseId(id);
        setShowSlot(true);
    }
    return (
        <>
            <div style={{ height: '300vh', width: '100vw', background: '#222f3e' }}>
                <h1 style={{ margin: 'auto', fontWeight: 800, fontFamily: 'monospace', textAlign: 'center', fontSize: '5rem', color: '#00b894' }}>{userDate.role == 'ADMINISTRATOR' ? "Total Case Lists" : "Your submitted cases"}</h1>
                <br />
                <br />
                <br />
                <TableContainer component={Paper} style={{ width: '90dvw', margin: 'auto' }}>
                    <Table className={classes.table} aria-label="case table" style={{ background: '#b2bec3' }}>
                        <TableHead style={{ background: '', marginBottom: '10px' }}>
                            <TableRow>
                                <TableCell>caseID</TableCell>
                                <TableCell>Document ID</TableCell>
                                <TableCell>Case Owner</TableCell>
                                <TableCell>Assigned Room</TableCell>
                                <TableCell>Assigned Judge (ID)</TableCell>
                                <TableCell>Assigned Date</TableCell>
                                {
                                    (userDate.role == 'ADMINISTRATOR' || userDate.role != 'COURT_INTERPRETOR') && (
                                        <TableCell>Assign Judge</TableCell>
                                    )
                                }
                                <TableCell></TableCell>
                                {
                                    userDate.role == 'JUDGE' && (
                                        <TableCell>Hear Case Result</TableCell>
                                    )
                                }
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell>{row.id}</TableCell>
                                    <TableCell>{row.documentId}</TableCell>
                                    <TableCell>{row.case.name}</TableCell>
                                    <TableCell>{row.assignedRoom == null ? `Room Not assigned` : `${row.assignedRoom}`}</TableCell>
                                    <TableCell>{row.assignedJudge == null ? `Judge Not assigned` : `id : ${row.assignedJudge}`}</TableCell>
                                    <TableCell>{row.assignedDate == null ? `Date not assigned` : `${convertISOToLocalDateTime(row.assignedDate)} - GMT`}</TableCell>
                                    <TableCell>
                                        {(userDate.role === 'ADMINISTRATOR' || userDate.role === 'COURT_INTERPRETOR') && row.assignedDate == null ? (
                                            <Button style={{ background: '#5f27cd', color: 'white' }} onClick={() => handleAssignJudge(row.id)}>Assign Judge</Button>
                                        ) : <Button style={{ background: '#192a56', color: 'white' }}>{`${row.assignedDate == null ? `Not Assigned` : `Assigned`}`}</Button>}
                                    </TableCell>
                                    <TableCell>
                                        {userDate.role === 'JUDGE' && row.caseResult == null ? (
                                            <div>
                                                <Button onClick={() => handleChange(row.id)}>
                                                    <Checkbox
                                                        checked={favorStates[row.id] || false}
                                                        icon={<ThumbDownIcon />}
                                                        checkedIcon={<ThumbUpIcon />}
                                                        color="primary"
                                                        inputProps={{ 'aria-label': 'checkbox with thumb icons' }}
                                                    />
                                                </Button>
                                                <span>{favorStates[row.id] ? "In favor of the accuser" : "Not in favor of the accuser"}</span>
                                            </div>
                                        ) : (
                                            userDate.role === 'JUDGE' && (
                                                <Button style={{ background: `${row.caseResult ? '#44bd32' : '#e84118'}`, color: 'white' }}>{
                                                    row.caseResult == true ? `Result is in favour of accuser` : `Result is in against of accuser`}</Button>
                                            )

                                        )}
                                        {userDate.role === 'JUDGE' && row.caseResult == null ? (
                                            <Button style={{ background: '#00b894', color: 'black' }} onClick={() => handleHearCase(row.id)}>Submit</Button>
                                        ) : (
                                            <Button></Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                {
                    showSlot == true && (
                        <Slot caseId={caseId} />
                    )
                }
            </div>
        </>
    )
}

export default CaseLists