import React, { useState, useEffect } from "react";
import SelectSlots from './JudgeSlots/SelectSlots'
import Dialog from "@mui/material/Dialog"
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import TextField from '@mui/material/TextField';
import toast from "react-hot-toast";
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

import axios from "axios";
const Slot = ({ caseId }) => {
    const [openSelectSlot, setOpenSelectSlot] = useState(false);
    const [slotOpen, setslotOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [selectedSlotData, setSelectedSlotData] = useState(null);
    const [slotDay, setslotDay] = useState(null);
    const [isVisible, setIsVisible] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectDialogue, setSelectDialogOpen] = useState(true);
    const [id, setId] = useState(null);
    const [judgeList, setJudgeList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [roomno, setRoomno] = useState(1);
    const handleChange = (e) => {
        setId(e.target.value);
    };
    const toggleVisibility = () => {
        setIsVisible(!isVisible);
    };
    const handleClose = () => {
        setOpenSelectSlot(false);
        toggleVisibility();
    };
    useEffect(async () => {
        const allJudges = await axios.post('/api/getJudges');
        console.log("judges", allJudges.data.message);
        setJudgeList(allJudges.data.message);
    }, [])

    const handleInputChange = (e) => {
        setRoomno(e.target.value);
    }
    const handleScheduleEvent = async () => {
        if (id == null) {
            alert("Enter id and caseId");
            return;
        }
        try {
            const res = await axios.post("/api/auto-schedule-case", {
                data: selectedSlotData,
                day: slotDay,
                judgeID: parseInt(id),
                caseId: parseInt(caseId),
                roomno: roomno
            }).then((res) => {
                console.log(res);
                alert("Appointment Confirmed");
                window.location.href = '/components/CaseLists'
            })
        } catch (err) {
            console.log(err);
            alert("Error Found");
        }
    }
    console.log(selectedSlotData);
    return (
        <>
            <div style={{ height: '20dvh', width: '30dvw', margin: 'auto' }}>
                <Dialog open={selectDialogue} onClose={() => setSelectDialogOpen(false)}>
                    <Button style={{ fontSize: '20px', color: '#2d3436' }}>Enter Judge ID to Appoint this case of ID {caseId}</Button>
                    <Select
                        id="id"
                        label="Judge ID"
                        value={id}
                        onChange={handleChange}
                        fullWidth
                        style={{ marginBottom: '20px', background: '#c8d6e5', width: '25vw', margin: 'auto' }}
                    >
                        {judgeList.map(judge => (
                            <MenuItem key={judge.id} value={judge.id}>
                                {judge.name}
                            </MenuItem>
                        ))}
                    </Select>
                    <br /><br />
                    <Button style={{ fontSize: '20px', color: '#2d3436' }}>Enter Room No for case of ID {caseId}</Button>
                    <TextField
                        style={{ marginBottom: '20px', background: '#c8d6e5', width: '25vw', margin: 'auto' }}
                        type="number"
                        value={roomno}
                        onChange={handleInputChange}
                        variant="outlined"
                    />
                    <DialogActions>
                        <Button style={{ background: '#1dd1a1', color: 'black' }} onClick={() => {
                            setSelectDialogOpen(false);
                            setDialogOpen(true)
                        }}>Open Slots</Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                    <SelectSlots
                        setslotDay={setslotDay}
                        setSelectedSlot={setSelectedSlot}
                        selectedSlot={selectedSlot}
                        selectedSlotData={setSelectedSlotData}
                        judgeID={parseInt(id)}
                    />
                    <Button onClick={() => handleScheduleEvent()}>Schedule</Button>
                </Dialog>
            </div>
        </>
    )
}

export default Slot;