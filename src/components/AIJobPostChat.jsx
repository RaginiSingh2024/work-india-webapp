import { useEffect, useMemo, useRef, useState } from 'react'

function MessageBubble({ msg }) {
    const isBot = msg.role === 'bot'
    return (
        <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} animate-slide-up`}>
            <div
                className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${isBot
                    ? 'bg-white text-gray-800 border border-gray-100 rounded-bl-sm shadow-sm'
                    : 'bg-gradient-to-br from-primary-600 to-accent-400 text-white rounded-br-sm shadow-md'
                    }`}
            >
                {msg.text}
            </div>
        </div>
    )
}

function formatJobPreview(job) {
    const salaryLine = job.salaryType && job.salaryRange
        ? `${job.salaryRange} / ${job.salaryType === 'hourly' ? 'hour' : 'month'}`
        : job.salaryRange

    const skillsLine = Array.isArray(job.requiredSkills)
        ? job.requiredSkills.join(', ')
        : job.requiredSkills

    return [
        `Employer Name: ${job.employerName || '-'}`,
        `Job Role Title: ${job.jobRoleTitle || '-'}`,
        `Required Skills: ${skillsLine || '-'}`,
        `Experience Level: ${job.experienceLevel || '-'}`,
        `Salary Range: ${salaryLine || '-'}`,
        `Location: ${job.location || '-'}`,
        `Job Type: ${job.jobType || '-'}`,
    ].join('\n')
}

