

import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import PDF from "../models/PDF.js";
import User from "../models/User.js";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

// S3 client setup
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Multer memory storage
const storage = multer.memoryStorage();
export const upload = multer({ storage });

// ======================
// UPLOAD CONTROLLER (Simplified - Frontend sends text)
// ======================
// export const uploadPDF = async (req, res) => {
//   try {
//     const { userId } = req.auth;
//     const files = req.files;
//     const { body } = req; // Contains extractedText and pageCount for each file
   
//     if (!files || files.length === 0) {
//       return res.status(400).json({ success: false, message: "No PDF uploaded" });
//     }

//     // Find or create user
//     let user = await User.findOne({ clerkId: userId });
//     if (!user) user = await User.create({ clerkId: userId });
  
//     const uploadedPDFs = [];

//     for (const file of files) {
//       const key = `pdfs/${userId}/${Date.now()}_${file.originalname}`;

//       // Upload to S3 (private)
//       await s3.send(
//         new PutObjectCommand({
//           Bucket: process.env.AWS_BUCKET_NAME,
//           Key: key,
//           Body: file.buffer,
//           ContentType: file.mimetype,
//         })
//       );

//       // Get extracted text from frontend
//       const extractedText = body[`extractedText_${file.originalname}`] || "";
//       const pageCount = parseInt(body[`pageCount_${file.originalname}`]) || 0;

//       console.log(`File: ${file.originalname}`);
//       console.log(`Pages: ${pageCount}`);
//       console.log(`Text length: ${extractedText.length}`);

//       // Save metadata in DB
//       const pdfDoc = await PDF.create({
//         userId: user._id,
//         fileName: file.originalname,
//         s3Url: key,
//         fileSize: file.size,
//         pageCount,
//         extractedText,
//         status: "ready",
//       });

//       uploadedPDFs.push({
//         id: pdfDoc._id,
//         fileName: pdfDoc.fileName,
//         pageCount: pdfDoc.pageCount,
//         textLength: extractedText.length,
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: `${uploadedPDFs.length} PDF(s) uploaded successfully`,
//       uploadedPDFs,
//     });
//   } catch (error) {
//     console.error("Upload error:", error);
//     res.status(500).json({ 
//       success: false, 
//       message: "Upload failed", 
//       error: error.message 
//     });
//   }
// };



export const uploadPDF = async (req, res) => {
  try {
    const { userId } = req.auth;
    const files = req.files;
    const { body } = req;
    
    if (!files || files.length === 0) {
      return res.status(400).json({ success: false, message: "No PDF uploaded" });
    }

    // Find or create user
    let user = await User.findOne({ clerkId: userId });
    if (!user) user = await User.create({ clerkId: userId });
    
    const uploadedPDFs = [];

    for (const file of files) {
      const key = `pdfs/${userId}/${Date.now()}_${file.originalname}`;

      // Upload to S3 (private)
      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        })
      );

      // Get page-wise data from frontend
      const pagesData = body[`pages_${file.originalname}`];
      const pages = pagesData ? JSON.parse(pagesData) : [];
      const pageCount = parseInt(body[`pageCount_${file.originalname}`]) || pages.length;

      console.log(`File: ${file.originalname}`);
      console.log(`Pages: ${pageCount}`);
      console.log(`Page-wise entries: ${pages.length}`);

      // Save metadata in DB with page-wise text
      const pdfDoc = await PDF.create({
        userId: user._id,
        fileName: file.originalname,
        s3Url: key,
        fileSize: file.size,
        pageCount,
        pages, // Array of { pageNumber, text }
        status: "ready",
      });

      uploadedPDFs.push({
        id: pdfDoc._id,
        fileName: pdfDoc.fileName,
        pageCount: pdfDoc.pageCount,
        pagesStored: pages.length,
      });
    }

    res.status(200).json({
      success: true,
      message: `${uploadedPDFs.length} PDF(s) uploaded successfully`,
      uploadedPDFs,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      success: false,
      message: "Upload failed",
      error: error.message
    });
  }
};




// ======================
// GET ALL USER PDFS (unchanged)
// ======================
export const getUserPDFs = async (req, res) => {
  try {
    const { userId } = req.auth;

    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const pdfs = await PDF.find({ userId: user._id }).sort({ createdAt: -1 });

    const signedPDFs = await Promise.all(
      pdfs.map(async (pdf) => {
        try {
          const command = new GetObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: pdf.s3Url,
          });

          const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });

          return {
            id: pdf._id,
            fileName: pdf.fileName,
            signedUrl,
            pageCount: pdf.pageCount,
            status: pdf.status,
            createdAt: pdf.createdAt,
            textLength: pdf.extractedText?.length || 0,
          };
        } catch (err) {
          console.error("Signed URL error:", err);
          return {
            id: pdf._id,
            fileName: pdf.fileName,
            signedUrl: null,
            error: "Failed to generate URL",
          };
        }
      })
    );

    res.status(200).json({
      success: true,
      pdfs: signedPDFs,
    });
  } catch (error) {
    console.error("Get PDFs error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch PDFs", 
      error: error.message 
    });
  }
};