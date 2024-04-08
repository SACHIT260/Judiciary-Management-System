import React, { useState, useEffect } from "react";
import moment from "moment-timezone";
import Styles from "../../styles/selectStyles";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import toast from "react-hot-toast";
import axios from "axios";
import { style } from '@mui/system';

const useSyles = makeStyles(Styles);
const MentorSlots = ({ slots, setSelectedSlot, selectedSlot, setMockDate, curDay, selectedSlotData, setslotDay }) => {
  // const [slotDay, setslotDay] = useState(null);

  // ******************************************************************
  // The api for updation of slots when the time gets passed is present in the home page (index.js)
  // /api/updateSlots in index.js also in user-dashboard .............
  // Can also do by server.js by nodecron
  // *********************************************************************************
  const classes = useSyles();
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  function getWeekDay() {


    switch (slots[0].dayno % 7) {
      case 0:
        return "Sun";
      case 1:
        return "Mon";
      case 2:
        return "Tue";
      case 3:
        return "Wed";
      case 4:
        return "Thu";
      case 5:
        return "Fri";
      case 6:
        return "Sat";
      default:
        return "Inactive";
    }
  }
  const setslotD = (data) => {
    const slotD = moment()
      .weekday(data.dayno <= curDay ? data.dayno + 7 : data.dayno)
      .format("Do MMM YYYY");
    setslotDay(slotD);
  }
  return (
    <div className={classes.columnMain}>
      <Typography className={classes.Day} variant="subtitle1">
        {getWeekDay()}
      </Typography>
      <Typography className={classes.Date} variant="body2">
        {
          slots[0].dayno < 7 ?
            moment()
              .weekday(
                slots[0].dayno <= curDay ? slots[0].dayno + 7 : slots[0].dayno
              )
              .format("Do MMM YYYY")
            :
            moment()
              .add(1, "week")
              .day(slots[0].dayno - 7)
              .format("Do MMM YYYY")
        }
      </Typography>
      <div className={classes.slotTimeBtnContainer}>
        {slots.map((eachSlot) =>
          eachSlot.status === 0 ? (
            <button
              className={classes.inactiveSlotTimes}
              onClick={(e) => {
                e.preventDefault();
                toast.error("Slot is currently unavailable");
              }}
            >
              {eachSlot.SlotTime}
            </button>
          ) : (
            <button
              className={`${classes.slotTimes} ${selectedSlot === eachSlot.id && classes.activeSlot
                }`}
              onClick={async (e) => {
                e.preventDefault();
                setslotD(eachSlot);
                setSelectedSlot(eachSlot.id);
                selectedSlotData(eachSlot);
              }}
            >
              {eachSlot.SlotTime}
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default MentorSlots;
