// backend/test_key.js
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function test() {
  const key = process.env.GEMINI_API_KEY;
  console.log("🔑 Key ending in:", key.slice(-4));
  console.log("📡 Contacting Google AI Studio...");

  const genAI = new GoogleGenerativeAI(key);
  try {
    // We try the standard model 'gemini-pro'
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent("Say 'Hello User' if you work.");
    console.log("\n✅ SUCCESS! The AI replied:");
    console.log("   " + result.response.text());
  } catch (err) {
    console.log("\n❌ FAIL. Error details:");
    console.log(err.message);
  }
}

test();
