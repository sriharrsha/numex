// @ts-check
// Supabase function: generate-names

console.log("generate-names function cold start");

// --- Numerology Logic (adapted from previous numerology.js) ---
const PYTHAGOREAN = {
    'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8, 'I': 9,
    'J': 1, 'K': 2, 'L': 3, 'M': 4, 'N': 5, 'O': 6, 'P': 7, 'Q': 8, 'R': 9,
    'S': 1, 'T': 2, 'U': 3, 'V': 4, 'W': 5, 'X': 6, 'Y': 7, 'Z': 8
};
const CHALDEAN = { /* ... (same as before) ... */ 
    'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 8, 'G': 3, 'H': 5, 'I': 1,
    'J': 1, 'K': 2, 'L': 3, 'M': 4, 'N': 5, 'O': 7, 'P': 8, 'Q': 1, 'R': 2,
    'S': 3, 'T': 4, 'U': 6, 'V': 6, 'W': 6, 'X': 5, 'Y': 1, 'Z': 7
};
const KABBALISTIC = { /* ... (same as before) ... */ 
    'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8, 'I': 9,
    'J': 10, 'K': 11, 'L': 12, 'M': 13, 'N': 14, 'O': 15, 'P': 16, 'Q': 17, 'R': 18,
    'S': 19, 'T': 20, 'U': 21, 'V': 22, 'W': 23, 'X': 24, 'Y': 25, 'Z': 26
};
const MASTER_NUMBERS = new Set([11, 22, 33, 44, 55, 66, 77, 88, 99]);
const MEANINGS = { /* ... (same as before) ... */ 
    1: "Leadership, independence, pioneering spirit", 2: "Cooperation, partnerships, diplomacy",
    3: "Creativity, communication, artistic expression", 4: "Stability, hard work, practical foundation",
    5: "Freedom, adventure, dynamic change", 6: "Nurturing, responsibility, home and family",
    7: "Spirituality, introspection, mystical wisdom", 8: "Material success, authority, business acumen",
    9: "Universal love, humanitarian service, completion", 11: "Intuition, inspiration, spiritual messenger",
    22: "Master builder, large-scale achievement", 33: "Master teacher, spiritual uplifment of humanity"
};

