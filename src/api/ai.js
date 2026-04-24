import axios from "axios";

export const generateCoverLetter = async (data) => {
  const c = data.contact || {};
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });

  const prompt = `
Write a professional cover letter using the resume and job description below.

Candidate info extracted from resume:
- Name: ${c.name || ""}
- Email: ${c.email || ""}
- Phone: ${c.phone || ""}
- LinkedIn: ${c.linkedin ? "https://" + c.linkedin : ""}
- GitHub: ${c.github ? "https://" + c.github : ""}
- Portfolio: ${c.portfolio || ""}

Applying for: ${data.role} at ${data.company}
Date: ${today}

Resume:
${data.resumeText}

Job Description:
${data.jobDesc}

Format the cover letter exactly like this:
[Candidate Name]
[Email] | [Phone] | [LinkedIn] | [GitHub/Portfolio]
[Date]

Hiring Manager
${data.company}

Dear Hiring Manager,

[3-4 paragraphs: why this role, relevant experience from resume, value to company]

Sincerely,
[Candidate Name]

Rules:
- Use only real data from the resume — no placeholders
- Match skills and experience to the job description
- Keep it concise and professional
`.trim();

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
