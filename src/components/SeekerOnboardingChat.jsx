import { useEffect, useMemo, useRef, useState, useCallback } from 'react'

function MessageBubble({ msg }) {
    const isBot = msg.role === 'bot'
    return (
        <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} animate-slide-up`}>
            <div
                className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${isBot
                    ? 'bg-white text-gray-800 border border-gray-100 rounded-bl-sm shadow-sm'
                    : 'bg-gradient-to-br from-primary-600 to-accent-400 text-white rounded-br-sm shadow-md'
                    }`}
            >
                {msg.text}
            </div>
        </div>
    )
}

function extractDetails(text) {
    let name = "";
    let profession = "";
    let salary = "";
    let location = "";

    const lines = text.split(/[\n,.]+/).map(s => s.trim()).filter(Boolean);
    const lower = text.toLowerCase();

    // Try to extract Name
    const nameMatch = text.match(/(?:my name is|i am|name:?)\s*([a-zA-Z\s]+?)(?:\.|,|$| i am| working| expecting)/i);
    if (nameMatch && nameMatch[1].trim().length > 1) name = nameMatch[1].trim();

    // Try to extract Profession
    const profMatch = text.match(/(?:a|an|as|profession:?)\s*([a-zA-Z\s]+?)(?:\.|,|$| earning| expecting| in| from)/i);
    if (profMatch && !['i', 'my'].includes(profMatch[1].trim().toLowerCase())) profession = profMatch[1].trim();

    // Try to extract Salary
    const salMatch = text.match(/((?:rs\.?|₹|\$)?\s*\d+(?:,\d+)*(?:k|lakh)?\s*(?:per|-|\/)?\s*(?:month|hr|hour|day)?)/i);
    if (salMatch) salary = salMatch[1].trim();

    // Try to extract Location
    const locMatch = text.match(/(?:in|from|at|location:?)\s*([a-zA-Z\s]+?)(?:\.|,|$)/i);
    if (locMatch && !['month', 'hour', 'rs'].includes(locMatch[1].trim().toLowerCase())) {
        location = locMatch[1].trim();
    } else {
        const cities = ["mumbai", "delhi", "bangalore", "pune", "hyderabad", "chennai", "kolkata", "ahmedabad", "noida", "gurgaon"];
        const foundCity = cities.find(c => lower.includes(c));
        if (foundCity) {
            location = foundCity.charAt(0).toUpperCase() + foundCity.slice(1);
        } else if (!text.toLowerCase().includes("location")) {
            location = ""; // leave blank deliberately
        }
    }

    // Fallbacks if they just typed comma separated or one line paragraph
    if (!name && lines.length > 0) name = lines[0].replace(/my name is/i, '').trim();
    if (!profession && lines.length > 1) profession = lines[1].replace(/i am a/i, '').trim();
    if (!salary && lines.length > 2) salary = lines[2].trim();
    if (!location && lines.length > 3) location = lines[3].trim();

    if (!name) name = "Guest";
    if (!profession) profession = "Professional";
    if (!salary) salary = "Negotiable";

    return { fullName: name, title: profession, expectedSalary: salary, preferredLocation: location, currentLocation: location };
}

const GUIDED_STEPS = [
    {
        key: 'fullName',
        en: "Please tell your name",
        hi: "कृपया अपना नाम बताइए / Please tell your name",
        placeholder: 'e.g. Rahul Kumar'
    },
    {
        key: 'title',
        en: "What is your professional title?",
        hi: "आपका प्रोफेशनल टाइटल क्या है? / What is your professional title?",
        placeholder: 'e.g. Electrician, Developer'
    },
    {
        key: 'expectedSalary',
        en: "What is your expected salary? (Monthly or Hourly)",
        hi: "आपका अपेक्षित वेतन क्या है? (मासिक या प्रति घंटा) / What is your expected salary? (Monthly or Hourly)",
        placeholder: 'e.g. ₹20000 Monthly'
    },
    {
        key: 'preferredLocation',
        en: "Where is your preferred location?",
        hi: "आपकी काम करने की पसंदीदा जगह कहाँ है? / Where is your preferred location?",
        placeholder: 'e.g. Mumbai'
    },
    {
        key: 'currentLocation',
        en: "Where is your current location?",
        hi: "आपकी वर्तमान जगह कहाँ है? / Where is your current location?",
        placeholder: 'e.g. Pune'
    }
];