function cleanName(name) { return name.replace(/[^A-Za-z]/g, '').toUpperCase(); }
function reduceToSingleDigit(number, allowMaster = true) { /* ... (same as before) ... */ 
    if (allowMaster && MASTER_NUMBERS.has(number)) return number;
    while (number > 9) {
        number = String(number).split('').reduce((sum, digit) => sum + parseInt(digit), 0);
        if (allowMaster && MASTER_NUMBERS.has(number)) break;
    }
    return number;
}
function calculateHarmonyScore(name, system, kabbalistic = false) { /* ... (same as before) ... */
    if (!name) return 0.0;
    const values = name.split('').map(char => system[char] || 0);
    const avgValue = values.reduce((sum, val) => sum + val, 0) / values.length;
    const baseScore = Math.min(avgValue / (kabbalistic ? 26 : 9), 1.0) * 5;
    const uniqueValues = new Set(values).size;
    const balanceBonus = Math.min(uniqueValues / values.length, 0.5) * 2;
    let flowScore = 0;
    if (values.length > 1) {
        const transitions = [];
        for (let i = 1; i < values.length; i++) { transitions.push(Math.abs(values[i] - values[i - 1])); }
        const avgTransition = transitions.reduce((sum, val) => sum + val, 0) / transitions.length;
        const maxPossible = kabbalistic ? 25 : 8;
        flowScore = Math.max(0, (maxPossible - avgTransition) / maxPossible) * 3;
    }
    const totalScore = baseScore + balanceBonus + flowScore;
    return Math.min(totalScore, 10.0);
}
function calculatePythagorean(name) { /* ... (same as before) ... */ 
    const cleanedName = cleanName(name);
    const total = cleanedName.split('').reduce((sum, char) => sum + (PYTHAGOREAN[char] || 0), 0);
    const destiny = reduceToSingleDigit(total);
    const harmonyScore = calculateHarmonyScore(cleanedName, PYTHAGOREAN);
    return { expression: total, destiny: destiny, meaning: MEANINGS[destiny] || "Unique energy pattern", harmonyScore: parseFloat(harmonyScore.toFixed(1)) };
}
function calculateChaldean(name) { /* ... (same as before) ... */ 
    const cleanedName = cleanName(name);
    const total = cleanedName.split('').reduce((sum, char) => sum + (CHALDEAN[char] || 0), 0);
    const destiny = reduceToSingleDigit(total);
    const harmonyScore = calculateHarmonyScore(cleanedName, CHALDEAN);
    return { expression: total, destiny: destiny, meaning: MEANINGS[destiny] || "Unique energy pattern", harmonyScore: parseFloat(harmonyScore.toFixed(1)) };
}
function calculateKabbalistic(name) { /* ... (same as before) ... */ 
    const cleanedName = cleanName(name);
    const total = cleanedName.split('').reduce((sum, char) => sum + (KABBALISTIC[char] || 0), 0);
    const destiny = reduceToSingleDigit(total);
    const harmonyScore = calculateHarmonyScore(cleanedName, KABBALISTIC, true);
    return { expression: total, destiny: destiny, meaning: MEANINGS[destiny] || "Unique energy pattern", harmonyScore: parseFloat(harmonyScore.toFixed(1)) };
}
function calculateLifePath(birthDateStr) { /* ... (same as before) ... */ 
    try {
        const [year, month, day] = birthDateStr.split('-').map(Number);
        const dayReduced = reduceToSingleDigit(day);
        const monthReduced = reduceToSingleDigit(month);
        const yearReduced = reduceToSingleDigit(year);
        const total = dayReduced + monthReduced + yearReduced;
        return reduceToSingleDigit(total);
    } catch (e) { return 1; }
}
function calculateFounderNumerology(name, birthdateStr) { /* ... (same as before) ... */ 
    const lifePath = calculateLifePath(birthdateStr);
    return { pythagorean: { ...calculatePythagorean(name), lifePathNumber: lifePath }, chaldean: { ...calculateChaldean(name), lifePathNumber: reduceToSingleDigit(lifePath) }, kabbalistic: { ...calculateKabbalistic(name), lifePathNumber: lifePath } };
}
function calculateNameCompatibility(businessName, founderName, birthdateStr) { /* ... (same as before) ... */
    const businessNum = calculatePythagorean(businessName);
    const founderNum = calculateFounderNumerology(founderName, birthdateStr);
    const businessDestiny = businessNum.destiny;
    const founderDestiny = founderNum.pythagorean.destiny;
    let compatibility;
    const difference = Math.abs(businessDestiny - founderDestiny);
    if (difference === 0) compatibility = 100;
    else if (difference <= 2) compatibility = 90 - (difference * 5);
    else if (difference <= 4) compatibility = 80 - (difference * 3);
    else compatibility = 70 - (difference * 2);
    const complementaryPairs = [[1, 8], [2, 7], [3, 6], [4, 5]];
    for (const pair of complementaryPairs) { if ((businessDestiny === pair[0] && founderDestiny === pair[1]) || (businessDestiny === pair[1] && founderDestiny === pair[0])) { compatibility += 10; } }
    return Math.min(compatibility, 100);
}
function calculateOptimalDates(businessName, founderBirthdateStr) { /* ... (same as before, ensure Date and toLocaleDateString are Deno compatible or adjusted) ... */
    const businessNumDestiny = calculatePythagorean(businessName).destiny;
    const founderLifePath = calculateLifePath(founderBirthdateStr);
    const optimalDates = [];
    const today = new Date(); // Deno supports new Date()
    const energyTypes = { 1: "Leadership & New Beginnings", /* ... */ };
    const planetaryInfluences = { 1: "Sun - Leadership & Vitality", /* ... */ };

    for (let daysAhead = 30; daysAhead <= 90; daysAhead++) {
        const checkDate = new Date(today);
        checkDate.setDate(today.getDate() + daysAhead);
        const checkDateStr = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`;
        const dateNumerology = calculateLifePath(checkDateStr);
        const businessCompat = 100 - Math.abs(businessNumDestiny - dateNumerology) * 10;
        const founderCompat = 100 - Math.abs(founderLifePath - dateNumerology) * 10;
        const overallCompat = (businessCompat + founderCompat) / 2;
        if (overallCompat >= 85) {
            optimalDates.push({
                date: checkDateStr, numerologyValue: dateNumerology, compatibility: Math.floor(overallCompat),
                energyType: energyTypes[dateNumerology] || "Unique Energy",
                description: `Excellent alignment...`, // Simplified
                dayOfWeek: checkDate.toLocaleDateString('en-US', { weekday: 'long' }), // Deno supports toLocaleDateString
                planetaryInfluence: planetaryInfluences[dateNumerology] || "Universal Energy"
            });
        }
    }
    optimalDates.sort((a, b) => b.compatibility - a.compatibility);
    return optimalDates.slice(0, 3);
}
// --- End Numerology Logic ---

// --- Gemini Service (to be adapted to use fetch with Gemini REST API) ---
async function generateNamesWithGemini(requestData) {
    console.log("Attempting to generate names with Gemini...");
    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) {
        console.error("GEMINI_API_KEY is not set.");
        return ["GeminiFallback1", "GeminiFallback2"]; // Fallback
    }

    const GEMINI_API_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    
    // Simplified prompt creation from previous geminiService.js
    const { num_suggestions = 10, industry = 'general', business_description = 'a new venture' } = requestData;
    const promptText = `Generate ${num_suggestions} creative business names for a ${industry} company. Business description: ${business_description}. Return as a JSON array of strings.`;

    try {
        const response = await fetch(GEMINI_API_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: promptText }] }],
                generationConfig: { temperature: 0.9, topP: 0.95, topK: 40, maxOutputTokens: 1024 }
            })
        });
        if (!response.ok) {
            const errorBody = await response.text();
            console.error(`Gemini API error: ${response.status}`, errorBody);
            return ["GeminiErrorFallback1", "GeminiErrorFallback2"];
        }
        const data = await response.json();
        // Basic parsing, assuming response structure like { candidates: [{ content: { parts: [{ text: "[\"Name1\", \"Name2\"]" }] } }] }
        const jsonResponseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (jsonResponseText) {
            return JSON.parse(jsonResponseText);
        }
        return ["GeminiParseFallback"];
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        return ["GeminiCatchFallback"];
    }
}
// --- End Gemini Service ---

// --- Domain Service (adapted from previous domainService.js) ---
const DOMAIN_SCORES = {
    '.com': 25, '.net': 3, '.org': 2, '.co': 2, '.io': 2, '.biz': 1, '.us': 1
};
const RAPIDAPI_HOST_DOMAINR = 'domainr.p.rapidapi.com';

function cleanDomainNameForApi(businessName) {
    let cleanName = businessName.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (cleanName && !/^[a-z]/.test(cleanName)) {
        cleanName = 'a' + cleanName;
    }
    return cleanName.substring(0, 63);
}

function getDomainPriority(tld) {
    if (tld === '.com') return 'highest';
    if (['.net', '.org'].includes(tld)) return 'high';
    if (['.co', '.io'].includes(tld)) return 'medium';
    return 'low';
}

function getFallbackDomainData() {
    const fallbackResults = {};
    let totalScore = 0;
    const availableFallbacks = ['.com', '.net', '.co', '.biz'];
    for (const tld in DOMAIN_SCORES) {
        const score = DOMAIN_SCORES[tld];
        const available = availableFallbacks.includes(tld);
        const domainScore = available ? score : 0;
        fallbackResults[tld] = { available, value: domainScore, priority: getDomainPriority(tld) };
        totalScore += domainScore;
    }
    return { domains: fallbackResults, totalScore, maxPossibleScore: Object.values(DOMAIN_SCORES).reduce((sum, s) => sum + s, 0) };
}

async function checkSingleDomain(domain, tld, apiKey) {
    const url = `https://${RAPIDAPI_HOST_DOMAINR}/v2/search?query=${encodeURIComponent(domain)}`; // Added encodeURIComponent
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'x-rapidapi-host': RAPIDAPI_HOST_DOMAINR,
                'x-rapidapi-key': apiKey
            }
        });
        if (response.ok) {
            const data = await response.json();
            let available = true; 
            if (data.results && data.results.length > 0) {
                 const domainEntry = data.results.find(r => r.domain && r.domain.toLowerCase() === domain.toLowerCase());
                 if (domainEntry) {
                    available = ['available', 'maybe'].includes(domainEntry.status);
                 }
            }
            return { tld, domain, available };
        } else {
            console.warn(`Domainr API returned status ${response.status} for ${domain}. Body: ${await response.text()}`);
            return { tld, domain, available: false };
        }
    } catch (e) {
        console.error(`Error checking Domainr for ${domain}:`, e);
        return { tld, domain, available: false };
    }
}

