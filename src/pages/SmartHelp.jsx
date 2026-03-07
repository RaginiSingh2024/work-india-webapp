import { useState, useRef, useEffect } from 'react'

// ─── Language Content ──────────────────────────────────────────────────────────
// ─── Language & Role Content ──────────────────────────────────────────────────
const CONTENT = {
    jobseeker: {
        en: {
            welcome: "Namaste! 👋 Welcome to **WorkIndia Smart Help AI**.\n\nI can help you:\n💼 **Find job opportunities** matching your skills\n🏠 **Book home services** nearby\n📞 **Get contact details** of employers\n💰 **Check service pricing**\n\nWhat would you like to do today?",
            quickPrompts: [
                { label: '💼 Electrician jobs', value: 'I need an electrician job' },
                { label: '💼 Plumber jobs', value: 'Find plumber jobs' },
                { label: '� Driver jobs', value: 'Show driver jobs' },
                { label: '🔧 Book a plumber', value: 'Book a plumber for my home' },
                { label: '� Service pricing', value: 'What are the prices for all services?' },
            ],
            placeholder: 'Try "Find electrician jobs" or "Show driver openings"...',
            capabilities: ['Find Jobs', 'Book Services', 'Get Contacts'],
        },
        hi: {
            welcome: "नमस्ते! 👋 **वर्कइंडिया स्मार्ट हेल्प AI** में आपका स्वागत है।\n\nनमस्ते! कृपया एक ही संदेश में अपना नाम, काम, अपेक्षित वेतन और शहर बताएं।\n\nHi! I'm your Smart Help AI 🤖\nPlease tell me your name, profession, expected salary, and city in ONE single message. (e.g. 'I am Amit, Plumber, expecting 25k in Mumbai')",
            quickPrompts: [
                { label: '� इलेक्ट्रीशियन नौकरी', value: 'मुझे इलेक्ट्रीशियन की नौकरी चाहिए' },
                { label: '💼 प्लंबर नौकरी', value: 'प्लंबर की नौकरी खोजें' },
                { label: '💼 ड्राइवर नौकरी', value: 'ड्राइवर की नौकरी दिखाएं' },
                { label: '💰 सेवा मूल्य', value: 'सभी सेवाओं की दरें क्या हैं?' },
                { label: '🏠 प्लंबर बुक करें', value: 'मुझे घर के लिए प्लंबर चाहिए' },
            ],
            placeholder: 'e.g. मुझे इलेक्ट्रीशियन की नौकरी चाहिए...',
            capabilities: ['नौकरियां खोजें', 'सेवाएं बुक करें', 'संपर्क प्राप्त करें'],
        }
    },
    provider: {
        en: {
            welcome: "Namaste! 👋 Welcome to **WorkIndia Smart Help AI for Employers**.\n\nI can help you:\n👷 **Hire skilled workers** — electricians, plumbers, drivers & more\n📞 **Get contact details** of available professionals\n📊 **Check market salary rates** for hiring\n\nWho are you looking to hire today?",
            quickPrompts: [
                { label: '👷 Hire electricians', value: 'List available electricians' },
                { label: '👷 Hire plumbers', value: 'Show available plumbers' },
                { label: '👷 Hire drivers', value: 'Find me a driver' },
                { label: '📊 Market rates', value: 'What are the market rates for hiring?' },
                { label: '🔧 Service pricing', value: 'What are the service booking prices?' },
            ],
            placeholder: 'Try "List available electricians" or "Find a plumber to hire"...',
            capabilities: ['Hire Workers', 'Get Contacts', 'Salary Trends'],
        },
        hi: {
            welcome: "नमस्ते! 👋 **वर्कइंडिया स्मार्ट हेल्प AI (नियोक्ता के लिए)** में आपका स्वागत है।\n\nमैं आपकी मदद कर सकता हूँ:\n👷 **कुशल कर्मचारी खोजें** — इलेक्ट्रीशियन, प्लंबर, ड्राइवर आदि\n📞 **प्रोफेशनल्स के संपर्क** प्राप्त करें\n📊 **बाज़ार वेतन दरों** की जांच करें\n\nआज आप किसे काम पर रखना चाहते हैं?",
            quickPrompts: [
                { label: '👷 इलेक्ट्रीशियन खोजें', value: 'इलेक्ट्रीशियन की लिस्ट दिखाएं' },
                { label: '👷 प्लंबर खोजें', value: 'उपलब्ध प्लंबर दिखाएं' },
                { label: '👷 ड्राइवर खोजें', value: 'मुझे ड्राइवर चाहिए' },
                { label: '📊 मार्केट रेट', value: 'भर्ती के लिए बाज़ार दरें क्या हैं?' },
            ],
            placeholder: 'e.g. इलेक्ट्रीशियन की लिस्ट दिखाएं...',
            capabilities: ['कर्मचारी खोजें', 'संपर्क प्राप्त करें', 'वेतन रुझान'],
        }
    }
}

