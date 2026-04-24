import { useState } from "react";
import { generateCoverLetter } from "./api/ai";
import { extractTextFromPDF } from "./utils/pdfParser";

export default function App() {
  const [form, setForm] = useState({
    name: "",
    company: "",
    role: "",
    skills: "",
    jobDesc: "",
  });

  const [resumeText, setResumeText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFile = async (e) => {
    const text = await extractTextFromPDF(e.target.files[0]);
    setResumeText(text);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const res = await generateCoverLetter({ ...form, resumeText });
    setResult(res);
    setLoading(false);
  };

  return (
    <div className="min-h-screen p-6">
      
      <h1 className="text-4xl font-bold text-center mb-8 text-[var(--primary)]">
        AI Cover Letter Generator
      </h1>

      <div className="max-w-3xl mx-auto bg-[var(--card)] p-8 rounded-3xl shadow-lg">

        <input name="name" placeholder="Candidate Name" className="input" onChange={handleChange} />
        <input name="company" placeholder="Company Name" className="input" onChange={handleChange} />
        <input name="role" placeholder="Job Role" className="input" onChange={handleChange} />

        <textarea name="skills" placeholder="Key Skills" className="input" onChange={handleChange} />
        <textarea name="jobDesc" placeholder="Job Description" className="input" onChange={handleChange} />

        <input type="file" accept="application/pdf" onChange={handleFile} className="my-3" />

        <button
          onClick={handleSubmit}
          className="w-full py-3 rounded-xl bg-[var(--primary)] text-black hover:bg-[var(--primary-dark)] transition"
        >
          Generate Cover Letter
        </button>

        {loading && (
          <p className="text-center mt-4 animate-pulse">Generating...</p>
        )}
      </div>

      {result && (
        <div className="max-w-3xl mx-auto mt-6 bg-[var(--card)] p-6 rounded-2xl shadow">
          <pre className="whitespace-pre-wrap">{result}</pre>

          <button
            onClick={() => navigator.clipboard.writeText(result)}
            className="mt-4 px-4 py-2 bg-[var(--primary)] rounded"
          >
            Copy
          </button>
        </div>
      )}
    </div>
  );
}