async function checkDomainAvailability(businessName) {
    console.log(`Domain check for: ${businessName}`);
    const apiKey = Deno.env.get("RAPIDAPI_KEY");
    if (!apiKey) {
        console.error("RAPIDAPI_KEY not set for DomainService.");
        return getFallbackDomainData();
    }

    const domainBase = cleanDomainNameForApi(businessName);
    const availabilityResults = {};
    let totalScore = 0;

    const tasks = Object.keys(DOMAIN_SCORES).map(tld => {
        const domain = `${domainBase}${tld}`;
        return checkSingleDomain(domain, tld, apiKey);
    });

    try {
        const results = await Promise.all(tasks);
        results.forEach(result => {
            if (result) {
                const { tld, available } = result;
                const scoreValue = DOMAIN_SCORES[tld];
                const currentScore = available ? scoreValue : 0;
                availabilityResults[tld] = {
                    available,
                    value: currentScore,
                    priority: getDomainPriority(tld)
                };
                totalScore += currentScore;
            }
        });
        return {
            domains: availabilityResults,
            totalScore,
            maxPossibleScore: Object.values(DOMAIN_SCORES).reduce((sum, s) => sum + s, 0)
        };
    } catch (e) {
        console.error("Error in checkDomainAvailability aggregation:", e);
        return getFallbackDomainData();
    }
}
// --- End Domain Service ---

