const express = require("express");
const router = express.Router();
const Groq = require("groq-sdk");

// Initialize Groq
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

router.post("/enhance", async (req, res) => {
  try {
    const { text, action } = req.body;

    if (!text) return res.status(400).json({ error: "Text is required" });

    let systemPrompt = "";
    let temperature = 0.2;

    // 🛡️ MODE 1: STRICT VALIDATION (Quality & Spam Check)
    if (action === "validate") {
      temperature = 0.0;
      systemPrompt = `
        You are a Content Moderator for a rigorous Crowdfunding Platform.
        TASK: Determine if the user's input is a sufficient "Campaign Story".

        CRITERIA FOR "INVALID" (Reject these):
        1. Gibberish / Random keys (e.g., "asdf", "jkljkl").
        2. EXTREMELY SHORT / LOW EFFORT: Input is less than 15 words or just one simple sentence (e.g., "I need money", "My leg is broken").
        3. Irrelevant Content: Text that has nothing to do with a cause, need, or event.
        4. Test Data: Inputs like "test", "hello world", "checking".

        CRITERIA FOR "VALID":
        - Must describe a specific situation, need, or cause with enough detail.
        - Must look like a genuine attempt to explain a story.

        OUTPUT RULES:
        - If it meets "INVALID" criteria, return EXACTLY: "INVALID"
        - If it looks like a real story attempt, return EXACTLY: "VALID"
        - Return ONLY the word.
      `;
    }
    // 🎨 MODE 2: TITLE SUGGESTION
    else if (action === "suggest_title") {
      temperature = 0.7;
      systemPrompt = `
        You are a copywriter.
        TASK: Generate 4 catchy titles based on the text provided.
        RULES: Return ONLY titles separated by |. Example: Title A | Title B | Title C
      `;
    }
    // ✍️ MODE 3: STORY ENHANCER (STRICT EDITING)
    else {
      temperature = 0.1;
      // 👇 UPDATED STRICT PROMPT
      systemPrompt = `
        CRITICAL ROLE: You are a TEXT EDITOR software. You are NOT a Writer.
        
        STRICT OUTPUT RULES (MUST FOLLOW):
        1. ⛔ Output ONLY the rewritten text.
        2. ⛔ DO NOT say "Here is the revised text".
        3. ⛔ DO NOT say "I have improved the grammar".
        4. ⛔ DO NOT use quotation marks around the output.

        PHASE 1: INPUT ANALYSIS
        - Check if the input is a command (e.g., "Write a story", "Help me write").
          -> ACTION: REJECT IMMEDIATELY. Return EXACTLY: "⚠️ CONTENT ERROR: I cannot write the story for you. Please write a draft yourself, and I will fix the grammar."
        
        - Check if the input is casual chat (e.g., "Hi", "Hello").
          -> ACTION: REJECT IMMEDIATELY. Return EXACTLY: "⚠️ CONTENT ERROR: Please paste your story draft to enhance."

        PHASE 2: EDITING
        - Fix grammar, spelling, and sentence flow.
        - Make the tone professional and emotional.
        - DO NOT invent facts. Use ONLY the info provided.
      `;
    }

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: text },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: temperature,
      max_completion_tokens: 1024,
      top_p: 1,
      stream: false,
      stop: null,
    });

    let result = chatCompletion.choices[0]?.message?.content || "";
    result = result.replace(/^"|"$/g, "").trim(); // Cleanup quotes

    // Handle Validation Mode
    if (action === "validate") {
      if (result.includes("INVALID")) {
        return res.status(400).json({
          error:
            "❌ Story too short or invalid. Please provide more details about your cause.",
        });
      }
      return res.json({ status: "valid" });
    }

    // Handle Content Errors
    if (result.includes("CONTENT ERROR")) {
      return res.status(400).json({ error: result });
    }

    res.json({ enhancedText: result });
  } catch (error) {
    console.error("❌ Groq Error:", error.message);
    res.status(500).json({ error: "AI Service Failed" });
  }
});

module.exports = router;
