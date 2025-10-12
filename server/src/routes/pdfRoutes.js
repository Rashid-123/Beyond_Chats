
import express from "express";
import { userAuth} from "../middleware/authMiddleware.js"
import { uploadPDF, getUserPDFs, upload } from "../controllers/pdfController.js";

const router = express.Router();

// Upload one or multiple PDFs
router.post("/upload", userAuth, upload.array("pdfs", 5), uploadPDF);


// Get all uploaded PDFs for a user
router.get("/my-pdfs", userAuth, getUserPDFs);

export default router;
