  import { tokenizer } from "./tokenizer.js"
  import * as fs from "node:fs"
  import path from 'node:path';
  import { fileURLToPath } from 'node:url';
  import { PDFParse } from "pdf-parse"
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  
  (() => {
  
    if (!fs.existsSync(path.join(__dirname, "data" ,"frequency.json"))) {
      fs.writeFileSync(path.join(__dirname , "data" , "frequency.json"), "{}" , 'utf-8')
    }
  
    if (!fs.existsSync(path.join(__dirname, "data" ,"IDToPath.json"))) {
      fs.writeFileSync(path.join(__dirname , "data" , "IDToPath.json"), "{}" , 'utf-8')
    }
  
    if (!fs.existsSync(path.join(__dirname, "data" ,"pathToID.json"))) {
      fs.writeFileSync(path.join(__dirname , "data" , "pathToID.json"), "{}" , 'utf-8')
    }
    
  })()
      
  
  
  export function add(filepath, content) {
  
    let pathToID = JSON.parse(fs.readFileSync(path.join(__dirname, "data" ,"pathToID.json")))
    let IDToPath = JSON.parse(fs.readFileSync(path.join(__dirname, "data" ,"IDToPath.json")))
    let frequency = JSON.parse(fs.readFileSync(path.join(__dirname, "data" ,"frequency.json")))
    
    if (!pathToID[filepath]) {
      let chosenID = Object.keys(IDToPath).length + 1
      IDToPath[chosenID] = filepath
      pathToID[filepath] = chosenID
    }
    
    let tokens = tokenizer(content)
    let docID = pathToID[filepath]
    for (const t of tokens) {
      frequency[t] = frequency[t] || {}
      frequency[t][docID] = (frequency[t][docID] || 0) + 1
    }
  
    fs.writeFileSync(path.join(__dirname, "data", "frequency.json"), JSON.stringify(frequency), 'utf-8')
    fs.writeFileSync(path.join(__dirname , "data" , "IDToPath.json"), JSON.stringify(IDToPath) , 'utf-8')
    fs.writeFileSync(path.join(__dirname , "data" , "pathToID.json"), JSON.stringify(pathToID) , 'utf-8')
    
  }
  
  export async function parser(Path) {
    const dataBuffer = fs.readFileSync(Path);
    const parser = new PDFParse({ data: dataBuffer });
    const result = await parser.getText();
    const cleanText = result.text
      
        .replace(/(\b[^\n\t]+)(\t+\1)+/gi, '$1')

        .replace(/Reprint \d{4}-\d{2}/gi, '')
        .replace(/-- \d+ of \d+ --/g, '')
        .replace(/Science\s+\d+/gi, '')
        .replace(/Life Processes\s+\d+/gi, '')
        
        .replace(/(\w+)-\n(\w+)/g, '$1$2')
        
        .replace(/\n{3,}/g, '\n\n')
        .trim();
  
    const sectionPattern = /\n(?=\d+\.\d+(?:\.\d+)?\s+[A-Za-z])/g;
    const rawSections = cleanText.split(sectionPattern);

    rawSections.forEach((chunk, index) => {
        const text = chunk.trim();
        if (text.length < 100) return; 
    
        const firstLine = text.split("\n")[0].trim();
        
        const safeTitle = firstLine
          .replace(/[^a-zA-Z0-9\s]/g, "")
          .replace(/\s+/g, "_")
          .toLowerCase()
          .slice(0, 40);
    
        const fileName = `${String(index).padStart(2, "0")}_${safeTitle || "section"}.md`;
        const fullPath = path.join(__dirname, "/ncert" , fileName);
    
        fs.writeFileSync(fullPath, text, "utf-8");
        console.log(`Saved: ${fileName}`);

        add(fullPath , text)
      });
    
  }
  
  // const pdfsDir = path.join(__dirname, "pdfs");
  // const pdfFiles = fs.readdirSync(pdfsDir).filter(f => f.endsWith(".pdf"));

  // for (const file of pdfFiles) {
  //   console.log(await parser(path.join(pdfsDir, file)));
  // }