// Fixed Shared UI Text
const UI_TEXT = {
    en: {
        clearBtn: 'Clear',
        assistantTitle: 'WorkIndia Smart Help AI',
        onlineStatus: 'Online — responds instantly',
    },
    hi: {
        clearBtn: 'साफ़ करें',
        assistantTitle: 'वर्कइंडिया स्मार्ट हेल्प AI',
        onlineStatus: 'ऑनलाइन — तुरंत जवाब देता है',
    }
}

// ─── Helpers ───────────────────────────────────────────────────────────────────
const isHindiText = (text) => /[\u0900-\u097F]/.test(text)

// ─── DATA ────────────────────────────────────────────────────────────────────

const SERVICES = [
    {
        key: 'plumber',
        label: 'Plumber',
        emoji: '🔧',
        price: '₹200 - ₹350/hr',
        keywords: ['plumber', 'plumber job', 'plumbing', 'leak', 'pipe', 'tap', 'toilet', 'drain', 'water', 'plumbar', 'plumber near me'],
    },
    {
        key: 'electrician',
        label: 'Electrician',
        emoji: '⚡',
        price: '₹250 - ₹400/hr',
        keywords: ['electrician', 'electricians', 'electric', 'wiring', 'light', 'fan', 'switch', 'power', 'socket', 'elctrician', 'electrition', 'electrisian', 'electrician job'],
    },
    {
        key: 'driver',
        label: 'Driver',
        emoji: '🚗',
        price: '₹150 - ₹250/hr',
        keywords: ['driver', 'driving', 'car', 'chauffeur', 'cab', 'drive', 'dryver', 'driver job'],
    },
    {
        key: 'carpenter',
        label: 'Carpenter',
        emoji: '🪚',
        price: '₹180 - ₹300/hr',
        keywords: ['carpenter', 'carpentry', 'furniture', 'door', 'wood', 'table', 'chair', 'bed', 'cabinet', 'carpentar', 'carpenter job'],
    },
    {
        key: 'ac',
        label: 'AC Technician',
        emoji: '❄️',
        price: '₹300 - ₹500/hr',
        keywords: ['ac', 'air conditioner', 'air conditioning', 'cooling', 'ac repair', 'ac service', 'gas refill'],
    },
    {
        key: 'painter',
        label: 'Painter',
        emoji: '🖌️',
        price: '₹150 - ₹250/hr',
        keywords: ['painter', 'paint', 'painting', 'wall', 'color', 'interior', 'exterior', 'putty'],
    },
    {
        key: 'cleaning',
        label: 'Home Cleaner',
        emoji: '🧹',
        price: '₹120 - ₹200/hr',
        keywords: ['cleaning', 'clean', 'cleaner', 'deep clean', 'sweep', 'mop', 'maid', 'sofa', 'sanitise'],
    },
]

