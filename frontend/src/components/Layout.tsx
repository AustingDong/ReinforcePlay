import { ReactNode, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { BookOpen, Gamepad2, Home, Menu, X, Sparkles } from 'lucide-react'
import clsx from 'clsx'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  
  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/learn', label: 'Learn', icon: BookOpen },
    { path: '/playground', label: 'Playground', icon: Gamepad2 },
  ]
  
  return (
    <>
      {/* Sidebar Overlay - Animated backdrop */}
      <div 
        className={clsx(
          'fixed inset-0 bg-gradient-to-br from-purple-900/50 via-blue-900/50 to-pink-900/50 backdrop-blur-sm z-40 transition-opacity duration-300',
          isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={() => setIsSidebarOpen(false)}
      />
      
      {/* Sidebar - Fixed with fancy design */}
      <aside
        className={clsx(
          'fixed top-0 left-0 h-full w-72 z-50 transition-transform duration-300 ease-out',
          'bg-gradient-to-b from-white via-purple-50/30 to-blue-50/30',
          'border-r border-gray-200 shadow-2xl',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Animated background pattern */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -right-20 w-40 h-40 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full blur-3xl" />
        </div>

        {/* Header with gradient */}
        <div className="relative p-6 border-b border-purple-100 bg-gradient-to-r from-purple-50/50 to-blue-50/50">
          <div className="flex items-center justify-between">
            <Link 
              to="/" 
              className="flex items-center gap-3 group" 
              onClick={() => setIsSidebarOpen(false)}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                <span className="text-white font-bold text-xl">RP</span>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                  ReinforcePlay
                </h1>
                <p className="text-xs text-gray-600 font-medium flex items-center gap-1">
                  Learn RL Visually <Sparkles className="w-3 h-3 text-purple-500" />
                </p>
              </div>
            </Link>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 hover:bg-white/80 rounded-full transition-all hover:rotate-90 transform duration-300 backdrop-blur-sm"
              title="Close"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Navigation with fancy hover effects */}
        <nav className="p-4 relative z-10">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path || 
                (item.path !== '/' && location.pathname.startsWith(item.path))
              
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => setIsSidebarOpen(false)}
                    className={clsx(
                      'flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 relative overflow-hidden group',
                      isActive
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-lg shadow-purple-200'
                        : 'text-gray-700 hover:bg-white/70 hover:shadow-md backdrop-blur-sm'
                    )}
                  >
                    {/* Hover glow effect for inactive items */}
                    {!isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-pink-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                    )}
                    
                    {/* Icon with glow for active */}
                    <div className={clsx(
                      'relative z-10 transition-transform group-hover:scale-110',
                      isActive && 'drop-shadow-sm'
                    )}>
                      <Icon className="w-5 h-5" />
                    </div>
                    
                    {/* Label */}
                    <span className="relative z-10">{item.label}</span>
                    
                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute right-3 w-2 h-2 bg-white rounded-full animate-pulse" />
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Footer with gradient */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-purple-200/50 bg-gradient-to-t from-white/80 to-transparent backdrop-blur-sm">
          <div className="text-xs text-gray-600 text-center space-y-1.5">
            <p className="font-medium">Built with React + FastAPI</p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-200">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-purple-700 font-bold">v1.0.0</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Nearly Transparent Menu Button - Fixed */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className={clsx(
          'fixed top-4 left-4 z-30 w-14 h-14 rounded-2xl shadow-lg flex items-center justify-center transition-all duration-300 group',
          'bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 text-white',
          'hover:scale-110 hover:rotate-6 hover:shadow-purple-500/50',
          isSidebarOpen 
            ? 'opacity-0 pointer-events-none scale-50' 
            : 'opacity-20 hover:opacity-100 scale-100'
        )}
        title="Open navigation"
      >
        {/* Pulsing ring - only visible on hover */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-400 animate-ping opacity-0 group-hover:opacity-20 transition-opacity" />
        
        {/* Icon */}
        <Menu className="w-7 h-7 relative z-10 drop-shadow-lg transform group-hover:scale-110 transition-transform" />
      </button>

      {/* Main Content */}
      <main className="min-h-screen bg-gray-50">
        {children}
      </main>
    </>
  )
}
