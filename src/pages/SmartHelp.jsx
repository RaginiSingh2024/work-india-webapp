import { useState, useRef, useEffect } from 'react'

// ─── Language Content ──────────────────────────────────────────────────────────
const CONTENT = {
    en: {
        welcome: "Namaste! 👋 Welcome to **WorkIndia Smart Help AI**.\n\nI can help you:\n🏠 **Book home services** — plumbers, electricians, AC repair & more\n📞 **Get contact details** of any professional\n💰 **Check service pricing**\n💼 **Find job opportunities** if you're a skilled professional\n\nWhat would you like to do today?",
        quickPrompts: [
            { label: '🔧 Available plumbers', value: 'Show available plumbers near me' },
            { label: '⚡ List electricians', value: 'List electricians near me' },
            { label: '❄️ AC technicians', value: 'Show available AC technicians' },
            { label: '💰 Service pricing', value: 'What are the prices for all services?' },
            { label: '🧹 Book a cleaner', value: 'Book a home cleaner' },
            { label: '💼 I need a job', value: 'I am looking for a job' },
        ],
        placeholder: 'Try "Show available plumbers" or "I need a job as electrician"...',
        clearBtn: 'Clear',
        capabilities: ['Book Services', 'Find Jobs', 'Get Contacts'],
        assistantTitle: 'WorkIndia Smart Help AI',
        onlineStatus: 'Online — responds instantly',
    },
    hi: {
        welcome: "नमस्ते! 👋 **वर्कइंडिया स्मार्ट हेल्प AI** में आपका स्वागत है।\n\nनमस्ते! कृपया एक ही संदेश में अपना नाम, काम, अपेक्षित वेतन और शहर बताएं।\n\nHi! I'm your Smart Help AI 🤖\nPlease tell me your name, profession, expected salary, and city in ONE single message. (e.g. 'I am Amit, Plumber, expecting 25k in Mumbai')",
        quickPrompts: [
            { label: '🔧 उपलब्ध प्लंबर', value: 'मेरा नाम अमित है, मैं प्लंबर हूँ, मुंबई में 25k वेतन की तलाश है' },
            { label: '⚡ इलेक्ट्रीशियन सूची', value: 'मैं राहुल हूँ, इलेक्ट्रीशियन हूँ, दिल्ली में 20k वेतन चाहिए' },
            { label: '❄️ AC तकनीशियन', value: 'मैं AC तकनीशियन हूँ, पुणे में काम ढूंढ रहा हूँ' },
            { label: '💰 सेवा मूल्य', value: 'सभी सेवाओं की दरें क्या हैं?' },
            { label: '🧹 क्लीनर बुक करें', value: 'मुझे घर के लिए क्लीनर चाहिए' },
            { label: '💼 मुझे नौकरी चाहिए', value: 'मैं नौकरी खोज रहा हूँ' },
        ],
        placeholder: 'e.g. मैं राहुल हूँ, इलेक्ट्रीशियन हूँ, दिल्ली में 20k वेतन चाहिए...',
        clearBtn: 'साफ़ करें',
        capabilities: ['सेवाएं बुक करें', 'नौकरियां खोजें', 'संपर्क प्राप्त करें'],
        assistantTitle: 'वर्कइंडिया स्मार्ट हेल्प AI',
        onlineStatus: 'ऑनलाइन — तुरंत जवाब देता है',
    },
}

// ─── Helpers ───────────────────────────────────────────────────────────────────
const isHindiText = (text) => /[\u0900-\u097F]/.test(text)

// ─── DATA ────────────────────────────────────────────────────────────────────

