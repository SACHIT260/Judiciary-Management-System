const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
import { v4 as uuidv4 } from 'uuid';
export default async (req, res) => {
    if (req.method !== "POST") {
        res.status(405).json({ flag: false, message: "Invalid method" });
    }
    try {
        const docId = uuidv4();
        const { caseTitle, userId } = req.body;
        const createCase = await prisma.caseDetails.create({
            data: {
                caseTitle: caseTitle,
                userID: userId,
                documentId: docId
            }
        })
        res.status(201).json({ flag: true, message: "Succesfully Uploaded" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ flag: false, message: "Something went wrong!" });
    }
};
