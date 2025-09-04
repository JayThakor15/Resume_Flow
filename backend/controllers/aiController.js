const { validationResult } = require("express-validator");

// We keep the SDK import optional to avoid crashes if not installed yet
let GoogleGenerativeAI;
try {
  GoogleGenerativeAI = require("@google/generative-ai").GoogleGenerativeAI;
} catch (err) {
  GoogleGenerativeAI = null;
}

const modelName = "gemini-1.5-flash"; // fast for suggestions; can be swapped to pro

const buildPrompt = ({ text, context }) => {
  const base = `You are an expert ATS resume writing assistant. Improve the provided text with:
- Grammar and clarity improvements
- Concise, impactful phrasing
- ATS-friendly, role-relevant keywords (avoid buzzword stuffing)
- Keep the user's voice and intent
- Return JSON with keys: corrected, keywords (array), suggestions (array of bullet strings)`;

  const scoped = context ? `Context about the section: ${context}` : "";

  return `${base}\n${scoped}\n\nText:\n${text}`;
};

exports.getSuggestions = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    if (!GoogleGenerativeAI) {
      return res.status(500).json({
        success: false,
        message: "Gemini SDK not installed. Please add @google/generative-ai",
      });
    }

    const { text, context } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "GEMINI_API_KEY not configured on the server",
      });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: modelName });

    const prompt = buildPrompt({ text, context });
    const result = await model.generateContent(prompt);

    // Gemini responses can vary: try to parse JSON from text
    const raw = await result.response.text();

    let parsed;
    try {
      // Try to find JSON block in case model added prose
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      parsed = JSON.parse(jsonMatch ? jsonMatch[0] : raw);
    } catch (e) {
      // Fallback: wrap as generic shape
      parsed = {
        corrected: raw,
        keywords: [],
        suggestions: [
          "Consider adding measurable impact (metrics, outcomes).",
          "Use action verbs and relevant keywords for ATS.",
        ],
      };
    }

    return res.json({ success: true, data: parsed });
  } catch (error) {
    return next(error);
  }
};