const JOB_LISTINGS = [
    // Electrician
    { id: 'E1', category: 'electrician', title: 'Senior Electrician', company: 'PowerPro Experts', location: 'Bangalore', desc: 'Looking for an experienced electrician for residential wiring and panel installation.', salary: '₹300 - ₹450/hr' },
    { id: 'E2', category: 'electrician', title: 'Maintenance Electrician', company: 'City Mall Corp', location: 'Mumbai', desc: 'Full-time electrician needed for daily maintenance of mall lighting and power systems.', salary: '₹250 - ₹350/hr' },
    { id: 'E3', category: 'electrician', title: 'Apprentice Electrician', company: 'VoltTech Solutions', location: 'Delhi', desc: 'Great opportunity for freshers to learn commercial wiring and AC installations.', salary: '₹150 - ₹200/hr' },
    { id: 'E4', category: 'electrician', title: 'Industrial Electrician', company: 'Steel Works Ltd', location: 'Hyderabad', desc: 'Urgent requirement for heavy machinery electrical maintenance.', salary: '₹400 - ₹600/hr' },

    // Plumber
    { id: 'P1', category: 'plumber', title: 'Expert Plumber', company: 'QuickFix Services', location: 'Bangalore', desc: 'Need a plumber for pipeline repairs, bathroom fittings, and leak fixes.', salary: '₹200 - ₹300/hr' },
    { id: 'P2', category: 'plumber', title: 'Commercial Plumber', company: 'AquaTech Builders', location: 'Chennai', desc: 'Looking for a plumber for a new commercial building project.', salary: '₹350 - ₹500/hr' },
    { id: 'P3', category: 'plumber', title: 'Maintenance Plumber', company: 'Grand Hotel', location: 'Mumbai', desc: 'In-house plumber for hotel room maintenance and water systems.', salary: '₹280 - ₹400/hr' },
    { id: 'P4', category: 'plumber', title: 'Plumbing Assistant', company: 'Local Pipes & Co', location: 'Delhi', desc: 'Assist senior plumbers in residential projects. Training provided.', salary: '₹150 - ₹220/hr' },

    // Driver
    { id: 'D1', category: 'driver', title: 'Personal Driver', company: 'Private Family', location: 'Mumbai', desc: 'Looking for a reliable personal driver for daily commute. Must have valid license.', salary: '₹200 - ₹300/hr' },
    { id: 'D2', category: 'driver', title: 'Delivery Driver', company: 'FastCart Logistics', location: 'Bangalore', desc: 'Delivery driver needed for e-commerce parcel distribution in local areas.', salary: '₹150 - ₹250/hr' },
    { id: 'D3', category: 'driver', title: 'Company Chauffeur', company: 'TechNova', location: 'Hyderabad', desc: 'Corporate driver for executives. Minimum 5 years experience required.', salary: '₹300 - ₹450/hr' },
    { id: 'D4', category: 'driver', title: 'School Bus Driver', company: 'St. Marys Academy', location: 'Delhi', desc: 'Experienced heavy vehicle driver required for morning and afternoon school routes.', salary: '₹250 - ₹350/hr' },

    // Carpenter
    { id: 'C1', category: 'carpenter', title: 'Furniture Carpenter', company: 'WoodArt Studio', location: 'Mumbai', desc: 'Skilled carpenter for custom wooden furniture crafting and polishing.', salary: '₹300 - ₹480/hr' },
    { id: 'C2', category: 'carpenter', title: 'Site Carpenter', company: 'BuildRight Construction', location: 'Bangalore', desc: 'Carpenter needed for door frames, window fittings, and interior woodwork.', salary: '₹280 - ₹400/hr' },
    { id: 'C3', category: 'carpenter', title: 'Modular Kitchen Expert', company: 'HomeSpace Interiors', location: 'Pune', desc: 'Specialist required for modular kitchen cutting, edge banding, and assembly.', salary: '₹350 - ₹550/hr' },
    { id: 'C4', category: 'carpenter', title: 'Repair Carpenter', company: 'FixIt Now', location: 'Delhi', desc: 'Daily repair works including sofa fixing, bed repairs, and lock replacements.', salary: '₹180 - ₹250/hr' }
]

const WORKER_LISTINGS = [
    // Electricians
    { id: 'W1', category: 'electrician', title: 'Experienced Electrician', name: 'Rahul Sharma', location: 'Mumbai', desc: '5+ years experience in domestic & industrial wiring. Available for hire.', salary: '₹250 - ₹350/hr' },
    { id: 'W2', category: 'electrician', title: 'Senior Wireman', name: 'Amit Verma', location: 'Delhi', desc: 'Specialist in panel board & lighting systems. Certified Professional.', salary: '₹300 - ₹450/hr' },
    { id: 'W3', category: 'electrician', title: 'Junior Electrician', name: 'Suresh Kumar', location: 'Bangalore', desc: 'Expert in home appliance repairs & basic residential wiring.', salary: '₹180 - ₹250/hr' },

    // Plumbers
    { id: 'W4', category: 'plumber', title: 'Master Plumber', name: 'Deepak Patel', location: 'Ahmedabad', desc: 'Expert in pipeline design, bathroom renovation & leak detection.', salary: '₹250 - ₹380/hr' },
    { id: 'W5', category: 'plumber', title: 'Service Plumber', name: 'Karan Singh', location: 'Pune', desc: 'Available for daily repairs. 10 years experience in plumbing services.', salary: '₹200 - ₹300/hr' },

    // Drivers
    { id: 'W6', category: 'driver', title: 'Pro Car Driver', name: 'Vijay Yadav', location: 'Mumbai', desc: 'Safe driver with valid commercial license. Knows all city routes.', salary: '₹200 - ₹350/hr' },
    { id: 'W7', category: 'driver', title: 'Delivery Driver', name: 'Rohan More', location: 'Bangalore', desc: 'Experienced in logistics & e-commerce deliveries. Owns a two-wheeler.', salary: '₹150 - ₹280/hr' },

    // Carpenters
    { id: 'W8', category: 'carpenter', title: 'Furniture Specialist', name: 'Ganesh Mistri', location: 'Jaipur', desc: 'Skilled in modular kitchen & custom furniture making.', salary: '₹300 - ₹500/hr' }
]

