const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
import moment from "moment-timezone";
export default async (req, res) => {
    if (req.method !== "GET") {
        res.status(405).json({ flag: false, message: "Invalid method" });
    }
    const { timezone, judgeID } = req.query;
    console.log(req.query);
    try {
        const client_CurrentDay = moment().tz(timezone).day();

        // below fetching slots are for all mentors but we can do the cond^n for particular mentor if needed.
        let availableSlots = [];
        availableSlots = await prisma.judgeAvailability.findMany({
            where: {
                judgeID: parseInt(judgeID)
            }
        })

        const datas = [];
        const dayseq = [];
        const uniqueDaynosSet = new Set();
        availableSlots.forEach(item => uniqueDaynosSet.add(item.dayno));
        const uniqueDaynosArray = Array.from(uniqueDaynosSet);
        uniqueDaynosArray.sort((a, b) => a - b);
        const uniqueDaynoTimeSlotsMap = new Map();
        let counter = 1; 
        availableSlots.forEach(item => {
            const key = `${item.dayno}_${item.SlotTime}`;
            if (!uniqueDaynoTimeSlotsMap.has(key)) {
                uniqueDaynoTimeSlotsMap.set(key, {
                    id: counter++, // Generate a unique ID
                    dayno: item.dayno,
                    SlotTime: item.SlotTime,
                    status: item.WeeklyEngagement.Week1 === false ? 1 : 0,
                });
            } else {
                if (item.WeeklyEngagement.Week1 == false) {
                    uniqueDaynoTimeSlotsMap.get(key).status = 1;
                }
            }
        });
        const uniqueDaynoTimeSlotsArray = Array.from(uniqueDaynoTimeSlotsMap.values());
        // console.log("uniqueDaynoTimeSlotsArray", uniqueDaynoTimeSlotsArray);
        // for next week

        const uniqueDaynosSet2 = new Set();
        availableSlots.forEach(item => uniqueDaynosSet2.add(item.dayno));
        const uniqueDaynosArray2 = Array.from(uniqueDaynosSet2);
        const uniqueDaynoTimeSlotsMap2 = new Map();
        uniqueDaynosArray2.sort((a, b) => a - b);
        let ide = uniqueDaynoTimeSlotsArray.length; // Counter variable to generate unique IDs
        // Loop through the data array and group by dayno and timeSlot
        availableSlots.forEach(item => {
            const key = `${item.dayno}_${item.SlotTime}`;
            if (!uniqueDaynoTimeSlotsMap2.has(key)) {
                uniqueDaynoTimeSlotsMap2.set(key, {
                    id: ++ide, // Generate a unique ID
                    dayno: item.dayno,
                    SlotTime: item.SlotTime,
                    status: item.WeeklyEngagement.Week2 === false ? 1 : 0,
                });
            } else {
                if (item.WeeklyEngagement.Week2 == false) {
                    uniqueDaynoTimeSlotsMap2.get(key).status = 1;
                }
            }
        });
        const uniqueDaynoTimeSlotsArray2 = Array.from(uniqueDaynoTimeSlotsMap2.values());
        // console.log("uniqueDaynoTimeSlotsArray", uniqueDaynoTimeSlotsArray2);
        const concatenatedArray = uniqueDaynoTimeSlotsArray2.map((item, index) => ({
            ...item,
            dayno: item.dayno <= client_CurrentDay ? item.dayno + 14 : item.dayno + 7
        }));
        // console.log("concatenatedArray", concatenatedArray);
        const finalArray = uniqueDaynoTimeSlotsArray.concat(concatenatedArray);

        for (const slot of uniqueDaynosArray) {
            if (slot > client_CurrentDay) {
                dayseq.push(slot);
            }
        }

        for (const slot of uniqueDaynosArray) {
            if (slot <= client_CurrentDay) {
                dayseq.push(slot);
            }
        }

        for (const slot of uniqueDaynosArray2) {
            if (slot > client_CurrentDay) {
                dayseq.push(slot + 7);
            }
        }

        for (const slot of uniqueDaynosArray2) {
            if (slot <= client_CurrentDay) {
                dayseq.push(slot + 14);
            }
        }
        console.log(finalArray);
        res.status(201).json({ flag: true, data: finalArray, dayseq, curDay: client_CurrentDay });
    } catch (error) {
        console.log(error);
        res.status(500).json({ flag: false, message: "Something went wrong!" });
    }
};