// Bilingual Layer
const isHindiText = (text) => /[\u0900-\u097F]/.test(text)

function formatBilingualSeeker(englishText) {
    const HINDI_MAP = [
        ['salary range is', 'आपके क्षेत्र में प्रोफेशनल्स के लिए आमतौर पर वेतन सीमा ₹18,000–₹45,000/महीना होती है। आपका वेतन अपेक्षा बाजार के अनुरूप है। 💡 टिप: अधिक वेतन के लिए सर्टिफिकेशन जोड़ें।'],
        ['opportunities matching your', 'मुझे आपके क्षेत्र में आपकी स्किल्स से मेल खाती हुई नौकरियां मिलीं:\n\n🔧 QuickFix Services — ₹299–₹799/visit\n🏠 HomeHero India — ₹500–₹1,200/day\n⚡ PrimeWork — ₹22,000/month'],
        ['Here are my top tips', 'आप जैसे प्रोफेशनल्स के लिए मेरे शीर्ष सुझाव:\n1️⃣ अपनी प्रोफ़ाइल फ़ोटो पेशेवर रखें\n2️⃣ सरकारी आईडी जोड़ें\n3️⃣ हर काम के बाद रिव्यू मांगें\n4️⃣ 1 घंटे के भीतर जवाब दें\n5️⃣ अपना कार्यक्षेत्र बढ़ाएं'],
        ['You can update your profile', 'ज़रूर! आप अपनी प्रोफ़ाइल जानकारी कभी भी अपडेट कर सकते हैं। बस 📝 "Update My Info" पर क्लिक करें।'],
        ['Your current location', 'आपका वर्तमान स्थान और पसंदीदा कार्य क्षेत्र हमारे पास है। इसे बदलने के लिए प्रोफ़ाइल टैब पर जाएँ।'],
        ['How can I help you today', 'मैं आज आपकी कैसे मदद कर सकता हूँ? आप नौकरियों या वेतन के बारे में पूछ सकते हैं!'],
        ['explore the Browse', 'अधिक जानकारी के लिए सेवाएँ (Services) टैब देखें। आप मुझसे वेतन और सुझावों के बारे में भी पूछ सकते हैं। 😊'],
        ['Profile saved', '✅ प्रोफाइल सेव हो गई!\n\nयहाँ आपका सारांश है:'],
        ['Welcome back', 'वापसी पर स्वागत है! 👋\n\nआपकी प्रोफाइल तैयार है। मुझसे कुछ भी पूछें — नौकरियां, वेतन सुझाव या अवसर।']
    ]
    for (let [frag, hi] of HINDI_MAP) {
        if (englishText.includes(frag)) return `${hi}\n\n${englishText}`
    }
    return englishText
}

