import React, { useState, useEffect } from "react";
import Styles from "../../styles/selectStyles";
import { makeStyles } from "@material-ui/core/styles";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import axios from "axios";
import Slot from "./Slot";
import toast from "react-hot-toast";
import { CircularProgress } from "@material-ui/core";

const useSyles = makeStyles(Styles);

const config = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
};

const SelectSlots = ({
    setMockDate,
    setSelectedSlot,
    selectedSlot,
    handleClose,
    selectedSlotData,
    setslotDay,
    judgeID
}) => {
    const classes = useSyles();
    const [slots, setSlots] = useState([]);
    const [DaySequence, setDaySequence] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tmzn, setTz] = useState("");
    useEffect(() => {
        setLoading(true);
        (async function () {
            let timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const res = await axios.get(
                `/api/auto-slot-book?timezone=${timezone}&judgeID=${judgeID}`
            );
            const { data } = res.data;
            const dayseq = res.data.dayseq;
            console.log("dayseq", dayseq);
            if (dayseq.length == 0)
                alert("No Slot Available Please Try Later");
            const curDay = res.data.curDay;
            setTz(curDay);
            setSlots(data);
            setDaySequence(dayseq);
            setLoading(false);
        })();
    }, []);
    function validateSlot() { }
    return (
        <>
            <div className={classes.main} style={{ padding: "1rem" }} >
                <div className={classes.slotsContainer}>
                    {loading ? (
                        <CircularProgress />
                    ) : (
                        <>
                            {DaySequence.map((eachDay) => (
                                <Slot
                                    setMockDate={setMockDate}
                                    setSelectedSlot={setSelectedSlot}
                                    selectedSlot={selectedSlot}
                                    slots={slots.filter(
                                        (eachSlot) => eachSlot.dayno === eachDay
                                    )}
                                    handleClose={handleClose}
                                    curDay={tmzn}
                                    selectedSlotData={selectedSlotData}
                                    setslotDay={setslotDay}
                                />
                            ))}
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default SelectSlots;
