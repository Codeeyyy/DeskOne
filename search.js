import { tokenizer } from "./tokenizer.js"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


(() => {

  if (!fs.existsSync(path.join(__dirname, "data" ,"frequency.json"))) {
    fs.writeFileSync(path.join(__dirname , "data" , "frequency.json"), "{}" , 'utf-8')
  }

  if (!fs.existsSync(path.join(__dirname, "data" ,"IDToPath.json"))) {
    fs.writeFileSync(path.join(__dirname , "data" , "IDToPath.json"), "{}" , 'utf-8')
  }
  
})()

export function search(prompt) {
  let tokens = tokenizer(prompt)

  let frequency = JSON.parse(fs.readFileSync(path.join(__dirname, "data", "frequency.json")))
  let IDtoPath = JSON.parse(fs.readFileSync(path.join(__dirname, "data", "IDToPath.json")))
  
  let finalResults = []
  for (const t of tokens) {
    if (frequency[t]) {
      let results = Object.keys(frequency[t]).map(docID => {
        return {
          path: IDtoPath[docID],
          score: frequency[t][docID]
        }
      })

      let sortedResults = results ? results.toSorted((a, b) => b.score - a.score).slice(0, 3) : []
      for (const file of sortedResults) {
        let content = (fs.existsSync(file.path) ? fs.readFileSync( file.path, 'utf-8') : "")
        let trauncatedText = content.slice(0, Math.min(300, content.length))
        content.length > 300 ? trauncatedText += "..." : trauncatedText += ""
        finalResults.push(
          {
            Text: trauncatedText,
            Path: file.path 
          }
        )
      }
      
    }
  }
  return finalResults
}

console.log(search("concave mirror focal length virtual image"))