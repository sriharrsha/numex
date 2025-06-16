// Mock data for Business Name Generator
export const mockGeneratedNames = [
  {
    id: "1",
    name: "VitalCore Solutions",
    overallScore: 94,
    numerology: {
      pythagorean: {
        expression: 7,
        destiny: 7,
        meaning: "Spiritual seeker, analytical mind, perfect for consulting"
      },
      chaldean: {
        expression: 6,
        destiny: 6,
        meaning: "Nurturing, responsible, excellent for service businesses"
      },
      kabbalistic: {
        expression: 25,
        destiny: 7,
        meaning: "Divine wisdom, transformational energy"
      }
    },
    domainAvailability: {
      ".com": true,
      ".net": true,
      ".org": false,
      ".co": true,
      ".biz": true
    },
    trademark: {
      status: "clear",
      similarMarks: 0,
      riskLevel: "low"
    },
    entityCompliance: {
      LLC: true,
      Inc: true,
      Corp: true,
      conflicts: []
    }
  },
  {
    id: "2",
    name: "Quantum Dynamics",
    overallScore: 87,
    numerology: {
      pythagorean: {
        expression: 9,
        destiny: 9,
        meaning: "Universal consciousness, humanitarian, great for global ventures"
      },
      chaldean: {
        expression: 8,
        destiny: 8,
        meaning: "Material mastery, business acumen, perfect for corporations"
      },
      kabbalistic: {
        expression: 36,
        destiny: 9,
        meaning: "Cosmic awareness, innovative solutions"
      }
    },
    domainAvailability: {
      ".com": false,
      ".net": true,
      ".org": true,
      ".co": true,
      ".biz": false
    },
    trademark: {
      status: "similar",
      similarMarks: 2,
      riskLevel: "medium"
    },
    entityCompliance: {
      LLC: true,
      Inc: true,
      Corp: false,
      conflicts: ["Quantum" - regulated term in certain states]
    }
  },
  {
    id: "3",
    name: "Phoenix Ventures",
    overallScore: 91,
    numerology: {
      pythagorean: {
        expression: 3,
        destiny: 3,
        meaning: "Creative expression, communication, perfect for media/marketing"
      },
      chaldean: {
        expression: 1,
        destiny: 1,
        meaning: "Leadership, pioneering spirit, excellent for startups"
      },
      kabbalistic: {
        expression: 21,
        destiny: 3,
        meaning: "Crown of creation, success in all endeavors"
      }
    },
    domainAvailability: {
      ".com": true,
      ".net": false,
      ".org": true,
      ".co": true,
      ".biz": true
    },
    trademark: {
      status: "clear",
      similarMarks: 1,
      riskLevel: "low"
    },
    entityCompliance: {
      LLC: true,
      Inc: true,
      Corp: true,
      conflicts: []
    }
  }
];

export const mockFounderAnalysis = {
  name: "John Smith",
  birthdate: "1985-03-15",
  numerology: {
    pythagorean: {
      lifePathNumber: 5,
      expressionNumber: 6,
      meaning: "Freedom seeker with nurturing tendencies"
    },
    chaldean: {
      lifePathNumber: 4,
      expressionNumber: 7,
      meaning: "Practical mystic, builds lasting foundations"
    },
    kabbalistic: {
      lifePathNumber: 14,
      expressionNumber: 33,
      meaning: "Master teacher, humanitarian mission"
    }
  },
  compatibility: {
    "VitalCore Solutions": 95,
    "Quantum Dynamics": 78,
    "Phoenix Ventures": 89
  }
};

export const mockOptimalDates = [
  {
    date: "2025-07-23",
    numerologyValue: 7,
    compatibility: 96,
    energyType: "Spiritual Growth",
    description: "Perfect alignment with business energy and founder's path",
    dayOfWeek: "Wednesday",
    planetaryInfluence: "Mercury - Communication & Business"
  },
  {
    date: "2025-08-14",
    numerologyValue: 3,
    compatibility: 91,
    energyType: "Creative Expression",
    description: "Excellent for creative and communication-based ventures",
    dayOfWeek: "Thursday",
    planetaryInfluence: "Jupiter - Expansion & Growth"
  },
  {
    date: "2025-09-06",
    numerologyValue: 6,
    compatibility: 88,
    energyType: "Service & Responsibility",
    description: "Ideal for service-oriented businesses and partnerships",
    dayOfWeek: "Saturday",
    planetaryInfluence: "Saturn - Structure & Discipline"
  }
];

export const usStates = [
  { code: "AL", name: "Alabama" },
  { code: "AK", name: "Alaska" },
  { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" },
  { code: "CA", name: "California" },
  { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" },
  { code: "DE", name: "Delaware" },
  { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" },
  { code: "HI", name: "Hawaii" },
  { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" },
  { code: "IN", name: "Indiana" },
  { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" },
  { code: "KY", name: "Kentucky" },
  { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" },
  { code: "MD", name: "Maryland" },
  { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" },
  { code: "MN", name: "Minnesota" },
  { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" },
  { code: "MT", name: "Montana" },
  { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" },
  { code: "NH", name: "New Hampshire" },
  { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" },
  { code: "NY", name: "New York" },
  { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" },
  { code: "OH", name: "Ohio" },
  { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" },
  { code: "PA", name: "Pennsylvania" },
  { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" },
  { code: "SD", name: "South Dakota" },
  { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" },
  { code: "UT", name: "Utah" },
  { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" },
  { code: "WA", name: "Washington" },
  { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" },
  { code: "WY", name: "Wyoming" }
];

export const industries = [
  "Technology",
  "Healthcare",
  "Finance",
  "Retail",
  "Manufacturing",
  "Consulting",
  "Real Estate",
  "Food & Beverage",
  "Education",
  "Entertainment",
  "Transportation",
  "Energy",
  "Agriculture",
  "Construction",
  "Marketing & Advertising",
  "Professional Services",
  "E-commerce",
  "SaaS",
  "Biotechnology",
  "Other"
];

export const entityTypes = [
  { value: "LLC", label: "Limited Liability Company (LLC)" },
  { value: "Inc", label: "C-Corporation (Inc)" },
  { value: "Corp", label: "C-Corporation (Corp)" },
  { value: "S-Corp", label: "S-Corporation" },
  { value: "LLP", label: "Limited Liability Partnership (LLP)" },
  { value: "LP", label: "Limited Partnership (LP)" },
  { value: "PC", label: "Professional Corporation (PC)" },
  { value: "PLLC", label: "Professional Limited Liability Company (PLLC)" }
];