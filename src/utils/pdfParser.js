import * as pdfjsLib from "pdfjs-dist";
import workerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

const parseContact = (text) => {
  const email     = text.match(/[\w.+'-]+@[\w.-]+\.[a-zA-Z]{2,}/)?.[0] || null;
  const phone     = text.match(/(\+?[\d][\d\s\-(). ]{6,13}[\d])/)?.[0]?.trim() || null;
  const linkedin  = text.match(/linkedin\.com\/in\/([\w-]+)/i)?.[1] || null;
  const github    = text.match(/github\.com\/([\w-]+)/i)?.[1] || null;
  const portfolio = text.match(/https?:\/\/(?!.*(?:linkedin|github)\.com)[\w.-]+\.[a-zA-Z]{2,}[\w/.-]*/i)?.[0] || null;

  const lines = text.split(/\n/).map(l => l.trim()).filter(Boolean);
  const name = lines.find(
    l => /^[A-Za-z][A-Za-z .'-]{1,48}$/.test(l) && l.split(/\s+/).length >= 2 && l.split(/\s+/).length <= 5
  ) || null;

  return {
    name,
    email,
    phone,
    linkedin: linkedin ? `linkedin.com/in/${linkedin}` : null,
    github:   github   ? `github.com/${github}`        : null,
    portfolio,
  };
};

export const extractTextFromPDF = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  let text = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page    = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map(item => item.str).join(" ") + "\n";
  }

  return { text, contact: parseContact(text) };
};
