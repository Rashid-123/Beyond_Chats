
import express from "express";
import { ChatSession } from "../models/ChatSession.js";
import PDF from "../models/PDF.js";
import { ChatOpenAI } from "@langchain/openai";
import ytSearch from "yt-search";

const router = express.Router();

// ✅ Utility to randomly pick 2–3 pages and extract ~500 chars each
async function getRandomPdfText(pdfId) {
  const pdf = await PDF.findById(pdfId);
  if (!pdf || !pdf.pages?.length) return "";

  const pages = pdf.pages;
  const numPages = Math.min(3, pages.length);

  // Shuffle and pick random pages
  const selectedPages = pages.sort(() => 0.5 - Math.random()).slice(0, numPages);

  // Get first 500 chars per page
  const combinedText = selectedPages.map(p => p.text.slice(0, 500)).join("\n\n");
  return combinedText;
}

// ✅ Function to generate keyword suggestions using LLM
async function generateKeywordsFromText(text) {
  console.log("Generating keywords from PDF text");
  const llm = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    modelName: "gpt-4",
    temperature: 0.7,
  });

  const prompt = `
  Based on the following text, suggest 4-5 relevant search keywords/topics 
  that someone would search on YouTube to learn about these concepts.
  Return ONLY a JSON array of strings (no other text):
  ["keyword1", "keyword2", "keyword3"]
  
  Text:
  ${text}
  `;

  const res = await llm.invoke([{ role: "user", content: prompt }]);
  console.log("LLM keywords response:", res.content);

  try {
    let content = res.content.trim();
    if (content.startsWith("```")) {
      content = content.replace(/^```(json)?/i, "").replace(/```$/, "").trim();
    }

    const keywords = JSON.parse(content);
    return keywords;
  } catch (err) {
    console.error("⚠️ JSON parse failed:", err.message);
    return [];
  }
}

// ✅ Function to search YouTube videos using yt-search (No API key needed)
async function searchYouTubeVideosWithoutAPI(keywords) {
  const suggestions = [];

  for (const keyword of keywords) {
    try {
      console.log(`Searching YouTube for: "${keyword}"`);
      const results = await ytSearch(keyword);

      if (results.videos && results.videos.length > 0) {
        const video = results.videos[0]; // Get first result
        suggestions.push({
          title: video.title,
          url: video.url,
          thumbnail: video.image, // YouTube thumbnail
        });
        console.log(`✅ Found: ${video.title}`);
      } else {
        console.warn(`⚠️ No videos found for: "${keyword}"`);
      }
    } catch (err) {
      console.error(`Error searching for "${keyword}":`, err.message);
    }
  }

  return suggestions;
}

// ✅ MAIN ROUTE — checks DB first, otherwise generates suggestions
router.get("/youtube/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await ChatSession.findById(sessionId);

    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }

    // Step 1 — If already have suggestions, return them
    if (session.youtubeSuggestions?.length) {
      return res.json({
        success: true,
        from: "database",
        suggestions: session.youtubeSuggestions,
      });
    }

    // Step 2 — Extract text from PDF
    const pdfText = await getRandomPdfText(session.pdfId);
    if (!pdfText) {
      return res.status(400).json({ success: false, message: "No text found in PDF" });
    }
    console.log("PDF text extracted:", pdfText.substring(0, 100) + "...");

    // Step 3 — Generate keywords using LLM
    const keywords = await generateKeywordsFromText(pdfText);
    console.log("Generated keywords:", keywords);

    if (keywords.length === 0) {
      return res.status(400).json({ success: false, message: "Could not generate keywords" });
    }

    // Step 4 — Search real YouTube videos using yt-search
    console.log("Searching YouTube videos...");
    const suggestions = await searchYouTubeVideosWithoutAPI(keywords);
    console.log("YouTube suggestions found:", suggestions.length);

    if (suggestions.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No YouTube videos found for the generated keywords",
      });
    }

    // Step 5 — Save them in DB
    session.youtubeSuggestions = suggestions;
    session.lastActivityAt = Date.now();
    await session.save();

    res.json({ success: true, from: "llm", suggestions });
  } catch (err) {
    console.error("Error generating YouTube suggestions:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;