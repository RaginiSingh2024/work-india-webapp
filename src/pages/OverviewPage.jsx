import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function ProfileOverviewCard({ profile }) {
    const recommendations = [
        { company: 'QuickFix Services', type: profile.title || 'Service Work', salary: '₹299–₹799/visit', badge: 'Hot Match 🔥', badgeColor: 'bg-red-100 text-red-600' },
        { company: 'HomeHero India', type: profile.title || 'Home Services', salary: '₹22,000–₹35,000/mo', badge: 'Top Pick ⭐', badgeColor: 'bg-yellow-100 text-yellow-700' },
        { company: 'PrimeWork Contractors', type: profile.title || 'Contract Work', salary: '₹400–₹600/hr', badge: 'New ✨', badgeColor: 'bg-primary-100 text-primary-700' },
    ]

    return (
        <div className="animate-fade-in space-y-5">
            <div className="flex items-center gap-3">
                <div className="w-1 h-7 rounded-full bg-gradient-to-b from-primary-400 to-primary-700" />
                <h3 className="text-lg font-bold text-gray-900">Your AI-Generated Overview</h3>
                <span className="text-xs bg-primary-100 text-primary-700 px-2.5 py-1 rounded-full font-semibold">🤖 AI Generated</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Profile Summary */}
                <div className="card">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-400 flex items-center justify-center text-white text-xl font-extrabold shadow-lg">
                            {profile.fullName?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div>
                            <p className="font-bold text-gray-900">{profile.fullName}</p>
                            <p className="text-primary-600 text-sm font-medium">{profile.title}</p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        {[
                            { icon: '💰', label: 'Expected Salary', value: `${profile.expectedSalary} (${profile.salaryType})` },
                            { icon: '📍', label: 'Current Location', value: profile.currentLocation },
                            { icon: '🎯', label: 'Preferred Work Area', value: profile.preferredLocation },
                        ].map(f => (
                            <div key={f.label} className="flex items-center gap-3 text-sm">
                                <span className="text-base w-5 text-center flex-shrink-0">{f.icon}</span>
                                <div>
                                    <p className="text-gray-400 text-xs font-medium">{f.label}</p>
                                    <p className="text-gray-800 font-semibold">{f.value || '—'}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* AI Matches */}
                <div className="card">
                    <h4 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wider text-primary-600">
                        🎯 AI-Matched Opportunities
                    </h4>
                    <div className="space-y-3">
                        {recommendations.map((r, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-[#f5fbee] rounded-xl border border-primary-100">
                                <div>
                                    <p className="font-semibold text-gray-900 text-sm">{r.company}</p>
                                    <p className="text-gray-500 text-xs">{r.type} · {r.salary}</p>
                                </div>
                                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${r.badgeColor}`}>{r.badge}</span>
                            </div>
                        ))}
                    </div>
                    <Link to="/dashboard/jobs" className="btn-primary w-full text-center text-sm mt-4 inline-block py-2.5">
                        Browse All Matches →
                    </Link>
                </div>
            </div>

            {/* Profile Completeness */}
            <div className="card">
                <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-gray-700">Profile Completeness</p>
                    <span className="text-primary-600 font-bold text-sm">85%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-gradient-to-r from-primary-600 to-accent-400 h-2 rounded-full transition-all duration-700" style={{ width: '85%' }} />
                </div>
                <p className="text-xs text-gray-400 mt-2">Add a profile photo and upload your ID proof to reach 100%</p>
                <Link to="/dashboard/profile" className="text-xs text-primary-600 font-semibold hover:text-primary-700 mt-2 inline-block">
                    Complete Profile →
                </Link>
            </div>
        </div>
    )
}

export default function OverviewPage() {
    const [role, setRole] = useState('jobseeker')
    const [userName, setUserName] = useState('Priya Sharma')
    const [seekerProfile, setSeekerProfile] = useState(null)

    useEffect(() => {
        const storedRole = localStorage.getItem('userRole') || 'jobseeker'
        const storedName = localStorage.getItem('userName') || 'Priya Sharma'
        setRole(storedRole)
        setUserName(storedName)

        const stored = localStorage.getItem('seekerProfile')
        if (stored) {
            try { setSeekerProfile(JSON.parse(stored)) } catch (_) { /* ignore */ }
        }
    }, [])

    const STATS = [
        { label: 'Total Bookings', value: '1,284', change: '+12% this week', icon: '🏠', color: 'from-primary-400 to-primary-600' },
        { label: 'Active Requests', value: '23', change: '3 pending confirmation', icon: '📋', color: 'from-primary-300 to-accent-600' },
        { label: 'Saved Services', value: '47', change: '5 expiring soon', icon: '🔖', color: 'from-accent-400 to-primary-700' },
    ]

    const RECENT_JOBS = [
        { id: 1, title: 'Plumbing Repair', company: 'QuickFix Services', location: 'Bangalore, KA', salary: '₹299–₹799', type: 'Same Day', logo: 'P', logoColor: 'from-primary-400 to-primary-600', posted: '2 days ago', badge: 'Hot 🔥', badgeColor: 'bg-red-100 text-red-600' },
        { id: 2, title: 'Electrical Work', company: 'PowerPro Experts', location: 'Hyderabad, TS', salary: '₹499–₹1,499', type: 'On-site', logo: 'E', logoColor: 'from-yellow-400 to-orange-500', posted: '1 day ago', badge: 'Urgent', badgeColor: 'bg-orange-100 text-orange-600' },
        { id: 3, title: 'AC Service & Repair', company: 'CoolAir Solutions', location: 'Mumbai, MH', salary: '₹599–₹1,999', type: 'On-site', logo: 'A', logoColor: 'from-orange-400 to-red-400', posted: '3 days ago', badge: 'New ✨', badgeColor: 'bg-green-100 text-green-600' },
        { id: 4, title: 'Home Deep Cleaning', company: 'CleanNest India', location: 'Delhi, DL', salary: '₹799–₹2,499', type: 'Scheduled', logo: 'C', logoColor: 'from-red-400 to-red-600', posted: '5 days ago', badge: 'Popular', badgeColor: 'bg-primary-100 text-primary-700' },
    ]

    const ACTIVITIES = [
        { text: 'Booked Plumbing service with Ramesh Kumar', time: '2h ago', icon: '✅' },
        { text: 'Saved Carpenter service from WoodCraft Experts', time: '1d ago', icon: '🔖' },
        { text: 'Profile viewed by CleanNest India team', time: '2d ago', icon: '👁️' },
        { text: 'Service review submitted successfully', time: '3d ago', icon: '📄' },
    ]

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl p-6 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold">Welcome back, {userName.split(' ')[0]}! 👋</h2>
                    <p className="text-primary-100 text-sm mt-1">
                        You have 3 new services available in your area. Book now!
                    </p>
                </div>
                <Link to="/dashboard/jobs" className="bg-white text-primary-700 hover:bg-yellow-300 hover:text-primary-900 font-semibold px-5 py-2.5 rounded-xl text-sm transition-all duration-200 shadow-lg whitespace-nowrap">
                    View Services →
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {STATS.map(stat => (
                    <div key={stat.label} id={`overview-stat-${stat.label.toLowerCase().replace(/\s+/g, '-')}`} className="card group hover:-translate-y-1 transition-all duration-300">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                                <p className="text-3xl font-extrabold text-gray-900 mt-1">{stat.value}</p>
                                <p className="text-xs text-gray-400 mt-1">{stat.change}</p>
                            </div>
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                {stat.icon}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Jobs + Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-900">Recent Service Matches</h3>
                        <Link to="/dashboard/jobs" className="text-sm text-primary-600 font-semibold hover:text-primary-700 transition-colors">View All →</Link>
                    </div>
                    <div className="space-y-4">
                        {RECENT_JOBS.map(job => (
                            <div key={job.id} id={`overview-job-${job.id}`} className="card hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
                                <div className="flex items-start gap-4">
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${job.logoColor} flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-md`}>
                                        {job.logo}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h4 className="font-bold text-gray-900">{job.title}</h4>
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${job.badgeColor}`}>{job.badge}</span>
                                        </div>
                                        <p className="text-gray-500 text-sm mt-0.5">{job.company}</p>
                                        <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-400">
                                            <span>📍 {job.location}</span>
                                            <span>💰 {job.salary}</span>
                                            <span>🕐 {job.type}</span>
                                            <span>🗓️ {job.posted}</span>
                                        </div>
                                    </div>
                                    <button className="btn-primary py-2 px-4 text-sm flex-shrink-0 hidden sm:block">
                                        Apply
                                    </button>
                                </div>
                                <button className="btn-primary w-full py-2 text-sm mt-3 sm:hidden">Apply Now</button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Activity + Score */}
                <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
                    <div className="card space-y-4">
                        {ACTIVITIES.map((act, i) => (
                            <div key={i} className="flex items-start gap-3 pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                                <span className="text-lg leading-none mt-0.5">{act.icon}</span>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-700 leading-snug">{act.text}</p>
                                    <p className="text-xs text-gray-400 mt-1">{act.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="card mt-5">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-gray-900">Profile Score</h4>
                            <span className="text-primary-600 font-bold">85%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                            <div className="bg-gradient-to-r from-primary-600 to-accent-400 h-2 rounded-full" style={{ width: '85%' }} />
                        </div>
                        <p className="text-xs text-gray-400 mt-2">Add a profile photo and ID to reach 100%</p>
                        <Link to="/dashboard/profile" className="text-xs text-primary-600 font-semibold hover:text-primary-700 mt-2 inline-block">
                            Complete Profile →
                        </Link>
                    </div>
                </div>
            </div>

            {/* AI-Generated Profile Overview */}
            {seekerProfile && (
                <>
                    <div className="flex items-center gap-4 pt-2">
                        <div className="flex-1 h-px bg-gray-200" />
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest px-2">AI Profile Summary</span>
                        <div className="flex-1 h-px bg-gray-200" />
                    </div>
                    <ProfileOverviewCard profile={seekerProfile} />
                </>
            )}
        </div>
    )
}