const JOB_KEYWORDS = ['job', 'work', 'employment', 'vacancy', 'career', 'apply', 'hiring', 'hire me', 'need work', 'looking for work', 'looking for job', 'get job', 'find job']
const CONTACT_KEYWORDS = ['contact', 'phone', 'number', 'call', 'mobile', 'reach', 'whatsapp']
const GREETING_KEYWORDS = ['hi', 'hello', 'hey', 'namaste', 'hii', 'helo', 'howdy', 'good morning', 'good evening', 'good afternoon']
const PRICING_KEYWORDS = ['price', 'cost', 'rate', 'charge', 'fee', 'how much', 'pricing']
const LIST_KEYWORDS = ['available', 'list', 'show', 'find', 'near me', 'nearby', 'professionals', 'book', 'worker', 'workers', 'staff', 'hire']

// ─── INTENT DETECTION ────────────────────────────────────────────────────────

function detectService(input) {
    return SERVICES.find(s => s.keywords.some(kw => input.includes(kw))) || null
}

function detectIntent(input) {
    const i = input.toLowerCase()

    if (i === 'i will contact myself') return 'contact_self'
    if (i === 'you contact for me') return 'contact_bot'
    if (i.includes('get contact details for')) return 'contact_request'

    // Move service_mention higher up to prioritize it
    if (detectService(i)) return 'service_mention'
    if (JOB_KEYWORDS.some(kw => i.includes(kw))) return 'job'
    if (CONTACT_KEYWORDS.some(kw => i.includes(kw))) return 'contact'
    if (GREETING_KEYWORDS.some(kw => i.includes(kw))) return 'greeting'
    if (PRICING_KEYWORDS.some(kw => i.includes(kw))) return 'pricing'
    if (LIST_KEYWORDS.some(kw => i.includes(kw))) return 'list'
    return 'unknown'
}

// ─── BILINGUAL RESPONSE FORMATTER ───────────────────────────────────────────
// Each entry: [englishFragment, hindiTranslation]
// Matching is done via .includes() so partial strings work across dynamic responses.
const HINDI_TRANSLATIONS = [
    // Greeting
    [
        "Hello! 👋 I'm your WorkIndia Smart Assistant.",
        "नमस्ते! 👋 मैं आपका WorkIndia स्मार्ट असिस्टेंट हूं।\nमैं नौकरी खोजने (जैसे इलेक्ट्रीशियन, प्लंबर, ड्राइवर) या पेशेवर संपर्क प्रदान करने में मदद कर सकता हूं। आज आप क्या ढूंढ रहे हैं?"
    ],
    // Contact request (dynamic — matched by fragment)
    [
        'Would you like to contact them yourself, or should I contact them on your behalf?',
        'क्या आप उनसे खुद संपर्क करना चाहेंगे, या मैं आपकी ओर से संपर्क करूं?'
    ],
    // Contact self
    [
        'You can call or WhatsApp them directly. Best of luck with your application!',
        'आप उन्हें सीधे कॉल या WhatsApp कर सकते हैं। आपके आवेदन के लिए शुभकामनाएं!'
    ],
    // Contact bot
    [
        'I will notify you in your dashboard as soon as they reply!',
        'जैसे ही वे जवाब देंगे, मैं आपके डैशबोर्ड में सूचित करूंगा!'
    ],
    // Job results header
    [
        "💼 Here are some relevant",
        '💼 यहाँ आपके लिए कुछ प्रासंगिक'
    ],
    // No jobs found
    [
        "I couldn't find any specific jobs",
        'मुझे अभी उस श्रेणी में कोई नौकरी नहीं मिली, लेकिन मैं खोजता रहूंगा। आप \'इलेक्ट्रीशियन\', \'प्लंबर\', \'ड्राइवर\', या \'कारपेंटर\' खोज सकते हैं।'
    ],
    // Job general
    [
        '💼 We have open roles for',
        '💼 हमारे पास **इलेक्ट्रीशियन, प्लंबर, ड्राइवर, कारपेंटर** और अन्य के लिए पद उपलब्ध हैं।\nआप किस प्रकार की नौकरी ढूंढ रहे हैं?'
    ],
    // Fallback
    [
        "I didn't quite catch that.",
        'मैं समझ नहीं पाया। कृपया इस तरह पूछें:\n\n• _"ड्राइवर की नौकरी खोजें"_\n• _"मुझे इलेक्ट्रीशियन की नौकरी चाहिए"_\n• _"कारपेंटर के पद दिखाएं"_'
    ],
]