const SERVICES = [
    {
        key: 'plumber',
        label: 'Plumber',
        emoji: '🔧',
        price: '₹449–₹529',
        keywords: ['plumber', 'plumber job', 'plumbing', 'leak', 'pipe', 'tap', 'toilet', 'drain', 'water', 'plumbar', 'plumber near me'],
    },
    {
        key: 'electrician',
        label: 'Electrician',
        emoji: '⚡',
        price: '₹549–₹649',
        keywords: ['electrician', 'electricians', 'electric', 'wiring', 'light', 'fan', 'switch', 'power', 'socket', 'elctrician', 'electrition', 'electrisian', 'electrician job'],
    },
    {
        key: 'driver',
        label: 'Driver',
        emoji: '🚗',
        price: '₹500–₹1000',
        keywords: ['driver', 'driving', 'car', 'chauffeur', 'cab', 'drive', 'dryver', 'driver job'],
    },
    {
        key: 'carpenter',
        label: 'Carpenter',
        emoji: '🪚',
        price: '₹379–₹449',
        keywords: ['carpenter', 'carpentry', 'furniture', 'door', 'wood', 'table', 'chair', 'bed', 'cabinet', 'carpentar', 'carpenter job'],
    },
    {
        key: 'ac',
        label: 'AC Technician',
        emoji: '❄️',
        price: '₹749–₹849',
        keywords: ['ac', 'air conditioner', 'air conditioning', 'cooling', 'ac repair', 'ac service', 'gas refill'],
    },
    {
        key: 'painter',
        label: 'Painter',
        emoji: '🖌️',
        price: '₹1,399–₹1,599',
        keywords: ['painter', 'paint', 'painting', 'wall', 'color', 'interior', 'exterior', 'putty'],
    },
    {
        key: 'cleaning',
        label: 'Home Cleaner',
        emoji: '🧹',
        price: '₹749–₹849',
        keywords: ['cleaning', 'clean', 'cleaner', 'deep clean', 'sweep', 'mop', 'maid', 'sofa', 'sanitise'],
    },
]

const JOB_LISTINGS = [
    // Electrician
    { id: 'E1', category: 'electrician', title: 'Senior Electrician', company: 'PowerPro Experts', location: 'Bangalore', desc: 'Looking for an experienced electrician for residential wiring and panel installation.', salary: '₹25,000/mo' },
    { id: 'E2', category: 'electrician', title: 'Maintenance Electrician', company: 'City Mall Corp', location: 'Mumbai', desc: 'Full-time electrician needed for daily maintenance of mall lighting and power systems.', salary: '₹22,000/mo' },
    { id: 'E3', category: 'electrician', title: 'Apprentice Electrician', company: 'VoltTech Solutions', location: 'Delhi', desc: 'Great opportunity for freshers to learn commercial wiring and AC installations.', salary: '₹15,000/mo' },
    { id: 'E4', category: 'electrician', title: 'Industrial Electrician', company: 'Steel Works Ltd', location: 'Hyderabad', desc: 'Urgent requirement for heavy machinery electrical maintenance.', salary: '₹30,000/mo' },

    // Plumber
    { id: 'P1', category: 'plumber', title: 'Expert Plumber', company: 'QuickFix Services', location: 'Bangalore', desc: 'Need a plumber for pipeline repairs, bathroom fittings, and leak fixes.', salary: '₹20,000/mo' },
    { id: 'P2', category: 'plumber', title: 'Commercial Plumber', company: 'AquaTech Builders', location: 'Chennai', desc: 'Looking for a plumber for a new commercial building project.', salary: '₹28,000/mo' },
    { id: 'P3', category: 'plumber', title: 'Maintenance Plumber', company: 'Grand Hotel', location: 'Mumbai', desc: 'In-house plumber for hotel room maintenance and water systems.', salary: '₹24,000/mo' },
    { id: 'P4', category: 'plumber', title: 'Plumbing Assistant', company: 'Local Pipes & Co', location: 'Delhi', desc: 'Assist senior plumbers in residential projects. Training provided.', salary: '₹14,000/mo' },

    // Driver
    { id: 'D1', category: 'driver', title: 'Personal Driver', company: 'Private Family', location: 'Mumbai', desc: 'Looking for a reliable personal driver for daily commute. Must have valid license.', salary: '₹18,000/mo' },
    { id: 'D2', category: 'driver', title: 'Delivery Driver', company: 'FastCart Logistics', location: 'Bangalore', desc: 'Delivery driver needed for e-commerce parcel distribution in local areas.', salary: '₹22,000/mo' },
    { id: 'D3', category: 'driver', title: 'Company Chauffeur', company: 'TechNova', location: 'Hyderabad', desc: 'Corporate driver for executives. Minimum 5 years experience required.', salary: '₹25,000/mo' },
    { id: 'D4', category: 'driver', title: 'School Bus Driver', company: 'St. Marys Academy', location: 'Delhi', desc: 'Experienced heavy vehicle driver required for morning and afternoon school routes.', salary: '₹20,000/mo' },

    // Carpenter
    { id: 'C1', category: 'carpenter', title: 'Furniture Carpenter', company: 'WoodArt Studio', location: 'Mumbai', desc: 'Skilled carpenter for custom wooden furniture crafting and polishing.', salary: '₹26,000/mo' },
    { id: 'C2', category: 'carpenter', title: 'Site Carpenter', company: 'BuildRight Construction', location: 'Bangalore', desc: 'Carpenter needed for door frames, window fittings, and interior woodwork.', salary: '₹24,000/mo' },
    { id: 'C3', category: 'carpenter', title: 'Modular Kitchen Expert', company: 'HomeSpace Interiors', location: 'Pune', desc: 'Specialist required for modular kitchen cutting, edge banding, and assembly.', salary: '₹28,000/mo' },
    { id: 'C4', category: 'carpenter', title: 'Repair Carpenter', company: 'FixIt Now', location: 'Delhi', desc: 'Daily repair works including sofa fixing, bed repairs, and lock replacements.', salary: '₹15,000/mo' }
]

