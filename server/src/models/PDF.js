

import mongoose from "mongoose";

const pdfSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  
  fileName: { type: String, required: true },
  s3Url: { type: String, required: true },
  fileSize: Number,
  fileType: { type: String, default: "application/pdf" },
  
  pages: [{
    pageNumber: { type: Number, required: true },
    text: { type: String, default: "" }
  }],
  
  pageCount: Number,
  status: { type: String, default: "processing" }, // processing | ready | error
  errorMessage: String,
  
  isEmbedded: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const PDF = mongoose.model("PDF", pdfSchema);
export default PDF;