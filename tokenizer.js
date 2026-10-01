const noise = new Set([
  // Articles
  "a", "an", "the",

  // Basic conjunctions
  "and", "or", "but",

  // Basic prepositions
  "in", "on", "at", "by",
  "to", "from", "of",
  "with", "for",

  // Pronouns
  "i", "me", "my", "myself",
  "you", "your", "yourself",
  "he", "him", "his",
  "she", "her", "hers",
  "we", "us", "our",
  "they", "them", "their",

  // Demonstratives
  "this", "that", "these", "those",

  // Auxiliary verbs
  "am", "is", "are",
  "was", "were",
  "be", "been",
  "being",
  "do", "does", "did",
  "doing",
  "have", "has", "had",

  // Conversational filler
  "please",
  "thanks",
  "thank",
  "hello",
  "hi",
  "hey"
]);

export function tokenizer(text) {
  let lowerCaseText = text.toLowerCase();
  let tokens = lowerCaseText.match(/[a-z0-9]+/g) || []
  return tokens.filter(token => !noise.has(token))
}
