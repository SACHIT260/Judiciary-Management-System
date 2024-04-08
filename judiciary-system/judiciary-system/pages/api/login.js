const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
export default async (req, res) => {
    if (req.method !== "POST") {
        res.status(405).json({ flag: false, message: "Invalid method" });
    }
    try {
        const { email, password } = req.body;
        console.log(req.body);
        const user = await prisma.user.findUnique({ where: { email } });
        console.log(user);
        if (!user) {
            res.json({ flag: false, message: "user not found" })
        }

        // Verify the password
        if (user.password !== password) {
            res.json({ flag: false, message: 'Incorrect password' })
        }
        res.status(201).json({ flag: true, data: user, message: "LoggedIn Succesfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ flag: false, message: "Something went wrong!" });
    }
};
