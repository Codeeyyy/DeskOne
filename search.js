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
  
  for (const t of tokens) {
    if (frequency[t]) {
      let results = Object.keys(frequency[t]).map(docID => {
        return {
          path: IDtoPath[docID],
          score: frequency[t][docID]
        }
      })

      return results ? results.toSorted((a,b) => b.score - a.score) : []
    }
  }
}

console.log(search("light"));
console.log(search("energy"));
console.log(search("refraction lens"));