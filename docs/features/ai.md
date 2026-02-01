# AI Integration

AI-powered features using Groq LLM API.

---

## Overview

TrustFund integrates AI to improve campaign quality:

- **Story Validation** - Check content quality
- **Story Enhancement** - Improve grammar and tone
- **Title Suggestions** - Generate catchy titles

---

## Technology

| Component | Details                 |
| --------- | ----------------------- |
| Provider  | Groq                    |
| Model     | LLama 3.3 70B Versatile |
| SDK       | `groq-sdk`              |

### Configuration

```env
GROQ_API_KEY=gsk_your_api_key_here
```

Get your API key at [console.groq.com](https://console.groq.com)

---

## API Endpoint

```
POST /api/ai/enhance
```

### Request

```json
{
  "text": "Your campaign story or content",
  "action": "enhance"
}
```

### Actions

| Action          | Purpose              | Temperature |
| --------------- | -------------------- | ----------- |
| `validate`      | Check story quality  | 0.0         |
| `suggest_title` | Generate title ideas | 0.7         |
| `enhance`       | Improve grammar/tone | 0.1         |

---

## Story Validation

### Purpose

Ensures campaign stories meet minimum quality standards before allowing AI enhancement.

### Rejection Criteria

1. **Gibberish** - Random characters (e.g., "asdf", "jkljkl")
2. **Too Short** - Less than 15 words
3. **Low Effort** - Single simple sentence
4. **Irrelevant** - Not about a cause or need
5. **Test Data** - "test", "hello world"

### System Prompt

```
You are a Content Moderator for a rigorous Crowdfunding Platform.
TASK: Determine if the user's input is a sufficient "Campaign Story".

CRITERIA FOR "INVALID" (Reject these):
1. Gibberish / Random keys (e.g., "asdf", "jkljkl").
2. EXTREMELY SHORT / LOW EFFORT: Input is less than 15 words
3. Irrelevant Content: Text unrelated to a cause or need.
4. Test Data: Inputs like "test", "hello world".

CRITERIA FOR "VALID":
- Must describe a specific situation, need, or cause with detail.
- Must look like a genuine story attempt.

OUTPUT RULES:
- If INVALID, return EXACTLY: "INVALID"
- If VALID, return EXACTLY: "VALID"
```

### Response

**Valid:**

```json
{
  "status": "valid"
}
```

**Invalid:**

```json
{
  "error": "❌ Story too short or invalid. Please provide more details about your cause."
}
```

---

## Story Enhancement

### Purpose

Improves grammar, spelling, and makes the tone more professional and emotional.

### Rules

1. Fix grammar and spelling
2. Improve sentence flow
3. Make tone professional and emotional
4. **Never invent facts** - Use only provided information
5. **Never write from scratch** - Only edit existing content

### System Prompt

```
CRITICAL ROLE: You are a TEXT EDITOR software. You are NOT a Writer.

STRICT OUTPUT RULES:
1. ⛔ Output ONLY the rewritten text.
2. ⛔ DO NOT say "Here is the revised text".
3. ⛔ DO NOT use quotation marks around output.

PHASE 1: INPUT ANALYSIS
- If input is a command (e.g., "Write a story"):
  -> REJECT: "⚠️ CONTENT ERROR: I cannot write the story for you."

- If input is casual chat (e.g., "Hi", "Hello"):
  -> REJECT: "⚠️ CONTENT ERROR: Please paste your story draft."

PHASE 2: EDITING
- Fix grammar, spelling, and sentence flow.
- Make the tone professional and emotional.
- DO NOT invent facts.
```

### Example

**Input:**

```
my daughter has been sick for 3 months now. we need money for her surgery. please help us.
```

**Output:**

```
My daughter has been battling illness for the past three months,
and our family is facing an incredibly difficult time. She
urgently requires surgery to recover, but the medical costs are
beyond what we can afford on our own. We are reaching out to
kindhearted individuals who might be able to help us during this
challenging period. Any contribution, no matter how small, would
bring us one step closer to seeing our daughter healthy again.
Your support means the world to us.
```

---

## Title Suggestions

### Purpose

Generate catchy, compelling titles for campaigns.

### System Prompt

```
You are a copywriter.
TASK: Generate 4 catchy titles based on the text provided.
RULES: Return ONLY titles separated by |.
Example: Title A | Title B | Title C | Title D
```

### Example

**Input:**

```
My daughter needs heart surgery. We cannot afford the costs.
```

**Output:**

```
Give Hope to Little Sarah | A Father's Plea for His Daughter |
Help Save a Young Heart | Emergency Surgery Fund for Sarah
```

### Frontend Parsing

```javascript
const titles = response.data.result.split("|").map((t) => t.trim());
// ["Give Hope to Little Sarah", "A Father's Plea...", ...]
```

---

## Frontend Integration

### Campaign Wizard Usage

```jsx
// CampaignWizard.jsx
const [description, setDescription] = useState("");
const [enhancing, setEnhancing] = useState(false);

const validateStory = async () => {
  const response = await axios.post("/api/ai/enhance", {
    text: description,
    action: "validate",
  });
  return response.data.status === "valid";
};

const enhanceStory = async () => {
  setEnhancing(true);
  try {
    const response = await axios.post("/api/ai/enhance", {
      text: description,
      action: "enhance",
    });
    setDescription(response.data.result);
    toast.success("Story enhanced!");
  } catch (error) {
    toast.error(error.response?.data?.error || "Enhancement failed");
  }
  setEnhancing(false);
};

const suggestTitles = async () => {
  const response = await axios.post("/api/ai/enhance", {
    text: description,
    action: "suggest_title",
  });
  const titles = response.data.result.split("|").map((t) => t.trim());
  setSuggestedTitles(titles);
};
```

### UI Example

```jsx
<div className="form-control">
  <label className="label">Campaign Story</label>
  <textarea
    className="textarea textarea-bordered h-32"
    value={description}
    onChange={(e) => setDescription(e.target.value)}
    placeholder="Tell your story..."
  />

  <div className="flex gap-2 mt-2">
    <button
      onClick={enhanceStory}
      disabled={enhancing}
      className="btn btn-outline btn-sm"
    >
      {enhancing ? "Enhancing..." : "✨ Enhance with AI"}
    </button>

    <button onClick={suggestTitles} className="btn btn-outline btn-sm">
      💡 Suggest Titles
    </button>
  </div>
</div>
```

---

## Error Handling

### Validation Failures

```javascript
if (action === "validate") {
  if (result.includes("INVALID")) {
    return res.status(400).json({
      error: "❌ Story too short or invalid. Please provide more details.",
    });
  }
  return res.json({ status: "valid" });
}
```

### Command Rejection

If user tries to make AI write a story:

```
⚠️ CONTENT ERROR: I cannot write the story for you.
Please write a draft yourself, and I will fix the grammar.
```

---

## API Configuration

```javascript
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

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

const result = chatCompletion.choices[0]?.message?.content || "";
```

---

## Best Practices

1. **Validate first** - Check story quality before enhancement
2. **Set expectations** - Tell users AI edits, not writes
3. **Show changes** - Let users see before/after
4. **Allow rejection** - Users can revert AI changes
5. **Rate limiting** - Consider limiting AI calls per user

---

## Future Enhancements

- Image description generation
- Spam/fraud detection
- Category auto-suggestion
- Translation support
- Sentiment analysis