// --- Trademark Service (adapted from previous trademarkService.js) ---
const RAPIDAPI_HOST_USPTO = 'uspto-trademark.p.rapidapi.com';

function cleanTrademarkNameForApi(businessName) {
    const suffixes = ['LLC', 'Inc', 'Corp', 'Corporation', 'Company', 'Co', 'Ltd', 'Limited'];
    let cleanName = businessName;
    suffixes.forEach(suffix => {
        cleanName = cleanName.replace(new RegExp(`\\b${suffix}\\b`, 'gi'), '');
    });
    cleanName = cleanName.replace(/[^a-zA-Z0-9\s]/g, '').trim();
    return cleanName.replace(/\s+/g, ' '); // Normalize whitespace
}

function generateTrademarkSearchVariations(searchTerm) {
    const variations = new Set();
    const words = searchTerm.split(' ');
    words.forEach(word => {
        if (word.length > 3) variations.add(word);
    });
    if (words.length > 1) {
        for (let i = 0; i < words.length - 1; i++) {
            variations.add(`${words[i]} ${words[i+1]}`);
        }
    }
    return Array.from(variations);
}

function calculateStringsSimilarity(term1, term2) {
    term1 = term1.toLowerCase();
    term2 = term2.toLowerCase();
    if (term1 === term2) return 1.0;
    const set1 = new Set(term1.split(''));
    const set2 = new Set(term2.split(''));
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    return union.size === 0 ? 0 : intersection.size / union.size;
}

function getFallbackTrademarkData() {
    return {
        status: 'unknown', similarMarks: 0, riskLevel: 'unknown', score: 15,
        details: { exactMatch: { available: true, details: 'API unavailable' }, similarMarksFound: [], searchTerm: 'unknown' }
    };
}

