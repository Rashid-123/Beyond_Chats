import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { uploadPDF, getUserPDFs, upload } from "../controllers/pdfController.js";

const router = express.Router();

// Upload one or multiple PDFs
router.post("/upload", authMiddleware, upload.array("pdfs", 5), uploadPDF);

// Get all uploaded PDFs for a user
router.get("/my-pdfs", authMiddleware, getUserPDFs);

export default router;
