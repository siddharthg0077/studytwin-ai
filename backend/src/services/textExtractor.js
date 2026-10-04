import fs from "fs/promises";
import pdf from "pdf-parse/lib/pdf-parse.js";
import AdmZip from "adm-zip";

const decodeXml = (s) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");

async function fromPdf(filePath) {
  const buffer = await fs.readFile(filePath);
  const data = await pdf(buffer);
  return data.text;
}

async function fromPptx(filePath) {
  const zip = new AdmZip(filePath);
  const slides = zip
    .getEntries()
    .filter((e) => /^ppt\/slides\/slide\d+\.xml$/.test(e.entryName))
    .sort(
      (a, b) =>
        parseInt(a.entryName.match(/\d+/)[0]) - parseInt(b.entryName.match(/\d+/)[0])
    );

  return slides
    .map((entry) => {
      const xml = entry.getData().toString("utf8");
      const pieces = [...xml.matchAll(/<a:t>([^<]*)<\/a:t>/g)].map((m) => decodeXml(m[1]));
      return pieces.join(" ");
    })
    .join("\n\n");
}

async function fromTxt(filePath) {
  return fs.readFile(filePath, "utf8");
}

export async function extractText(filePath, ext) {
  let text = "";
  if (ext === ".pdf") text = await fromPdf(filePath);
  else if (ext === ".pptx") text = await fromPptx(filePath);
  else if (ext === ".txt") text = await fromTxt(filePath);
  return text.replace(/\s+\n/g, "\n").replace(/[ \t]+/g, " ").trim();
}