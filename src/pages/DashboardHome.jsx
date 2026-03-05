import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import SeekerOnboardingChat from '../components/SeekerOnboardingChat'

export default function DashboardHome() {
    const [role, setRole] = useState('jobseeker')
    const [userName, setUserName] = useState('Priya Sharma')
    const [onboardingDone, setOnboardingDone] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const storedRole = localStorage.getItem('userRole') || 'jobseeker'
        const storedName = localStorage.getItem('userName') || 'Priya Sharma'
        setRole(storedRole)
        setUserName(storedName)
        setOnboardingDone(!!localStorage.getItem('seekerOnboardingCompleted'))
    }, [])


    const handleProfileReady = (profile, isNew) => {
        setOnboardingDone(true)
        if (isNew) {
            // Fire a storage event so DashboardLayout re-reads and shows Overview tab
            window.dispatchEvent(new Event('storage'))
            // Navigate to the overview page after a short delay for the completion message to show
            setTimeout(() => {
                navigate('/dashboard/overview')
            }, 2000)
        }
    }

    // Providers don't see the AI Assistant tab — redirect to a generic home
    if (role === 'provider') {
        return (
            <div className="space-y-6 animate-fade-in">
                <div className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl p-6 text-white">
                    <h2 className="text-xl font-bold">Welcome back, {userName.split(' ')[0]}! 👋</h2>
                    <p className="text-primary-100 text-sm mt-1">You have 5 new booking requests waiting for your approval.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-5 animate-fade-in max-w-3xl">
            {/* Welcome header */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900">
                    {onboardingDone ? 'Career Assistant AI' : `Welcome, ${userName.split(' ')[0]}! 👋`}
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                    {onboardingDone
                        ? 'Your assistant is ready. Ask me anything anytime.'
                        : 'Complete the quick AI setup to unlock your personalised Overview tab.'}
                </p>
            </div>

            {/* Progress steps — only shown before completion */}
            {!onboardingDone && (
                <div className="flex items-center gap-3 p-4 bg-primary-50 border border-primary-100 rounded-2xl">
                    <div className="flex items-center gap-2 flex-1">
                        {['AI Assistant', 'Overview'].map((step, i) => (
                            <div key={step} className="flex items-center gap-2">
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${i === 0 ? 'bg-primary-600 text-white shadow-md' : 'bg-gray-200 text-gray-400'}`}>
                                    {i + 1}
                                </div>
                                <span className={`text-sm font-medium ${i === 0 ? 'text-primary-700' : 'text-gray-400'}`}>{step}</span>
                                {i < 1 && <div className="w-8 h-px bg-gray-300 mx-1" />}
                            </div>
                        ))}
                    </div>
                    <span className="text-xs text-primary-600 font-semibold bg-primary-100 px-2.5 py-1 rounded-full">Step 1 of 2</span>
                </div>
            )}

            {/* Career Assistant AI — always shown on this page */}
            <SeekerOnboardingChat onProfileReady={handleProfileReady} />

            {/* Hint after not-yet-done */}
            {!onboardingDone && (
                <p className="text-center text-xs text-gray-400">
                    🔒 Overview tab unlocks after you complete the assistant setup above
                </p>
            )}
        </div>
    )
}