function formatBilingual(englishText, profileSummary) {
    if (profileSummary) {
        return `${profileSummary}\n\nमैं आपकी कैसे मदद कर सकता हूँ?\n\n---\n\n${englishText}`
    }

    for (const [fragment, hindiText] of HINDI_TRANSLATIONS) {
        if (englishText.includes(fragment)) {
            return `${hindiText}\n\n${englishText}`
        }
    }
    return `मैं आपकी मदद के लिए यहां हूं। कृपया बताएं कि आप क्या चाहते हैं।\n\n${englishText}`
}

function extractDetails(text) {
    const textLower = text.toLowerCase()

    let fullName = null
    let title = null
    let salary = null
    let city = null

    // Name match
    const nameMatch = text.match(/(?:naam|name is|i am|mera naam|naam hai|my name is)\s+([A-Za-z\u0900-\u097F]+)/i)
    if (nameMatch) fullName = nameMatch[1]

    // Job match
    const jobs = ['plumber', 'electrician', 'driver', 'carpenter', 'painter', 'ac', 'cleaner', 'नौकरी', 'प्लंबर', 'इलेक्ट्रीशियन']
    for (const j of jobs) {
        if (textLower.includes(j)) { title = j; break; }
    }

    // Salary match
    const salMatch = text.match(/(\d+k|\d+,\d+|\d{4,})/i)
    if (salMatch) salary = salMatch[0]

    // City match
    const cities = ['mumbai', 'pune', 'delhi', 'bangalore', 'मुंबई', 'पुणे', 'दिल्ली']
    for (const c of cities) {
        if (textLower.includes(c)) { city = c; break; }
    }

    if (!fullName && !title && !salary && !city) return null

    return { fullName, title, salary, city }
}

// ─── BOT BRAIN ───────────────────────────────────────────────────────────────

