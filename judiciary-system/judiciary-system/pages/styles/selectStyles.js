import { textAlign } from "@mui/system";

const selectSlotStyles = {
  main: {
    overflow: "auto",
    width: "100%",
  },
  slotShower: {
    minWidth: "100%",
    height: "100px",
    background: "#404258",
  },
  slotsContainer: {
    width: "fit-content",
    boxSizing: "border-box",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },

  columnMain: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "150px !important",
    padding: "0 1%",
  },
  Day: {
    width: "100%",
    textAlign: "center",
    color: "#404258",
    fontWeight: "600",
  },
  Date: {
    width: "100%",
    textAlign: "center",
    color: "#A2B5BB",
  },
  slotTimeBtnContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "5px",
    width: "100%",
    margin: "10px 0",
  },
  slotTimes: {
    width: "100%",
    padding: "10px 3%",
    border: "1px solid #DDDDDD",
    borderRadius: "3px",
    background: "transparent",
    color: "#1B2430",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease-in-out",
    "&:hover": {
      background: "#50577A",
      color: "white",
    },
  },
  activeSlot: {
    background: "#1B2430",
    color: "#fff",
  },
  inactiveSlotTimes: {
    width: "100%",
    padding: "10px 3%",
    border: "1px solid #DDDDDD",
    borderRadius: "3px",
    background: "#EBEBE4 !important",
    color: "gray",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease-in-out",
  },
};

export default selectSlotStyles;
