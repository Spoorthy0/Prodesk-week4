import axios from "axios";

export const generateCoverLetter = async (data) => {
  const prompt = `
Write a professional cover letter.

Candidate: ${data.name}
Company: ${data.company}
Role: ${data.role}
Skills: ${data.skills}

Resume:
${data.resumeText}

Job Description:
${data.jobDesc}

Requirements:
- Proper paragraphs
- Personalized using resume
- Clear and professional tone
`;

  const res = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: "openai/gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    },
    {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
      },
    }
  );

  return res.data.choices[0].message.content;
};