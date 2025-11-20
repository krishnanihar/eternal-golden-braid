import { Chapter } from './types';

export const CHAPTERS: Chapter[] = [
  // PART I: GEB
  { id: 1, part: 'I', title: 'The MIU Puzzle', description: 'Can you produce MU from MI? A lesson in formal systems.', visualType: 'code' },
  { id: 2, part: 'I', title: 'Meaning and Form', description: 'How semantics emerge from meaningless syntax.', visualType: 'geometry' },
  { id: 3, part: 'I', title: 'Figure and Ground', description: 'Positive and negative space in art and logic.', visualType: 'geometry' },
  { id: 4, part: 'I', title: 'Consistency & Completeness', description: 'The limits of what can be proven.', visualType: 'logic' },
  { id: 5, part: 'I', title: 'Recursive Structures', description: 'Stories within stories, stacks within stacks.', visualType: 'recursive' },
  { id: 6, part: 'I', title: 'The Location of Meaning', description: 'Is meaning in the message or the interpreter?', visualType: 'network' },
  
  // PART II: EGB
  { id: 7, part: 'II', title: 'The Propositional Calculus', description: 'Rules of inference and truth tables.', visualType: 'logic' },
  { id: 8, part: 'II', title: 'Typographical Number Theory', description: 'Encoding mathematics into strings.', visualType: 'code' },
  { id: 9, part: 'II', title: 'Mumon and Gödel', description: 'Zen koans meeting mathematical undecidability.', visualType: 'geometry' },
  
  // PART III: SELF-REFERENCE
  { id: 10, part: 'III', title: 'Levels of Description', description: 'Holism versus reductionism.', visualType: 'network' },
  { id: 11, part: 'III', title: 'Brains and Thoughts', description: 'Hardware vs Software of the mind.', visualType: 'network' },
  { id: 12, part: 'III', title: 'Minds and Thoughts', description: 'The emergence of the "I".', visualType: 'recursive' },
  { id: 13, part: 'III', title: 'BlooP, FlooP, GlooP', description: 'Bounded loops and infinite recursion.', visualType: 'code' },
  { id: 14, part: 'III', title: 'Self-Referential Sentences', description: 'This sentence is false.', visualType: 'recursive' },
  { id: 15, part: 'III', title: 'Undecidable Propositions', description: 'The heart of Gödel’s proof.', visualType: 'logic' },
  { id: 16, part: 'III', title: 'The Liar Paradox', description: 'Epimenides and the loop of truth.', visualType: 'logic' },
  
  // PART IV: EMERGENCE
  { id: 17, part: 'IV', title: 'AI: Prospects', description: 'Can a machine ever truly understand?', visualType: 'network' },
  { id: 18, part: 'IV', title: 'Church, Turing, Tarski', description: 'The Church-Turing thesis explored.', visualType: 'code' },
  { id: 19, part: 'IV', title: 'Jumping Out of the System', description: 'Transcending the rules.', visualType: 'recursive' },
  { id: 20, part: 'IV', title: 'The Eternal Golden Braid', description: 'The unity of the three masters.', visualType: 'gold' },
];