async function checkSingleTrademarkVariation(searchTermVariation, apiKey) {
    const url = `https://${RAPIDAPI_HOST_USPTO}/v1/trademarkAvailable/${encodeURIComponent(searchTermVariation)}`;
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'x-rapidapi-host': RAPIDAPI_HOST_USPTO,
                'x-rapidapi-key': apiKey
            }
        });
        if (response.ok) {
            const data = await response.json();
            let available = true; let details = 'Trademark check completed'; let apiStatus = '';
            if (typeof data === 'object' && data !== null) {
                // USPTO API specific logic: 'available: false' means a direct conflict.
                // If 'available' is true or not present, it might mean no direct exact match, but similar could exist.
                // The API structure might be: { "available": false, "trademark": "...", ... } or { "available": true }
                available = data.available !== undefined ? data.available : true; // Default to available if field is missing
                
                // Further checks if needed based on API response structure
                if (data.trademark || (data.registrations && data.registrations.length > 0)) {
                     available = false; // Explicitly set if trademark data is present
                }
                apiStatus = data.status ? String(data.status).toLowerCase() : '';
                if (apiStatus.includes('registered') || apiStatus.includes('pending')) {
                    available = false;
                }
                details = data.description || `Checked: ${searchTermVariation}`;
            }
            return { available, details, status: apiStatus };
        } else {
            console.warn(`USPTO API returned status ${response.status} for ${searchTermVariation}. Body: ${await response.text()}`);
            return { available: true, details: 'API error, assuming available' }; // Fallback on API error
        }
    } catch (e) {
        console.error(`Error checking USPTO for ${searchTermVariation}:`, e);
        return { available: true, details: 'Check failed, assuming available' }; // Fallback on fetch error
    }
}

function assessTrademarkRisk(exactResult, similarResults) {
    if (exactResult && !exactResult.available) { // If exact match is NOT available (i.e., it's taken)
        return { status: 'conflict', risk_level: 'high', score: 0 };
    }
    // If exact match IS available, then check similar ones.
    // similarResults contains items that were NOT available (conflicts)
    const highSimilarityConflicts = similarResults.filter(mark => mark.similarity > 0.7).length;
    
    if (highSimilarityConflicts > 0) {
        return { status: 'similar', risk_level: 'medium', score: 12 };
    } else if (similarResults.length > 0) { // Any other similar conflicting mark
        return { status: 'caution', risk_level: 'low', score: 16 };
    }
    return { status: 'clear', risk_level: 'low', score: 20 }; // No exact and no similar conflicts
}

async function checkTrademark(businessName, industry = "") { // Renamed from checkTrademarkAvailability for clarity
    console.log(`Trademark check for: ${businessName}, industry: ${industry}`);
    const apiKey = Deno.env.get("RAPIDAPI_KEY");
    if (!apiKey) {
        console.error("RAPIDAPI_KEY not set for TrademarkService.");
        return getFallbackTrademarkData();
    }

    const searchTerm = cleanTrademarkNameForApi(businessName);
    try {
        const exactResult = await checkSingleTrademarkVariation(searchTerm, apiKey);

        let similarConflictingMarks = [];
        if (exactResult.available) { // Only check variations if exact is available
            const variations = generateTrademarkSearchVariations(searchTerm);
            const similarCheckTasks = variations.slice(0, 3).map(variation => // Limit API calls
                checkSingleTrademarkVariation(variation, apiKey).then(result => {
                    if (result && !result.available) { // Found a conflicting similar mark
                        return { term: variation, similarity: calculateStringsSimilarity(searchTerm, variation), details: result.details || 'Similar trademark found' };
                    }
                    return null;
                })
            );
            const similarResultsRaw = await Promise.all(similarCheckTasks);
            similarConflictingMarks = similarResultsRaw.filter(r => r !== null);
        }
        
        const riskAssessment = assessTrademarkRisk(exactResult, similarConflictingMarks);

        return {
            status: riskAssessment.status, 
            similarMarks: similarConflictingMarks.length, // Number of conflicting similar marks
            riskLevel: riskAssessment.risk_level, 
            score: riskAssessment.score,
            details: { 
                exactMatch: exactResult, 
                similarMarksFound: similarConflictingMarks.slice(0, 5), // Show details of conflicting ones
                searchTerm: searchTerm 
            }
        };
    } catch (e) {
        console.error("Error in checkTrademark processing:", e);
        return getFallbackTrademarkData();
    }
}
// --- End Trademark Service ---

