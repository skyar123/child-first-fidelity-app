// Wisdom quotes from Child First Fidelity and CPP principles
// These can be shown throughout the app to reinforce key concepts

export interface WisdomQuote {
  quote: string
  source: string
  category: 'reflective' | 'emotional' | 'dyadic' | 'trauma' | 'procedural' | 'content' | 'general'
}

export const WISDOM_QUOTES: WisdomQuote[] = [
  // Reflective Practice
  {
    quote: "When affect is strong, the first to regulate is your own.",
    source: "Child First Fidelity Principle",
    category: 'reflective'
  },
  {
    quote: "Engage your frontal lobes before intervening.",
    source: "Reflective Practice",
    category: 'reflective'
  },
  {
    quote: "It's difficult to think clearly when you are triggered.",
    source: "Child First Fidelity Principle",
    category: 'reflective'
  },
  {
    quote: "You do not have to agree with a belief, value, or behavior to have an empathic understanding of its emotional meaning.",
    source: "Child First Fidelity Principle",
    category: 'reflective'
  },
  {
    quote: "Balance acceptance with change.",
    source: "Linehan, via Child First",
    category: 'reflective'
  },
  {
    quote: "Awareness of own emotional reactions is central to reflective capacity.",
    source: "Reflective Practice Fidelity",
    category: 'reflective'
  },
  {
    quote: "Awareness of own personal and cultural biases enhances capacity for empathy.",
    source: "Reflective Practice Fidelity",
    category: 'reflective'
  },
  {
    quote: "The ability to consider multiple perspectives—caregiver's, child's, own—is essential.",
    source: "Reflective Practice Fidelity",
    category: 'reflective'
  },
  {
    quote: "Use self-care practices to enhance your ability to regulate.",
    source: "Reflective Practice Fidelity",
    category: 'reflective'
  },

  // Emotional Process
  {
    quote: "Neurobiological regulation is central to processing and making meaning.",
    source: "Emotional Process Fidelity",
    category: 'emotional'
  },
  {
    quote: "Trauma involves an overwhelming and terrifying loss of control, putting people back into situations where they have no control recapitulates this and impedes recovery.",
    source: "Perry, via Child First",
    category: 'emotional'
  },
  {
    quote: "Tolerate caregiver's or child's strong emotional reactions without becoming dysregulated yourself.",
    source: "Emotional Process Fidelity",
    category: 'emotional'
  },
  {
    quote: "Co-regulation is key to returning to a healthier developmental trajectory.",
    source: "Emotional Process Fidelity",
    category: 'emotional'
  },

  // Dyadic Relational
  {
    quote: "Development occurs in the context of relationships.",
    source: "Dyadic Relational Fidelity",
    category: 'dyadic'
  },
  {
    quote: "The best predictor of child functioning is caregiver functioning.",
    source: "Child First Principle",
    category: 'dyadic'
  },
  {
    quote: "A primary objective of treatment is to restore the protective shield.",
    source: "Dyadic Relational Fidelity",
    category: 'dyadic'
  },
  {
    quote: "Try not to be a better caregiver than the caregiver.",
    source: "Dyadic Relational Fidelity",
    category: 'dyadic'
  },
  {
    quote: "Balance attention between caregiver and child.",
    source: "Dyadic Relational Fidelity",
    category: 'dyadic'
  },
  {
    quote: "Bridge and translate between caregiver and child—help them understand each other.",
    source: "Dyadic Relational Fidelity",
    category: 'dyadic'
  },
  {
    quote: "Intervene in ways that strengthen the caregiver-child relationship.",
    source: "Dyadic Relational Fidelity",
    category: 'dyadic'
  },

  // Trauma Framework
  {
    quote: "Try to understand the needs underlying dysregulated behavior.",
    source: "Trauma Framework",
    category: 'trauma'
  },
  {
    quote: "Do not target for change what you do not yet understand.",
    source: "Reflective Practice",
    category: 'trauma'
  },
  {
    quote: "Keep child's and caregiver's trauma history in mind at all times.",
    source: "Trauma Framework Fidelity",
    category: 'trauma'
  },
  {
    quote: "Frame interventions within the broader context of the family's traumatic experiences.",
    source: "Trauma Framework Fidelity",
    category: 'trauma'
  },
  {
    quote: "Think about how trauma histories may be affecting interactions between the dyad and with the Team.",
    source: "Trauma Framework Fidelity",
    category: 'trauma'
  },

  // Content Fidelity
  {
    quote: "Convey hope.",
    source: "Content Fidelity",
    category: 'content'
  },
  {
    quote: "Develop empathetic relationships with family members.",
    source: "Content Fidelity",
    category: 'content'
  },
  {
    quote: "Enhance safety.",
    source: "Content Fidelity",
    category: 'content'
  },
  {
    quote: "Strengthen family relationships through promoting emotional reciprocity.",
    source: "Content Fidelity",
    category: 'content'
  },
  {
    quote: "Enhance understanding of the meaning of behavior.",
    source: "Content Fidelity",
    category: 'content'
  },
  {
    quote: "Help the dyad differentiate between then and now.",
    source: "Content Fidelity",
    category: 'content'
  },
  {
    quote: "Help the dyad put the traumatic experience in perspective.",
    source: "Content Fidelity",
    category: 'content'
  },
  {
    quote: "Support child in returning to a normal developmental trajectory.",
    source: "Content Fidelity",
    category: 'content'
  },
  {
    quote: "Normalize the traumatic response.",
    source: "Content Fidelity",
    category: 'content'
  },

  // Procedural
  {
    quote: "Team debriefed together after each home visit.",
    source: "Procedural Fidelity",
    category: 'procedural'
  },
  {
    quote: "Reassess formulation after each session.",
    source: "Procedural Fidelity",
    category: 'procedural'
  },
  {
    quote: "Did not attempt to be 'better parent'.",
    source: "Home Visit Procedural Fidelity",
    category: 'procedural'
  },
  {
    quote: "Selected interventions that honor culture.",
    source: "Home Visit Procedural Fidelity",
    category: 'procedural'
  },

  // General
  {
    quote: "Parallel process: what happens in supervision mirrors what happens in treatment.",
    source: "Child First Supervision",
    category: 'general'
  },
  {
    quote: "Fidelity measures support ongoing assessment and allow us to determine effectiveness.",
    source: "Child First Fidelity",
    category: 'general'
  }
]

// Get a random quote
export function getRandomQuote(): WisdomQuote {
  return WISDOM_QUOTES[Math.floor(Math.random() * WISDOM_QUOTES.length)]
}

// Get a random quote from a specific category
export function getQuoteByCategory(category: WisdomQuote['category']): WisdomQuote {
  const categoryQuotes = WISDOM_QUOTES.filter(q => q.category === category)
  if (categoryQuotes.length === 0) return getRandomQuote()
  return categoryQuotes[Math.floor(Math.random() * categoryQuotes.length)]
}

// Get quote of the day (consistent for the same day)
export function getQuoteOfTheDay(): WisdomQuote {
  const today = new Date()
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000)
  return WISDOM_QUOTES[dayOfYear % WISDOM_QUOTES.length]
}

// Get multiple random quotes
export function getRandomQuotes(count: number): WisdomQuote[] {
  const shuffled = [...WISDOM_QUOTES].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}
