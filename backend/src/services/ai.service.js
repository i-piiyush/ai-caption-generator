const { GoogleGenAI } = require("@google/genai");
const ai = new GoogleGenAI({});

const generateCaption = async (base64ImageFile) => {
  const contents = [
    {
      inlineData: {
        mimeType: "image/jpeg",
        data: base64ImageFile,
      },
    },
    {
      text: "create a one line instagram style caption for this image",
    },
  ];

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: contents,
    config: {
      systemInstruction: `You are an AI caption generator that creates short, human-like Instagram captions based on the provided image. Output should always be a one-liner (max 12–15 words).Must sound natural, catchy,pintrest style aesthtic and relatable like a real person wrote it.Include 2–4 trending hashtags that fit the vibe of the image.Add 1–2 emojis that feel relevant to the image and caption.Avoid sounding robotic, overly formal, or repetitive.Do not describe the image literally (e.g., “This is a dog”), instead create a vibe, mood, or feeling.
Each caption should look ready-to-post on Instagram.
Example Outputs:
“Golden hour, golden vibes ✨🌅 #ChasingLight #EveningGlow”
“Coffee first, adulting later ☕😴 #MondayMood #DailyDose”
“Lost in the city lights 🌃✨ #UrbanVibes #NightFeels”`,
    },
  });

  return response.text;
};

module.exports = generateCaption;