function generateAIResponse(userText, profile) {
    const lower = userText.toLowerCase()

    if (lower.includes('salary') || lower.includes('pay') || lower.includes('wage')) {
        return `Based on your profile as a ${profile.title || 'professional'} in ${profile.preferredLocation || 'your area'}, the typical salary range is ₹18,000–₹45,000/month depending on experience. Your expectation of ${profile.expectedSalary} is ${lower.includes('reasonable') ? '' : 'well '}within market range. 💡 Tip: Highlight certifications to command higher rates.`
    }
    if (lower.includes('job') || lower.includes('work') || lower.includes('service') || lower.includes('booking')) {
        return `I found opportunities matching your ${profile.title || 'skill set'} in ${profile.preferredLocation || 'your area'}:\n\n🔧 QuickFix Services — ₹299–₹799/visit\n🏠 HomeHero India — ₹500–₹1,200/day\n⚡ PrimeWork Contractors — ₹22,000/month\n\nVisit the Browse Services tab to apply!`
    }
    if (lower.includes('tip') || lower.includes('improve') || lower.includes('help') || lower.includes('advice')) {
        return `Here are my top tips for ${profile.title || 'professionals'} like you:\n\n1️⃣ Keep your profile photo professional\n2️⃣ Add verified government ID for trust\n3️⃣ Collect reviews after every job\n4️⃣ Be responsive — reply within 1 hour\n5️⃣ Expand your preferred service area`
    }
    if (lower.includes('update') || lower.includes('change') || lower.includes('edit') || lower.includes('redo')) {
        return `Sure! You can update your profile info anytime. Click "Update My Info" below to re-answer the setup questions, or visit the Profile tab to edit directly. 📝`
    }
    if (lower.includes('location') || lower.includes('area') || lower.includes('city')) {
        return `Your current location is set to ${profile.currentLocation || 'unknown'} and preferred work area is ${profile.preferredLocation || 'unknown'}. Want to update these? Just say "update my info" or visit your Profile tab.`
    }
    if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
        return `Hello ${profile.fullName?.split(' ')[0] || 'there'}! 👋 How can I help you today? You can ask me about jobs, salary tips, how to improve your profile, or anything work-related!`
    }
    return `Great question, ${profile.fullName?.split(' ')[0] || 'there'}! As a ${profile.title || 'professional'} in ${profile.preferredLocation || 'your area'}, I suggest exploring the Browse Services tab for the latest opportunities. You can also ask me about salary expectations, tips to grow, or how to update your information. 😊`
}

