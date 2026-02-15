import { Link } from 'react-router-dom'
import { Button, Card } from '../components/common'

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="max-w-5xl mx-auto px-4 pt-16 pb-20 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Floating Cards Animation */}
          <div className="flex justify-center gap-3 mb-8">
            {['5', '8', '13', '?'].map((value, index) => (
              <div
                key={value}
                className="w-12 h-16 sm:w-16 sm:h-22 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg shadow-primary-500/30 flex items-center justify-center text-white font-bold text-xl sm:text-2xl transform hover:-translate-y-2 transition-transform cursor-default"
                style={{
                  animation: `float 3s ease-in-out infinite`,
                  animationDelay: `${index * 0.2}s`,
                }}
              >
                {value}
              </div>
            ))}
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-primary-600 to-purple-600 dark:from-white dark:via-primary-400 dark:to-purple-400 bg-clip-text text-transparent mb-6">
            Planning Poker
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10">
            Real-time agile estimation for distributed teams. Collaborate on story
            points with your team, no matter where they are.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/create">
              <Button size="lg" className="px-8 shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 transition-shadow">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create a Room
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-5xl mx-auto px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-6">
          <Card variant="outlined" padding="lg" className="group hover:border-primary-200 dark:hover:border-primary-800 hover:shadow-lg transition-all">
            <div className="text-center">
              <div className="w-14 h-14 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/50 dark:to-primary-800/50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <svg
                  className="w-7 h-7 text-primary-600 dark:text-primary-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Real-time Collaboration
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                All participants see votes instantly. No refreshing needed.
              </p>
            </div>
          </Card>

          <Card variant="outlined" padding="lg" className="group hover:border-primary-200 dark:hover:border-primary-800 hover:shadow-lg transition-all">
            <div className="text-center">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/50 dark:to-purple-800/50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <svg
                  className="w-7 h-7 text-purple-600 dark:text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Multiple Decks
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Choose from Fibonacci, Scrum, Sequential, or T-shirt sizing.
              </p>
            </div>
          </Card>

          <Card variant="outlined" padding="lg" className="group hover:border-primary-200 dark:hover:border-primary-800 hover:shadow-lg transition-all">
            <div className="text-center">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/50 dark:to-amber-800/50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <svg
                  className="w-7 h-7 text-amber-600 dark:text-amber-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Vote Statistics
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                See average, distribution, and export PDF reports.
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* How it works */}
      <div className="max-w-4xl mx-auto px-4 pb-20 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-10">
          How it works
        </h2>
        <div className="grid sm:grid-cols-4 gap-8">
          {[
            { step: 1, label: 'Create a room', icon: '🏠' },
            { step: 2, label: 'Share the link', icon: '🔗' },
            { step: 3, label: 'Vote on stories', icon: '🗳️' },
            { step: 4, label: 'Reach consensus', icon: '✅' },
          ].map((item, index) => (
            <div key={item.step} className="text-center relative">
              {index < 3 && (
                <div className="hidden sm:block absolute top-6 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary-300 to-primary-100 dark:from-primary-700 dark:to-primary-900" />
              )}
              <div className="relative z-10 w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 font-bold text-lg shadow-lg shadow-primary-500/30">
                {item.step}
              </div>
              <div className="text-3xl mb-2">{item.icon}</div>
              <p className="text-gray-600 dark:text-gray-400 font-medium">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Add floating animation keyframes */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(-3deg); }
          50% { transform: translateY(-10px) rotate(3deg); }
        }
      `}</style>
    </div>
  )
}