// --- Main Orchestration (adapted from businessNameService.js) ---
async function analyzeSingleName(name, requestData, index) {
    // Simplified version of the previous analyzeSingleName
    const numerologyPythagorean = calculatePythagorean(name);
    const numerologyChaldean = calculateChaldean(name);
    const numerologyKabbalistic = calculateKabbalistic(name);
    const overallHarmony = parseFloat(((numerologyPythagorean.harmonyScore + numerologyChaldean.harmonyScore + numerologyKabbalistic.harmonyScore) / 3).toFixed(1));
    
    const domainResult = await checkDomainAvailability(name);
    const trademarkResult = await checkTrademark(name, requestData.industry);

    // Simplified entity compliance
    const entityCompliance = { conflicts: [], score: 8, LLC: true, Inc: true }; 

    const scoreBreakdown = {
        numerology: Math.min(Math.floor(overallHarmony * 4), 40),
        domains: domainResult.totalScore || 0,
        trademark: trademarkResult.score || 15,
        entity: entityCompliance.score || 8
    };
    const overallScore = Object.values(scoreBreakdown).reduce((sum, val) => sum + val, 0);

    return {
        id: String(index),
        name: name,
        overallScore: Math.min(overallScore, 100),
        scoreBreakdown,
        numerology: { 
            pythagorean: numerologyPythagorean, 
            chaldean: numerologyChaldean, 
            kabbalistic: numerologyKabbalistic,
            overallHarmony: overallHarmony
        },
        domainAvailability: domainResult.domains || {},
        domainScore: domainResult.totalScore || 0,
        trademark: trademarkResult,
        entityCompliance
    };
}

// --- Request Handler ---
export default async (req) => {
  console.log("generate-names function invoked, method:", req.method);

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*', // Be more specific in production
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: `Method ${req.method} Not Allowed` }), {
      headers: { "Content-Type": "application/json", 'Access-Control-Allow-Origin': '*' },
      status: 405,
    });
  }

  try {
    const requestData = await req.json();
    console.log("Request data:", requestData);

    // Basic validation (can be expanded)
    if (!requestData.business_description || !requestData.industry) {
      return new Response(JSON.stringify({ error: "Missing business_description or industry" }), {
        headers: { "Content-Type": "application/json", 'Access-Control-Allow-Origin': '*' },
        status: 400,
      });
    }

    const generatedNamesRaw = await generateNamesWithGemini(requestData);
    if (!generatedNamesRaw || generatedNamesRaw.length === 0) {
        throw new Error("Failed to generate names from Gemini AI service");
    }

    const analysisTasks = generatedNamesRaw.map((name, i) => analyzeSingleName(name, requestData, i + 1));
    // Promise.all for concurrent execution (Deno handles concurrency well)
    const analyzedNames = await Promise.all(analysisTasks);

    let founderAnalysis = null;
    if (requestData.founder_name && requestData.founder_birthdate) {
        const founderNumerology = calculateFounderNumerology(requestData.founder_name, requestData.founder_birthdate);
        const compatibility = {};
        analyzedNames.forEach(nameData => {
            compatibility[nameData.name] = calculateNameCompatibility(
                nameData.name, requestData.founder_name, requestData.founder_birthdate
            );
        });
        founderAnalysis = {
            name: requestData.founder_name,
            birthdate: requestData.founder_birthdate,
            numerology: founderNumerology,
            compatibility
        };
    }

    let optimalDates = [];
    if (analyzedNames.length > 0 && requestData.founder_birthdate) {
        try {
            const bestName = analyzedNames.reduce((max, name) => (name.overallScore > max.overallScore ? name : max), analyzedNames[0]);
            optimalDates = calculateOptimalDates(bestName.name, requestData.founder_birthdate);
        } catch (e) { console.error("Error calculating optimal dates:", e); }
    }

    analyzedNames.sort((a, b) => (b.overallScore || 0) - (a.overallScore || 0));

    const result = {
        names: analyzedNames,
        founderAnalysis,
        optimalDates,
        metadata: {
            generatedAt: new Date().toISOString(),
            totalNames: analyzedNames.length,
            requestId: crypto.randomUUID(), // Deno's built-in UUID
            sessionId: crypto.randomUUID(), // Using for session too
            requestData // Echo back the request data
        }
    };

    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json", 'Access-Control-Allow-Origin': '*' },
      status: 200,
    });

  } catch (error) {
    console.error("Error in generate-names function:", error.message, error.stack);
    return new Response(JSON.stringify({ error: "Failed to generate business names", detail: error.message }), {
      headers: { "Content-Type": "application/json", 'Access-Control-Allow-Origin': '*' },
      status: 500,
    });
  }
};