function getBotResponse(userInput, conversationState, userRole) {
    const input = userInput.toLowerCase().trim()
    const intent = detectIntent(input)
    const matchedService = detectService(input)

    // ── GREETING ──────────────────────────────────────
    if (intent === 'greeting') {
        const welcome = userRole === 'provider'
            ? "Hello! 👋 I'm your WorkIndia Smart Assistant for Employers.\n\nI can help you find skilled workers (electricians, plumbers, drivers) or provide their contact details. Who are you looking to hire today?"
            : "Hello! 👋 I'm your WorkIndia Smart Assistant.\n\nI can help you find job openings (like electricians, plumbers, drivers) or provide professional contacts. What are you looking for today?"
        return { text: welcome, state: {} }
    }

    // ── CONTACT WORKFLOW ─────────────────────────────
    if (intent === 'contact_request' || intent === 'contact') {
        const match = input.match(/get contact details for\s+(.+)/i)
        const entity = match ? match[1].trim() : conversationState.lastEntity || (userRole === 'provider' ? 'the worker' : 'the employer')

        return {
            text: `You requested contact details for **${entity}**.\n\nWould you like to contact them yourself, or should I reach out on your behalf?`,
            options: ['I will contact myself', 'You contact for me'],
            state: { ...conversationState, lastEntity: entity }
        }
    }

    if (intent === 'contact_self') {
        const entity = conversationState.lastEntity || (userRole === 'provider' ? 'the worker' : 'the employer')
        const phone = '+91 ' + Math.floor(1000000000 + Math.random() * 9000000000)
        return {
            text: `📞 Here are the contact details for **${entity}**:\n\n**Contact Name:** ${userRole === 'provider' ? 'Professional' : 'HR Manager'}\n**Phone Number:** ${phone}\n\nYou can call or WhatsApp them directly.`,
            state: { lastEntity: null }
        }
    }

    if (intent === 'contact_bot') {
        const entity = conversationState.lastEntity || (userRole === 'provider' ? 'the worker' : 'the employer')
        return {
            text: `✅ Done! I have securely shared your interest with **${entity}**.\n\nI will notify you in your dashboard as soon as they respond!`,
            state: { lastEntity: null }
        }
    }

    // ── PRICING ──────────────────────────────────────
    if (intent === 'pricing') {
        if (matchedService) {
            return {
                text: `💰 The estimated market rate for **${matchedService.label}** professionals is **${matchedService.price}**.\n\nWould you like to see available candidates?`,
                state: {}
            }
        }
        return {
            text: "💰 Service professional rates typically range from **₹379 to ₹1,599** depending on the complexity of the task.\n\nWhich category are you interested in?",
            state: {}
        }
    }

    // ── JOB / CATEGORY SEARCH / LIST ─────────────────
    if (intent === 'job' || intent === 'service_mention' || intent === 'list') {
        if (matchedService) {
            const s = matchedService
            if (userRole === 'provider') {
                const matchingWorkers = WORKER_LISTINGS.filter(w => w.category === s.key)
                if (matchingWorkers.length > 0) {
                    return {
                        text: `👷 I found some top-rated **${s.label}** professionals ready to work:`,
                        jobs: matchingWorkers.map(w => ({ ...w, company: w.name })), // Reuse jobs UI for workers
                        state: { lastEntity: s.key }
                    }
                }
            } else {
                const matchingJobs = JOB_LISTINGS.filter(j => j.category === s.key)
                if (matchingJobs.length > 0) {
                    return {
                        text: `💼 Here are some relevant **${s.label}** openings I found for you:`,
                        jobs: matchingJobs,
                        state: { lastEntity: s.key }
                    }
                }
            }

            return {
                text: `I couldn't find any specific ${userRole === 'provider' ? 'workers' : 'jobs'} for ${s.label} right now, but I'll keep looking.`,
                state: {}
            }
        }

        if (intent === 'job' || intent === 'list') {
            return {
                text: userRole === 'provider'
                    ? `👷 We have skilled **electricians, plumbers, drivers, carpenters**, and more ready for hire.\n\nWhich type of professional do you need?`
                    : `💼 We have open roles for **electricians, plumbers, drivers, carpenters**, and more.\n\nWhich type of job are you looking for?`,
                state: { awaitingCategory: true }
            }
        }
    }


    // ── FALLBACK ──────────────────────────────────────
    return {
        text: userRole === 'provider'
            ? "I didn't quite catch that. Try asking for specific workers like:\n\n• _\"Find me a driver\"_\n• _\"List available electricians\"_\n• _\"Show carpenter profiles\"_"
            : "I didn't quite catch that. Try asking for specific jobs like:\n\n• _\"Find driver jobs\"_\n• _\"I need an electrician job\"_\n• _\"Show carpenter openings\"_",
        state: conversationState
    }
}

