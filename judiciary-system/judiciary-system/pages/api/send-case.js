import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';
const Random=uuidv4();
// Define storage settings for Multer
const storage = multer.diskStorage({
    destination: './uploads',
    filename: (req, file, callback) => {
        // Generate a unique filename using UUID with the .pdf extension
        const filename = `${Random}.pdf`;
        callback(null, filename);
    },
});

// Initialize Multer with the defined storage settings
const upload = multer({
    storage: storage,
    fileFilter: (req, file, callback) => {
        // Check file type to ensure only PDF files are allowed
        const extname = path.extname(file.originalname).toLowerCase();
        if (extname !== '.pdf') {
            return callback(new Error('Only PDF files are allowed'));
        }
        callback(null, true);
    },
}).single('document'); // Use .single() to handle single file uploads

// Define the API route handler
const handler = async (req, res) => {
    try {
        // Use the Multer middleware to handle file uploads
        upload(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                // Multer error handling
                console.error(err);
                return res.status(500).json({ error: 'File upload failed' });
            } else if (err) {
                // Other errors
                console.error(err);
                return res.status(500).json({ error: 'Server error' });
            }
            // File upload successful
            const filename = req.file.filename;
            return res.status(200).json({ filename });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
};

export default handler;
