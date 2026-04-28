import { NextResponse } from "next/server";
import { PDFParse } from "pdf-parse";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const OUTPUT_SCHEMA = {
  cover_letter: "string",
  ats_resume_tweaks: [
    {
      original_resume_bullet: "string",
      suggested_revision: "string",
      reasoning: "string",
    },
  ],
  missing_keywords: ["string"],
};

const SYSTEM_PROMPT = `You are an expert resume and cover letter writer specializing in ATS optimization and job matching.
Your task is to:
1. Generate a compelling, personalized cover letter for the given job description
2. Identify key resume bullets that should be revised to better match the job requirements
3. Extract missing keywords that should be incorporated into the resume

IMPORTANT: 
- Return ONLY valid JSON matching this exact schema (no additional text, no markdown):
{
  "cover_letter": "Full cover letter text here",
  "ats_resume_tweaks": [
    {
      "original_resume_bullet": "The exact bullet point from the resume",
      "suggested_revision": "Improved version optimized for the job",
      "reasoning": "Why this change makes it stronger"
    }
  ],
  "missing_keywords": ["keyword1", "keyword2", "keyword3"]
}

- Ensure the cover letter is professional, compelling, and specifically tailored to the job description
- Focus on the top 5-10 most impactful resume bullet changes
- Extract 10-15 missing keywords/skills that appear in the job description but not in the resume
- Make all content specific and relevant - no generic statements`;

async function extractPdfText(fileBuffer) {
  let parser;
  try {
    parser = new PDFParse({ data: fileBuffer });
    const data = await parser.getText();
    return data.text;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to parse PDF: ${message}`);
  } finally {
    if (parser) {
      await parser.destroy();
    }
  }
}

async function callAiApi(resumeText, jobDescription, retries = 3) {
  const prompt = `RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

Please analyze this resume against the job description and provide:
1. A tailored cover letter
2. Key resume bullet improvements
3. Missing keywords to include

Return ONLY the JSON output, no other text.`;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      });

      const content = response.choices[0].message.content.trim();

      // Try to parse JSON - handle markdown code blocks
      let jsonStr = content;
      if (content.includes("```json")) {
        jsonStr = content.split("```json")[1].split("```")[0].trim();
      } else if (content.includes("```")) {
        jsonStr = content.split("```")[1].split("```")[0].trim();
      }

      const parsed = JSON.parse(jsonStr);

      // Validate schema
      if (!parsed.cover_letter || !Array.isArray(parsed.ats_resume_tweaks) || !Array.isArray(parsed.missing_keywords)) {
        throw new Error("Invalid response schema");
      }

      return parsed;
    } catch (error) {
      if (attempt === retries) {
        throw new Error(
          `Failed to generate valid response after ${retries} attempts: ${error.message}`
        );
      }
      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
    }
  }
}

export async function POST(request) {
  try {
    // Check for API key
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Missing OPENAI_API_KEY environment variable" },
        { status: 500 }
      );
    }

    // Parse FormData
    const formData = await request.formData();
    const resumeFile = formData.get("resume");
    const jobDescription = formData.get("jobDescription");

    // Validate inputs
    if (!resumeFile || !jobDescription) {
      return NextResponse.json(
        { error: "Missing resume file or job description" },
        { status: 400 }
      );
    }

    if (resumeFile.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Resume must be a PDF file" },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const buffer = Buffer.from(await resumeFile.arrayBuffer());

    // Extract resume text from PDF
    const resumeText = await extractPdfText(buffer);

    if (!resumeText || resumeText.trim().length === 0) {
      return NextResponse.json(
        { error: "Could not extract text from PDF. Please ensure the PDF contains readable text." },
        { status: 400 }
      );
    }

    // Call AI API with retry logic
    const results = await callAiApi(resumeText, jobDescription);

    return NextResponse.json(results);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}

