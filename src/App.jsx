import { useState, useEffect } from "react";
import {
  FiSun, FiMoon, FiUpload, FiClipboard, FiCheck,
  FiUser, FiMail, FiPhone, FiGlobe,
} from "react-icons/fi";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { generateCoverLetter } from "./api/ai";
import { extractTextFromPDF } from "./utils/pdfParser";
import "./App.css";

export default function App() {
  const [dark, setDark] = useState(false);
  const [form, setForm] = useState({ company: "", role: "", jobDesc: "" });
  const [resumeText, setResumeText] = useState("");
  const [contact, setContact] = useState(null);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    const { text, contact: parsed } = await extractTextFromPDF(file);
    setResumeText(text);
    setContact(parsed);
  };

  const handleSubmit = async () => {
    if (!form.company || !form.role) return;
    setLoading(true);
    setResult("");
    try {
      const res = await generateCoverLetter({ ...form, resumeText, contact });
      setResult(res);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const chipData = contact
    ? [
        contact.name      && { icon: <FiUser size={12} />,     label: contact.name },
        contact.email     && { icon: <FiMail size={12} />,     label: contact.email },
        contact.phone     && { icon: <FiPhone size={12} />,    label: contact.phone },
        contact.linkedin  && { icon: <FaLinkedin size={12} />, label: "LinkedIn" },
        contact.github    && { icon: <FaGithub size={12} />,   label: "GitHub" },
        contact.portfolio && { icon: <FiGlobe size={12} />,    label: "Portfolio" },
      ].filter(Boolean)
    : [];

  return (
    <div className="app-wrapper">
      <header className="app-header">
        <div className="header-inner">
          <h1 className="app-title">
            Cover Letter &nbsp;<span>Generator</span>
          </h1>
          <button
            className="theme-toggle"
            onClick={() => setDark((d) => !d)}
            title={dark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {dark ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>
        </div>
      </header>

      <main className="main-content">
        <section className="card">
          <h2 className="section-title">Application Details</h2>

          <div className="form-grid">
            <div className="form-group">
              <label className="label">Company Name</label>
              <input
                name="company"
                placeholder="e.g. Google"
                className="input"
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="label">Job Role</label>
              <input
                name="role"
                placeholder="e.g. Frontend Engineer"
                className="input"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: "0.85rem" }}>
            <label className="label">Job Description</label>
            <textarea
              name="jobDesc"
              placeholder="Paste the full job description here…"
              className="input"
              onChange={handleChange}
            />
          </div>

          <div className="upload-area">
            <label className="upload-label">
              <FiUpload size={17} className="upload-icon" />
              <span className="file-name">
                {fileName || "Upload Resume (PDF)"}
              </span>
              <input type="file" accept="application/pdf" onChange={handleFile} />
            </label>
          </div>

          {chipData.length > 0 && (
            <div className="contact-preview">
              <p className="contact-preview-title">Detected from Resume</p>
              <div className="contact-chips">
                {chipData.map((c, i) => (
                  <span className="chip" key={i}>
                    {c.icon}
                    {c.label}
                  </span>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading || !form.company || !form.role}
            className="btn-primary"
          >
            {loading && (
              <span className="loading-dots">
                <span /><span /><span />
              </span>
            )}
            {loading ? "Generating…" : "Generate Cover Letter"}
          </button>
        </section>

        {result && (
          <section className="card">
            <div className="result-header">
              <h2 className="section-title">Your Cover Letter</h2>
              <button onClick={handleCopy} className="btn-secondary">
                {copied
                  ? <><FiCheck size={15} /> Copied!</>
                  : <><FiClipboard size={15} /> Copy</>}
              </button>
            </div>
            <div className="cover-letter-paper">
              <pre className="cover-letter-text">{result}</pre>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
