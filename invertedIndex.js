import { tokenizer } from "./tokenizer.js"
import * as fs from "node:fs"
import path from 'node:path';
import { fileURLToPath } from 'node:url';

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

// --- PHYSICS ---

add(
  "/ncert/class10/physics/light_reflection.md",
  "Light travels in straight lines. Rectilinear propagation of light causes the formation of sharp shadows. When light strikes a polished mirror, reflection occurs such that the angle of incidence equals the angle of reflection."
);

add(
  "/ncert/class10/physics/light_refraction.md",
  "Refraction of light is the bending of light rays when passing from one transparent medium to another of different optical density. A convex lens converges parallel rays of light to a principal focus point."
);

add(
  "/ncert/class10/physics/human_eye.md",
  "The human eye uses a natural crystalline convex lens to focus light onto the retina. Atmospheric refraction of starlight causes stars to twinkle, whereas planets do not twinkle because they appear as extended sources."
);

add(
  "/ncert/class9/physics/work_and_energy.md",
  "Kinetic energy is the energy possessed by an object due to its motion. Light and heat are forms of energy. The law of conservation of energy states that energy cannot be created or destroyed, only transformed."
);

// --- CHEMISTRY ---

add(
  "/ncert/class10/chemistry/acids_bases_salts.md",
  "Acids react with active metals to liberate hydrogen gas and form a corresponding salt. When hydrochloric acid reacts with sodium hydroxide base, a neutralization reaction produces sodium chloride salt and water."
);

add(
  "/ncert/class10/chemistry/chemical_reactions.md",
  "In an exothermic chemical reaction, heat energy is released into the surroundings. Photosynthesis in green plants is an endothermic reaction because light energy is absorbed from sunlight to synthesize glucose."
);

// --- BIOLOGY ---

add(
  "/ncert/class9/biology/cell_unit_of_life.md",
  "The cell is the basic structural and functional unit of all living organisms. Plant cell walls are made of rigid cellulose, whereas animal cells lack a cell wall and only possess a flexible plasma membrane."
);

add(
  "/ncert/class9/biology/cell_organelles.md",
  "Mitochondria are double-membraned organelles known as the powerhouse of the cell. Mitochondria generate cellular energy in the form of ATP molecules through cellular respiration."
);
