import { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookOpen, Gamepad2, Home } from 'lucide-react'
import clsx from 'clsx'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation()
  
  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/learn', label: 'Learn', icon: BookOpen },
    { path: '/playground', label: 'Playground', icon: Gamepad2 },
  ]
  
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-64 bg-white border-r border-gray-200 shadow-sm fixed h-full z-10"
      >
        <div className="p-6">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">RP</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">ReinforcePlay</h1>
              <p className="text-xs text-gray-500">Learn RL Visually</p>
            </div>
          </Link>
        </div>
        
        <nav className="px-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path || 
              (item.path !== '/' && location.pathname.startsWith(item.path))
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={clsx(
                  'flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200',
                  isActive
                    ? 'bg-primary-50 text-primary-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">
            <p>Built with React + FastAPI</p>
            <p className="mt-1">v1.0.0</p>
          </div>
        </div>
      </motion.aside>
      
      {/* Main content */}
      <main className="flex-1 ml-64">
        <div className="min-h-screen">
          {children}
        </div>
      </main>
    </div>
  )
}

