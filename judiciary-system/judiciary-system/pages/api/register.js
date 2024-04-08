const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
export default async (req, res) => {
    if (req.method !== "POST") {
        res.status(405).json({ flag: false, message: "Invalid method" });
    }
    try {
        console.log(req.body);
        const { name, email, mobile, password, role } = req.body;
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.json({ flag: false, message: "User with this email already exists" });
        }
        // Create the new user
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password,
                mobile,
                role,
            },
        });

        if (newUser) res.status(201).json({ flag: true, message: "Registered Succesfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ flag: false, message: "Something went wrong!" });
    }
};