const JOB_KEYWORDS = ['job', 'work', 'employment', 'vacancy', 'career', 'apply', 'hiring', 'hire me', 'need work', 'looking for work', 'looking for job', 'get job', 'find job']
const CONTACT_KEYWORDS = ['contact', 'phone', 'number', 'call', 'mobile', 'reach', 'whatsapp']
const GREETING_KEYWORDS = ['hi', 'hello', 'hey', 'namaste', 'hii', 'helo', 'howdy', 'good morning', 'good evening', 'good afternoon']
const PRICING_KEYWORDS = ['price', 'cost', 'rate', 'charge', 'fee', 'how much', 'pricing']
const LIST_KEYWORDS = ['available', 'list', 'show', 'find', 'near me', 'nearby', 'professionals', 'book']

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

function getBotResponse(userInput, conversationState) {
    const input = userInput.toLowerCase().trim()
    const intent = detectIntent(input)
    const matchedService = detectService(input)

    // ── GREETING ──────────────────────────────────────
    if (intent === 'greeting') {
        return { text: "Hello! 👋 I'm your WorkIndia Smart Assistant.\n\nI can help you find job openings (like electricians, plumbers, drivers) or provide professional contacts. What are you looking for today?", state: {} }
    }

    // ── CONTACT WORKFLOW ─────────────────────────────
    if (intent === 'contact_request' || intent === 'contact') {
        const match = input.match(/get contact details for\s+(.+)/i)
        const company = match ? match[1].trim() : conversationState.lastCompany || 'the employer'

        return {
            text: `You requested contact details for **${company}**.\n\nWould you like to contact them yourself, or should I contact them on your behalf?`,
            options: ['I will contact myself', 'You contact for me'],
            state: { ...conversationState, lastCompany: company }
        }
    }

    if (intent === 'contact_self') {
        const company = conversationState.lastCompany || 'the employer'
        const phone = '+91 ' + Math.floor(1000000000 + Math.random() * 9000000000)
        return {
            text: `📞 Here are the contact details for **${company}**:\n\n**Contact Name:** HR Manager\n**Phone Number:** ${phone}\n\nYou can call or WhatsApp them directly. Best of luck with your application!`,
            state: { lastCompany: null }
        }
    }

    if (intent === 'contact_bot') {
        const company = conversationState.lastCompany || 'the employer'
        return {
            text: `✅ Done! I have securely sent your profile and expressed your interest to **${company}** on your behalf.\n\nI will notify you in your dashboard as soon as they reply!`,
            state: { lastCompany: null }
        }
    }

    // ── PRICING ──────────────────────────────────────
    if (intent === 'pricing') {
        if (matchedService) {
            return {
                text: `💰 The estimated pricing for **${matchedService.label}** service is **${matchedService.price}**.\n\nWould you like to book a service?`,
                state: {}
            }
        }
        return {
            text: "💰 Our service prices range from **₹379 to ₹1,599** depending on the type of work.\n\nWhich service are you interested in?",
            state: {}
        }
    }

    // ── JOB / CATEGORY SEARCH / LIST ─────────────────
    if (intent === 'job' || intent === 'service_mention' || intent === 'list') {
        if (matchedService) {
            const s = matchedService
            const matchingJobs = JOB_LISTINGS.filter(j => j.category === s.key)
            if (matchingJobs.length > 0) {
                return {
                    text: `💼 Here are some relevant **${s.label}** openings I found for you:`,
                    jobs: matchingJobs,
                    state: { lastService: s.key }
                }
            } else {
                return {
                    text: `I couldn't find any specific jobs for ${s.label} right now, but I'll keep looking. You can try searching for 'electrician', 'plumber', 'driver', or 'carpenter'.`,
                    state: {}
                }
            }
        }

        if (intent === 'job' || intent === 'list') {
            return {
                text: `💼 We have open roles for **electricians, plumbers, drivers, carpenters**, and more.\n\nWhich type of job are you looking for?`,
                state: { awaitingJobCategory: true }
            }
        }
    }


    // ── FALLBACK ──────────────────────────────────────
    return {
        text: "I didn't quite catch that. Try asking for specific jobs like:\n\n• _\"Find driver jobs\"_\n• _\"I need an electrician job\"_\n• _\"Show carpenter openings\"_",
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
    // Sync with chatLanguageMode set by the Upgrade toggle in the sidebar
    const [languageMode, setLanguageMode] = useState(
        () => localStorage.getItem('chatLanguageMode') || 'english'
    )

    // Derive display language key: bilingual → 'hi', english → 'en'
    const language = languageMode === 'bilingual' ? 'hi' : 'en'

    const makeWelcomeMsg = (lang) => ({
        id: 1,
        role: 'bot',
        text: CONTENT[lang].welcome,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    })

    const [messages, setMessages] = useState(() => [makeWelcomeMsg(languageMode === 'bilingual' ? 'hi' : 'en')])
    const [input, setInput] = useState('')
    const [typing, setTyping] = useState(false)
    const [listening, setListening] = useState(false)
    const [convState, setConvState] = useState({})
    const bottomRef = useRef(null)
    const recognition = useRef(null)

    // Listen for mode changes — 'storage' fires cross-tab, 'languageModeChanged' fires same-tab
    useEffect(() => {
        const handleModeChange = () => {
            const newMode = localStorage.getItem('chatLanguageMode') || 'english'
            setLanguageMode(newMode)
        }
        window.addEventListener('storage', handleModeChange)
        window.addEventListener('languageModeChanged', handleModeChange)
        return () => {
            window.removeEventListener('storage', handleModeChange)
            window.removeEventListener('languageModeChanged', handleModeChange)
        }
    }, [])

    // Reset welcome message when mode changes (no full chat reset)
    useEffect(() => {
        const lang = languageMode === 'bilingual' ? 'hi' : 'en'
        setMessages([makeWelcomeMsg(lang)])

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
    }, [languageMode])

    const getTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

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
            const { text: botText, state: newState, options, jobs } = getBotResponse(userText, convState)
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

    const content = CONTENT[language]

    return (
        <div className="flex flex-col h-full max-h-[calc(100vh-8rem)] animate-fade-in">

            {/* ── Chat Header ─────────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4 flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-600 to-accent-400 flex items-center justify-center text-xl shadow-lg">
                    🤖
                </div>
                <div className="flex-1">
                    <h2 className="font-bold text-gray-900">{content.assistantTitle}</h2>
                    <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        <span className="text-xs text-gray-500">{content.onlineStatus}</span>
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
                        onClick={() => setMessages([makeWelcomeMsg(language)])}
                        className="text-xs text-gray-400 hover:text-red-500 transition-colors font-medium"
                    >
                        {content.clearBtn}
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