// ─── Sub-components ────────────────────────────────────────────────────────────
function MessageBubble({ msg, onSend }) {
    const isUser = msg.role === 'user'
    const isBot = !isUser
    return (
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} animate-fade-in gap-2`}>
            <div className={`max-w-[85%] lg:max-w-md px-4 py-3 rounded-2xl text-sm leading-relaxed ${isUser
                ? 'bg-primary-600 text-white rounded-br-sm'
                : 'bg-white text-gray-800 border border-gray-200 rounded-bl-sm shadow-sm'
                }`}>
                <div
                    dangerouslySetInnerHTML={{
                        __html: (msg.text || '')
                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                            .replace(/\n/g, '<br>'),
                    }}
                />
                <div className={`text-xs mt-1 ${isUser ? 'text-primary-100' : 'text-gray-400'}`}>
                    {msg.time}
                </div>
            </div>

            {/* Job Cards */}
            {isBot && msg.jobs && (
                <div className="flex flex-col gap-3 mt-1 w-full max-w-xs lg:max-w-md">
                    {msg.jobs.map(job => (
                        <div key={job.id} className="bg-white border border-gray-200 rounded-xl p-3.5 shadow-sm flex flex-col gap-1.5 hover:border-primary-300 transition-colors text-left">
                            <div className="flex justify-between items-start gap-2">
                                <h4 className="font-bold text-gray-900 leading-tight">{job.title}</h4>
                                <span className="text-xs bg-primary-100 text-primary-700 font-semibold px-2 py-0.5 rounded-full flex-shrink-0 whitespace-nowrap">{job.salary}</span>
                            </div>
                            <p className="text-sm font-semibold text-gray-700">{job.company}</p>
                            <p className="text-xs text-gray-500 mb-2 leading-snug">{job.location} • {job.desc}</p>
                            <button
                                onClick={() => onSend(`Get contact details for ${job.company}`)}
                                className="text-xs btn-primary py-2 w-full mt-auto font-bold tracking-wide shadow-sm"
                            >
                                Get Contact Details
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Options / Action Buttons */}
            {isBot && msg.options && (
                <div className="flex flex-wrap gap-2 mt-1">
                    {msg.options.map(opt => (
                        <button
                            key={opt}
                            onClick={() => onSend(opt)}
                            className="text-sm border-2 border-primary-500 text-primary-600 font-semibold px-4 py-2 rounded-xl hover:bg-primary-50 hover:shadow-sm transition-all text-left"
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

function TypingIndicator() {
    return (
        <div className="flex justify-start animate-fade-in">
            <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm shadow-sm px-4 py-3">
                <div className="flex gap-1">
                    <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
            </div>
        </div>
    )
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function SmartHelp() {
    const getTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    // Sync with chatLanguageMode set by the Upgrade toggle in the sidebar
    const [languageMode, setLanguageMode] = useState(
        () => localStorage.getItem('chatLanguageMode') || 'english'
    )

    const [role, setRole] = useState(() => localStorage.getItem('userRole') || 'jobseeker')

    // Derive display language key: bilingual → 'hi', english → 'en'
    const language = languageMode === 'bilingual' ? 'hi' : 'en'

    // Get content based on role and language
    const content = CONTENT[role]?.[language] || CONTENT.jobseeker[language]
    const ui = UI_TEXT[language]

    const makeWelcomeMsg = (lang, currentRole) => {
        const activeRole = currentRole || localStorage.getItem('userRole') || 'jobseeker'
        const text = CONTENT[activeRole]?.[lang]?.welcome || CONTENT.jobseeker[lang].welcome

        return {
            id: 1,
            role: 'bot',
            text: text,
            time: getTime(),
        }
    }

    const [messages, setMessages] = useState(() => [makeWelcomeMsg(language, role)])
    const [input, setInput] = useState('')
    const [typing, setTyping] = useState(false)
    const [listening, setListening] = useState(false)
    const [convState, setConvState] = useState({})
    const bottomRef = useRef(null)
    const recognition = useRef(null)

    // Listen for mode/role changes — 'storage' fires cross-tab, 'languageModeChanged' fires same-tab
    useEffect(() => {
        const handleModeChange = () => {
            const newMode = localStorage.getItem('chatLanguageMode') || 'english'
            const newRole = localStorage.getItem('userRole') || 'jobseeker'
            setLanguageMode(newMode)
            setRole(newRole)
        }
        window.addEventListener('storage', handleModeChange)
        window.addEventListener('languageModeChanged', handleModeChange)
        return () => {
            window.removeEventListener('storage', handleModeChange)
            window.removeEventListener('languageModeChanged', handleModeChange)
        }
    }, [])

    // Reset welcome message when mode or role changes
    useEffect(() => {
        const lang = languageMode === 'bilingual' ? 'hi' : 'en'
        setMessages([makeWelcomeMsg(lang, role)])

        // Setup Speech Recognition
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        if (SpeechRecognition) {
            recognition.current = new SpeechRecognition()
            recognition.current.continuous = false
            recognition.current.interimResults = false
            recognition.current.lang = languageMode === 'bilingual' ? 'hi-IN' : 'en-US'

            recognition.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript
                setInput(prev => (prev ? `${prev} ${transcript}` : transcript))
                setListening(false)
            }

            recognition.current.onend = () => setListening(false)
            recognition.current.onerror = () => setListening(false)
        }

        return () => {
            if (recognition.current) recognition.current.abort()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [languageMode, role])


    const sendMessage = (text) => {
        const userText = (text || input).trim()
        if (!userText) return

        // Block Hindi when English-only mode is active
        if (languageMode === 'english' && isHindiText(userText)) {
            setMessages(prev => [
                ...prev,
                {
                    id: Date.now(),
                    role: 'bot',
                    text: '⚠ Please enable Upgrade to chat in Hindi.',
                    time: getTime(),
                },
            ])
            setInput('')
            return
        }

        const userMsg = { id: Date.now(), role: 'user', text: userText, time: getTime() }
        setMessages(prev => [...prev, userMsg])
        setInput('')
        setTyping(true)

        setTimeout(() => {
            const { text: botText, state: newState, options, jobs } = getBotResponse(userText, convState, role)
            setConvState(prev => ({ ...prev, ...newState }))

            let finalBotText = botText
            if (languageMode === 'bilingual') {
                const details = extractDetails(userText)
                if (details) {
                    const summary = `👤 नाम: **${details.fullName || 'User'}**\n💼 पद: **${details.title || 'Professional'}**\n💰 वेतन: **${details.salary || 'Market Rate'}**\n📍 शहर: **${details.city || 'India'}**`
                    finalBotText = formatBilingual(botText, summary)
                } else {
                    finalBotText = formatBilingual(botText)
                }
            }

            setMessages(prev => [
                ...prev,
                { id: Date.now() + 1, role: 'bot', text: finalBotText, options, jobs, time: getTime() },
            ])
            setTyping(false)
        }, 800 + Math.random() * 500)
    }


    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            sendMessage()
        }
    }

    const toggleListening = () => {
        if (!recognition.current) {
            alert("Speech recognition not supported in this browser.")
            return
        }
        if (listening) {
            recognition.current.stop()
        } else {
            recognition.current.lang = languageMode === 'bilingual' ? 'hi-IN' : 'en-US'
            recognition.current.start()
            setListening(true)
        }
    }

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, typing])


    return (
        <div className="flex flex-col h-full max-h-[calc(100vh-8rem)] animate-fade-in">

            {/* ── Chat Header ─────────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4 flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-600 to-accent-400 flex items-center justify-center text-xl shadow-lg">
                    🤖
                </div>
                <div className="flex-1">
                    <h2 className="font-bold text-gray-900">{ui.assistantTitle}</h2>
                    <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        <span className="text-xs text-gray-500">{ui.onlineStatus}</span>
                    </div>
                </div>

                {/* Language mode badge (read-only — controlled by Upgrade toggle) */}
                <span className={`px-3 py-1 text-xs font-medium rounded-lg ${languageMode === 'bilingual'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-600'
                    }`}>
                    {languageMode === 'bilingual' ? '🌐 Bilingual' : '🔤 English Only'}
                </span>

                <div className="ml-auto flex items-center gap-3">
                    <div className="hidden sm:flex gap-2">
                        {content.capabilities.map(cap => (
                            <span
                                key={cap}
                                className="text-xs bg-primary-50 text-primary-700 px-2.5 py-1 rounded-full font-medium border border-primary-100"
                            >
                                {cap}
                            </span>
                        ))}
                    </div>
                    <button
                        onClick={() => setMessages([makeWelcomeMsg(language, role)])}
                        className="text-xs text-gray-400 hover:text-red-500 transition-colors font-medium"
                    >
                        {ui.clearBtn}
                    </button>
                </div>
            </div>

            {/* ── Messages ─────────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto bg-gray-50 rounded-2xl border border-gray-100 p-4 space-y-4 min-h-0">
                {messages.map(msg => (
                    <MessageBubble key={msg.id} msg={msg} onSend={sendMessage} />
                ))}

                {typing && <TypingIndicator />}
                <div ref={bottomRef} />
            </div>

            {/* ── Quick Prompts ────────────────────────────────── */}
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {content.quickPrompts.map(p => (
                    <button
                        key={p.value}
                        onClick={() => sendMessage(p.value)}
                        disabled={typing}
                        className="flex-shrink-0 text-xs bg-white border border-gray-200 text-gray-600 hover:border-primary-300 hover:text-primary-600 hover:bg-primary-50 px-3 py-2 rounded-full transition-all duration-200 font-medium disabled:opacity-50"
                    >
                        {p.label}
                    </button>
                ))}
            </div>

            {/* ── Input Area ───────────────────────────────────── */}
            <div className="mt-3 bg-white rounded-2xl border border-gray-200 shadow-sm flex items-end gap-3 p-3 focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-100 transition-all duration-200">
                <textarea
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={content.placeholder}
                    rows={1}
                    className="flex-1 resize-none outline-none text-sm text-gray-800 placeholder-gray-400 max-h-28 leading-relaxed bg-transparent"
                />

                {/* 🎤 Mic Button */}
                <button
                    onClick={toggleListening}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 shadow-sm flex-shrink-0 ${listening
                        ? 'bg-red-500 text-white animate-pulse shadow-red-200 ring-4 ring-red-100'
                        : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                        }`}
                    title={listening ? "Listening..." : "Voice Input"}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                </button>
                <button
                    onClick={() => sendMessage()}
                    disabled={!input.trim() || typing}
                    className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-accent-400 flex items-center justify-center text-white hover:from-primary-700 hover:to-accent-600 transition-all duration-200 shadow-md disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
                    aria-label="Send message"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                </button>
            </div>
        </div>
    )
}