export default function AIJobPostChat() {
    const steps = useMemo(
        () => [
            { key: 'employerName', question: "Let's create a job post. What's the employer name?", placeholder: 'Employer name' },
            { key: 'jobRoleTitle', question: 'What is the job role title?', placeholder: 'e.g. Senior Electrician' },
            { key: 'requiredSkills', question: 'List required skills (comma separated).', placeholder: 'e.g. Wiring, MCB fitting' },
            { key: 'experienceLevel', question: 'What experience level is required?', placeholder: 'e.g. 3-5 years' },
            { key: 'salaryType', question: 'Salary type?', kind: 'salaryType' },
            { key: 'salaryRange', question: 'What is the salary range?', placeholder: 'e.g. ₹15,000–₹25,000 or ₹150–₹250', kind: 'salaryRange' },
            { key: 'location', question: 'What is the job location?', placeholder: 'e.g. Bangalore / Remote' },
            { key: 'jobType', question: 'What is the job type?', kind: 'jobType' },
        ],
        []
    )

    const [messages, setMessages] = useState([])
    const [currentIdx, setCurrentIdx] = useState(0)
    const [input, setInput] = useState('')
    const [job, setJob] = useState({
        employerName: '',
        jobRoleTitle: '',
        requiredSkills: [],
        experienceLevel: '',
        salaryType: 'monthly',
        salaryRange: '',
        location: '',
        jobType: 'Full-time',
    })
    const [mode, setMode] = useState('chat') // chat | preview | published
    const [working, setWorking] = useState(false)

    const endRef = useRef(null)

    useEffect(() => {
        if (messages.length === 0) {
            setMessages([{ id: 1, role: 'bot', text: steps[0].question }])
        }
    }, [messages.length, steps])

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, working, mode])

    const applyAnswer = (step, userText) => {
        if (step.kind === 'salaryType') {
            const v = userText.toLowerCase().includes('hour') ? 'hourly' : 'monthly'
            setJob(prev => ({ ...prev, salaryType: v }))
            return { salaryType: v }
        }

        if (step.key === 'requiredSkills') {
            const skills = userText.split(',').map(s => s.trim()).filter(Boolean)
            setJob(prev => ({ ...prev, requiredSkills: skills }))
            return { requiredSkills: skills }
        }

        setJob(prev => ({ ...prev, [step.key]: userText }))
        return { [step.key]: userText }
    }

    const goToPreview = (finalJob) => {
        setWorking(true)
        setMessages(prev => [...prev, { id: Date.now(), role: 'bot', text: 'Generating your job preview…' }])
        setTimeout(() => {
            setWorking(false)
            setMode('preview')
            setMessages(prev => [...prev, { id: Date.now() + 1, role: 'bot', text: 'Here is the formatted job preview. You can publish or edit.' }])
        }, 900)

        localStorage.setItem('draftJobPost', JSON.stringify(finalJob))
    }

    const advance = (userText) => {
        const step = steps[currentIdx]
        setMessages(prev => [...prev, { id: Date.now(), role: 'user', text: userText }])

        const patch = applyAnswer(step, userText)
        const updated = { ...job, ...patch }

        const nextIdx = currentIdx + 1
        if (nextIdx >= steps.length) {
            goToPreview(updated)
            return
        }

        setCurrentIdx(nextIdx)
        setTimeout(() => {
            setMessages(prev => [...prev, { id: Date.now() + 2, role: 'bot', text: steps[nextIdx].question }])
        }, 450)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (working || mode !== 'chat') return

        const step = steps[currentIdx]
        if (step.kind === 'salaryType' || step.kind === 'jobType') return

        const text = input.trim()
        if (!text) return
        setInput('')
        advance(text)
    }

    const handleEdit = () => {
        setMode('chat')
        setCurrentIdx(0)
        setInput('')
        setMessages([{ id: Date.now(), role: 'bot', text: steps[0].question }])
    }

    const handlePublish = () => {
        setWorking(true)
        setTimeout(() => {
            setWorking(false)
            setMode('published')
            localStorage.setItem('publishedJobPost', JSON.stringify(job))
        }, 700)
    }

    const currentStep = steps[currentIdx]

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">AI Job Post</h2>
                    <p className="text-gray-500 text-sm mt-1">Create a job post with a quick conversation — no forms.</p>
                </div>
            </div>

            {mode === 'published' ? (
                <div className="space-y-6 animate-fade-in flex flex-col items-center justify-center min-h-[60vh]">
                    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 w-full max-w-lg p-10 text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-xl shadow-green-500/30 text-4xl">
                            🚀
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Job Published!</h2>
                        <p className="text-gray-500 text-sm mb-8">Your job post is now live (simulated).</p>
                        <button onClick={handleEdit} className="btn-primary w-full py-3 text-base shadow-lg">✨ Post Another Job</button>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="bg-gradient-to-r from-primary-600 to-accent-500 px-6 py-4 text-white flex items-center gap-3">
                        <span className="text-2xl">🤖</span>
                        <div>
                            <p className="font-bold text-base">AI Job Post Builder</p>
                            <p className="text-primary-100 text-xs">Chat-driven job creation</p>
                        </div>
                    </div>

                    <div className="flex flex-col h-[520px] bg-gray-50">
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map(m => (
                                <MessageBubble key={m.id} msg={m} />
                            ))}
                            {mode === 'preview' && (
                                <div className="animate-fade-in">
                                    <div className="bg-gray-900 text-gray-50 rounded-2xl p-4 whitespace-pre-wrap text-sm border border-gray-800 shadow-sm">
                                        {formatJobPreview(job)}
                                    </div>
                                    <div className="mt-4 flex gap-3">
                                        <button onClick={handlePublish} disabled={working} className="btn-primary flex-1 py-2.5 disabled:opacity-60">Publish Job</button>
                                        <button onClick={handleEdit} disabled={working} className="btn-secondary flex-1 py-2.5 disabled:opacity-60">Edit Job</button>
                                    </div>
                                </div>
                            )}
                            <div ref={endRef} />
                        </div>

                        {mode === 'chat' && currentStep?.kind === 'salaryType' && (
                            <div className="p-4 bg-white border-t border-gray-100">
                                <div className="flex gap-2">
                                    <button type="button" onClick={() => advance('Monthly')} disabled={working} className="flex-1 btn-secondary py-2">Monthly</button>
                                    <button type="button" onClick={() => advance('Hourly')} disabled={working} className="flex-1 btn-secondary py-2">Hourly</button>
                                </div>
                            </div>
                        )}

                        {mode === 'chat' && currentStep?.kind === 'jobType' && (
                            <div className="p-4 bg-white border-t border-gray-100">
                                <div className="grid grid-cols-2 gap-2">
                                    {['Full-time', 'Part-time', 'Contract', 'Same Day'].map(t => (
                                        <button
                                            key={t}
                                            type="button"
                                            onClick={() => advance(t)}
                                            disabled={working}
                                            className="btn-secondary py-2"
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {mode === 'chat' && !['salaryType', 'jobType'].includes(currentStep?.kind) && (
                            <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-gray-100 flex gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder={currentStep?.placeholder || 'Type here…'}
                                    className="flex-1 input-field py-2"
                                    autoFocus
                                    disabled={working}
                                />
                                <button type="submit" className="btn-primary px-5 py-2" disabled={working || !input.trim()}>
                                    Send
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
