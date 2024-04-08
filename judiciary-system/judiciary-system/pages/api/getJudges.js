const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
export default async (req, res) => {
    if (req.method !== "POST") {
        res.status(405).json({ flag: false, message: "Invalid method" });
    }
    try {
        const { id } = req.body;
        console.log(id);
        let judgesList = [];
        judgesList = await prisma.user.findMany({
            where: {
                role: 'JUDGE'
            }
        });
        console.log(judgesList);
        res.json({ flag: true, message: judgesList });
    } catch (error) {
        console.log(error);
        res.status(500).json({ flag: false, message: "Something went wrong!" });
    }
};
