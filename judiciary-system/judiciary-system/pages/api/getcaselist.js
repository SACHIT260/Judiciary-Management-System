const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
export default async (req, res) => {
    if (req.method !== "POST") {
        res.status(405).json({ flag: false, message: "Invalid method" });
    }
    try {
        const { id } = req.body;
        console.log(id);
        let caseList = [];
        if (id == -1) {
            caseList = await prisma.caseDetails.findMany({
                include: {
                    case: true
                }
            });
        }
        else {
            caseList = await prisma.caseDetails.findMany({
                where: {
                    userID: id
                },
                include: {
                    case: true
                }
            });
        }
        console.log(caseList);
        res.json({ flag: false, message: caseList });
    } catch (error) {
        console.log(error);
        res.status(500).json({ flag: false, message: "Something went wrong!" });
    }
};
