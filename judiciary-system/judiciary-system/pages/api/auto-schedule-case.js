const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
function getCurrentDateInFormat() {
    const currentDate = new Date();
    const day = currentDate.getDate();
    const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];
    const month = monthNames[currentDate.getMonth()];
    const year = currentDate.getFullYear();

    return `${day} ${month} ${year}`;
}
function parseDateFromString(dateString) {
    const parts = dateString.split(" ");
    const day = parseInt(parts[0]);
    const monthName = parts[1];
    const year = parseInt(parts[2]);

    const months = {
        Jan: 0,
        Feb: 1,
        Mar: 2,
        Apr: 3,
        May: 4,
        Jun: 5,
        Jul: 6,
        Aug: 7,
        Sep: 8,
        Oct: 9,
        Nov: 10,
        Dec: 11,
    };

    const month = months[monthName];
    // Create the Date object with the time zone offset set to UTC
    const utcDate = new Date(Date.UTC(year, month, day));
    return utcDate;
}

function convertToISOString(dateString, timeString) {
    try {
        if (!dateString || !timeString) {
            throw new Error("Date and time strings are required");
        }

        const months = {
            Jan: 0,
            Feb: 1,
            Mar: 2,
            Apr: 3,
            May: 4,
            Jun: 5,
            Jul: 6,
            Aug: 7,
            Sep: 8,
            Oct: 9,
            Nov: 10,
            Dec: 11,
        };

        const parts = dateString.split(" ");
        if (parts.length !== 3) {
            throw new Error("Invalid date format");
        }

        const day = parseInt(parts[0]);
        const monthName = parts[1];
        const year = new Date().getFullYear(); // Assuming current year
        const month = months[monthName];
        if (isNaN(day) || isNaN(month) || !Number.isInteger(day) || !Number.isInteger(month)) {
            throw new Error("Invalid date values");
        }

        const timeParts = timeString.split(" ");
        if (timeParts.length !== 2 || (timeParts[1] !== "am" && timeParts[1] !== "pm")) {
            throw new Error("Invalid time format");
        }

        const hour = parseInt(timeParts[0]);
        const isAM = timeParts[1] === "am";

        // Create the Date object with the time zone offset set to UTC
        const utcDate = new Date(Date.UTC(year, month, day, hour + (isAM ? 0 : 12)));

        if (isNaN(utcDate.getTime())) {
            throw new Error("Invalid date/time combination");
        }

        return utcDate.toISOString();
    } catch (err) {
        console.log(err);
        return null; // Return null or handle the error appropriately
    }
}


function isDifferenceMoreThanEightDays(date1, date2) {
    const differenceInMilliseconds = Math.abs(date1 - date2);
    const millisecondsInOneDay = 1000 * 60 * 60 * 24;
    const daysDifference = differenceInMilliseconds / millisecondsInOneDay;
    return daysDifference >= 8;
}

export default async (req, res) => {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Invalid Method" });
    }
    /////////////////// logic for auto - booking//////////////
    // --> User first choose his/her slot and ISO string is generated,dayno slot time ,ISO string 
    // will come from frontend to backend ,
    // ----> if it is from Week1 (difference
    // of 8 days from now *not 7 days becoz the slot starts from days after present day),
    // ----> then matches day no slot time and generate an array consisting of multiple data )
    // after that from that array it will find the mentor id and checks for isActive :true for that
    // mentor 
    // ---> then  arrange in such a way that if a mentor recently asigned should comes last and the 
    // mentor not assigned for long time comes first.
    // ---> then it will push that isoString to Week1 else in Week2.
    try {
        const { data, day, judgeID, caseId, roomno } = req.body;
        console.log(req.body);
        const dateString1 = getCurrentDateInFormat();
        const date1 = parseDateFromString(dateString1); //current date
        const date2 = parseDateFromString(day);
        //selected time slot
        const result = isDifferenceMoreThanEightDays(date1, date2); //difference taken for 8 days becoz the slot is starting from next day not current
        const { dayno, SlotTime } = data;
        const isoString = convertToISOString(day, SlotTime);
        console.log("isoString", isoString);
        if (result == false) {
            const records = await prisma.judgeAvailability.findMany({
                where: {
                    SlotTime,
                    dayno: dayno % 7,
                    judgeID: parseInt(judgeID)
                },
            });

            // Filter records based on the specific condition in your application code
            const filteredRecords = records.filter((record) => {
                const WeeklyEngagement = record.WeeklyEngagement || {}; // Handle null value
                return WeeklyEngagement.Week1 === false; // Your specific condition
            });
            console.log(filteredRecords);
            for (const slot of filteredRecords) {
                const updatedWeeklyEngagement = {
                    ...slot.WeeklyEngagement,
                    Week1: isoString,
                    // You can update other keys here if needed
                };

                const updatedRecord = await prisma.judgeAvailability.update({
                    where: {
                        id: slot.id,
                    },
                    data: {
                        WeeklyEngagement: updatedWeeklyEngagement,
                    },
                });

                let updateCaseDetails = await prisma.caseDetails.update({
                    where: {
                        id: caseId,
                    },
                    data: {
                        assignedDate: isoString,
                        assignedJudge: judgeID,
                        assignedRoom: roomno
                    }
                })
                console.log("makeOccupied", updatedRecord);
                break;
            }
        }

        if (result == true) {
            const records = await prisma.judgeAvailability.findMany({
                where: {
                    SlotTime,
                    dayno: dayno % 7,
                },
            });
            // Filter records based on the specific condition in your application code
            const filteredRecords = records.filter((record) => {
                const WeeklyEngagement = record.WeeklyEngagement || {}; // Handle null value
                return WeeklyEngagement.Week2 === false; // Your specific condition
            });
            for (const slot of filteredRecords) {

                const updatedWeeklyEngagement = {
                    ...slot.WeeklyEngagement,
                    Week2: isoString,
                    // You can update other keys here if needed
                };

                const updatedRecord = await prisma.judgeAvailability.update({
                    where: {
                        id: slot.id,
                    },
                    data: {
                        WeeklyEngagement: updatedWeeklyEngagement,
                    },
                });
                let updateCaseDetails = await prisma.caseDetails.update({
                    where: {
                        id: caseId,
                    },
                    data: {
                        assignedDate: isoString,
                        assignedJudge: judgeID,
                        assignedRoom: roomno
                    }
                })
                break;
            }
        }
        res.status(201).json({
            message: "Mentor booked successfully",
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server Error" });
    }
};
//
// Helper function to get the current day number (0: Sunday, 1: Monday, etc.)