export default function SeekerOnboardingChat({ onProfileReady }) {
    const [messages, setMessages] = useState([])
    const [modeState, setModeState] = useState('INIT') // INIT, SELECT_MODE, GUIDED, SMART, MISSING_LOCATION, CONFIRM, COMPLETED
    const [guidedIdx, setGuidedIdx] = useState(0)
    const [input, setInput] = useState('')
    const [saving, setSaving] = useState(false)
    const [isTyping, setIsTyping] = useState(false)
    const [minimized, setMinimized] = useState(false)
    const [selection, setSelection] = useState(null) // 'yes' | 'no' | null

    const [answers, setAnswers] = useState({
        fullName: '',
        title: '',
        expectedSalary: '',
        preferredLocation: '',
        currentLocation: '',
    })

    const [languageMode, setLanguageMode] = useState(() => localStorage.getItem('chatLanguageMode') || 'english')

    useEffect(() => {
        const handleModeChange = () => setLanguageMode(localStorage.getItem('chatLanguageMode') || 'english')
        window.addEventListener('storage', handleModeChange)
        window.addEventListener('languageModeChanged', handleModeChange)
        return () => {
            window.removeEventListener('storage', handleModeChange)
            window.removeEventListener('languageModeChanged', handleModeChange)
        }
    }, [])

    const endRef = useRef(null)

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, saving, isTyping])

    const botReply = useCallback((text, delay = 450) => {
        setIsTyping(true)
        setTimeout(() => {
            setIsTyping(false)
            setMessages(prev => [...prev, { id: Date.now() + Math.random(), role: 'bot', text }])
        }, delay)
    }, [])

    const startFlow = useCallback(() => {
        setMessages([])
        const enMsg = "Welcome to Create Your Account with AI Assistance! How would you like to provide your details?"
        const hiMsg = "आपका स्वागत है! आप अपना विवरण कैसे देना चाहेंगे?"
        botReply(languageMode === 'bilingual' ? `${hiMsg}\n${enMsg}` : enMsg)
        setModeState('SELECT_MODE')
    }, [botReply, languageMode])

    useEffect(() => {
        const phone = localStorage.getItem('userPhone')
        const profileKey = phone ? `seekerProfile_${phone}` : 'seekerProfile'
        const onboardingKey = phone ? `seekerOnboardingCompleted_${phone}` : 'seekerOnboardingCompleted'

        const stored = localStorage.getItem(profileKey)
        const done = localStorage.getItem(onboardingKey)
        if (stored && done) {
            const profile = JSON.parse(stored)
            setAnswers(profile)
            setModeState('COMPLETED')
            const engFree = `Welcome back, ${profile.fullName?.split(' ')[0] || 'there'}! 👋\n\nYour profile is all set. Ask me anything — jobs, salary tips, opportunities, or say "update my info" to refresh your profile.`
            const welcomeText = languageMode === 'bilingual' ? formatBilingualSeeker(engFree) : engFree
            setMessages([{ id: 1, role: 'bot', text: welcomeText }])
            onProfileReady?.(profile, false)
        } else {
            startFlow()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [languageMode])

    const showConfirmation = (data) => {
        const enSummary = `Name: ${data.fullName}\nProfession: ${data.title}\nSalary: ${data.expectedSalary}\nLocation: ${data.preferredLocation || data.currentLocation}`
        const enTitle = "Is this correct?\n\n"
        const hiTitle = "क्या यह सही है? / Is this correct?\n\n"
        botReply((languageMode === 'bilingual' ? hiTitle : enTitle) + enSummary, 500)
    }

    const advanceGuided = (userText) => {
        let updated = { ...answers, [GUIDED_STEPS[guidedIdx].key]: userText }
        setAnswers(updated)
        const nextIdx = guidedIdx + 1
        if (nextIdx >= GUIDED_STEPS.length) {
            setModeState('CONFIRM')
            showConfirmation(updated)
            return
        }
        setGuidedIdx(nextIdx)
        const nextStep = GUIDED_STEPS[nextIdx]
        botReply(languageMode === 'bilingual' ? nextStep.hi : nextStep.en)
    }

    const processSmartInput = (text) => {
        const extracted = extractDetails(text)
        setAnswers(extracted)
        if (!extracted.preferredLocation && !extracted.currentLocation) {
            setModeState('MISSING_LOCATION')
            const enMsg = "You have not provided your location.\nPlease tell your preferred location."
            const hiMsg = "आपने अपना स्थान नहीं बताया है।\nकृपया अपना पसंदीदा स्थान बताएं।"
            botReply(languageMode === 'bilingual' ? `${hiMsg}\n\n${enMsg}` : enMsg)
        } else {
            setModeState('CONFIRM')
            showConfirmation(extracted)
        }
    }

    const confirmAccount = async (isYes) => {
        setSelection(isYes ? 'yes' : 'no')
        setMessages(prev => [...prev, { id: Date.now(), role: 'user', text: isYes ? 'YES' : 'NO' }])

        if (isYes) {
            setSaving(true)
            setIsTyping(true)
            await new Promise(r => setTimeout(r, 800))
            setSelection(null)

            const phone = localStorage.getItem('userPhone')
            const profileKey = phone ? `seekerProfile_${phone}` : 'seekerProfile'
            const onboardingKey = phone ? `seekerOnboardingCompleted_${phone}` : 'seekerOnboardingCompleted'
            const accountKey = phone ? `accountCreated_${phone}` : 'accountCreated'

            localStorage.setItem(profileKey, JSON.stringify(answers))
            localStorage.setItem(onboardingKey, 'true')
            localStorage.setItem(accountKey, 'true')
            window.dispatchEvent(new Event('accountCreated'))
            setSaving(false)
            setIsTyping(false)
            setModeState('COMPLETED')
            onProfileReady?.(answers, true)

            const name = answers.fullName?.split(' ')[0] || 'there'
            const engSummary = `✅ Profile saved, ${name}!\n\nHere's your summary:\n👤 ${answers.fullName}\n💼 ${answers.title}\n💰 ${answers.expectedSalary}\n📍 ${answers.preferredLocation || answers.currentLocation}\n\nYour overview is ready below. Feel free to ask me anything anytime — I'm always here! 🚀`

            botReply(languageMode === 'bilingual' ? formatBilingualSeeker(engSummary) : engSummary, 600)
            setSelection(null)
            setAnswers({ fullName: '', title: '', expectedSalary: '', preferredLocation: '', currentLocation: '' })
            setGuidedIdx(0)
            const hiRestart = "आइए फिर से कोशिश करते हैं। / Let's try again."
            const enRestart = "Let's try again."
            botReply(languageMode === 'bilingual' ? hiRestart : enRestart)

            setTimeout(() => {
                const enMsg = "How would you like to provide your details?"
                const hiMsg = "आप अपना विवरण कैसे देना चाहेंगे?"
                botReply(languageMode === 'bilingual' ? `${hiMsg}\n${enMsg}` : enMsg)
                setModeState('SELECT_MODE')
            }, 800)
        }
    }

    const handleFreeChat = (userText) => {
        const englishResponse = generateAIResponse(userText, answers)
        const finalResponse = languageMode === 'bilingual' ? formatBilingualSeeker(englishResponse) : englishResponse
        botReply(finalResponse, 700)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (saving || isTyping || !input.trim()) return
        const text = input.trim()

        if (languageMode === 'english' && isHindiText(text) && modeState === 'COMPLETED') {
            setMessages(prev => [...prev, { id: Date.now(), role: 'bot', text: '⚠ Please enable Upgrade to chat in Hindi.' }])
            setInput('')
            return
        }

        setInput('')

        setMessages(prev => [...prev, { id: Date.now(), role: 'user', text }])

        if (modeState === 'COMPLETED') {
            handleFreeChat(text)
        } else if (modeState === 'GUIDED') {
            advanceGuided(text)
        } else if (modeState === 'SMART') {
            processSmartInput(text)
        } else if (modeState === 'MISSING_LOCATION') {
            const updated = { ...answers, preferredLocation: text, currentLocation: text }
            setAnswers(updated)
            setModeState('CONFIRM')
            showConfirmation(updated)
        }
    }

    const startOver = () => {
        setCompletedModeFromUI()
    }

    const setCompletedModeFromUI = () => {
        setModeState('SELECT_MODE')
        setAnswers({ fullName: '', title: '', expectedSalary: '', preferredLocation: '', currentLocation: '' })
        const prefix = languageMode === 'bilingual' ? "ज़रूर! चलिए आपकी प्रोफ़ाइल अपडेट करते हैं। 📝" : "Sure! Let's update your profile. 📝"
        const enMsg = "How would you like to provide your details?"
        const hiMsg = "आप अपना विवरण कैसे देना चाहेंगे?"
        const ask = languageMode === 'bilingual' ? `${hiMsg}\n${enMsg}` : enMsg

        setMessages([{ id: Date.now(), role: 'bot', text: `${prefix}\n\n${ask}` }])
    }

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-accent-500 px-5 py-4 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-xl">🤖</div>
                    <div>
                        <p className="font-bold text-base leading-tight">Create Your Account with AI Assistance</p>
                        <p className="text-primary-100 text-xs">
                            {modeState === 'COMPLETED' ? '✦ Profile complete · Ask me anything' : 'Account Setup'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {modeState === 'COMPLETED' && (
                        <button
                            onClick={startOver}
                            className="text-xs bg-white/20 hover:bg-white/30 text-white font-semibold px-3 py-1.5 rounded-lg transition-colors"
                        >
                            ✏️ Update Info
                        </button>
                    )}
                    <button
                        onClick={() => setMinimized(m => !m)}
                        className="text-xs bg-white/20 hover:bg-white/30 text-white font-semibold w-7 h-7 rounded-lg transition-colors flex items-center justify-center"
                        aria-label={minimized ? 'Expand' : 'Minimise'}
                    >
                        {minimized ? '▲' : '▼'}
                    </button>
                </div>
            </div>

            {!minimized && (
                <div className="flex flex-col h-[420px] bg-gray-50">
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map(m => (
                            <MessageBubble key={m.id} msg={m} />
                        ))}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex gap-1 items-center">
                                    <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce [animation-delay:0ms]" />
                                    <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce [animation-delay:150ms]" />
                                    <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce [animation-delay:300ms]" />
                                </div>
                            </div>
                        )}
                        <div ref={endRef} />
                    </div>

                    {/* Input area */}
                    {modeState === 'SELECT_MODE' ? (
                        <div className="p-4 bg-white border-t border-gray-100">
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setMessages(prev => [...prev, { id: Date.now(), role: 'user', text: 'Guided Mode' }])
                                        setModeState('GUIDED')
                                        setGuidedIdx(0)
                                        botReply(languageMode === 'bilingual' ? GUIDED_STEPS[0].hi : GUIDED_STEPS[0].en)
                                    }}
                                    disabled={saving || isTyping}
                                    className="flex-1 btn-secondary py-2"
                                >
                                    {languageMode === 'bilingual' ? 'गाइडेड मोड / Guided' : 'Guided Mode'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setMessages(prev => [...prev, { id: Date.now(), role: 'user', text: 'Smart Input Mode' }])
                                        setModeState('SMART')
                                        botReply(languageMode === 'bilingual'
                                            ? 'कृपया एक पैराग्राफ में अपना नाम, पेशा, अपेक्षित वेतन और स्थान दें। / Please provide your Name, Profession, Expected Salary, and Location in a single paragraph.'
                                            : 'Please provide your Name, Profession, Expected Salary, and Location in a single paragraph.')
                                    }}
                                    disabled={saving || isTyping}
                                    className="flex-1 btn-secondary py-2"
                                >
                                    {languageMode === 'bilingual' ? 'स्मार्ट मोड / Smart' : 'Smart Input Mode'}
                                </button>
                            </div>
                        </div>
                    ) : modeState === 'CONFIRM' ? (
                        <div className="p-4 bg-white border-t border-gray-100">
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => confirmAccount(true)}
                                    disabled={saving || isTyping}
                                    className={`flex-1 border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white font-bold py-2 rounded-xl transition-all duration-200 disabled:opacity-50 ${selection === 'yes' ? 'bg-primary-500 text-white' : ''}`}
                                >
                                    YES
                                </button>
                                <button
                                    type="button"
                                    onClick={() => confirmAccount(false)}
                                    disabled={saving || isTyping}
                                    className={`flex-1 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-bold py-2 rounded-xl transition-all duration-200 disabled:opacity-50 ${selection === 'no' ? 'bg-red-500 text-white' : ''}`}
                                >
                                    NO
                                </button>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-gray-100 flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder={
                                    modeState === 'COMPLETED'
                                        ? (languageMode === 'bilingual' ? 'नौकरियों, वेतन, सुझावों के बारे में पूछें… / Ask me about jobs...' : 'Ask me about jobs, salary, tips…')
                                        : modeState === 'GUIDED'
                                            ? (GUIDED_STEPS[guidedIdx]?.placeholder || 'Type here…')
                                            : 'Type here...'
                                }
                                className="flex-1 input-field py-2"
                                autoFocus
                                disabled={saving || isTyping}
                            />
                            <button type="submit" className="btn-primary px-5 py-2" disabled={saving || isTyping || !input.trim()}>
                                {saving ? '…' : '↑'}
                            </button>
                        </form>
                    )}
                </div>
            )}
        </div>
    )
}
