import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, CheckCircle, List, Network } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import BanditLesson from '@/components/lessons/BanditLesson'
import MDPLesson from '@/components/lessons/MDPLesson'
import QLearningLesson from '@/components/lessons/QLearningLesson'
import SARSALesson from '@/components/lessons/SARSALesson'
import TDLambdaLesson from '@/components/lessons/TDLambdaLesson'
import REINFORCELesson from '@/components/lessons/REINFORCELesson'
import A2CLesson from '@/components/lessons/A2CLesson'
import PolicyGradientLesson from '@/components/lessons/PolicyGradientLesson'
import AlgorithmTree from '@/components/AlgorithmTree'

interface Chapter {
  id: number
  title: string
  description: string
  component: React.ComponentType
}

const chapters: Chapter[] = [
  {
    id: 0,
    title: 'Multi-Armed Bandit',
    description: 'Learn the exploration vs. exploitation tradeoff',
    component: BanditLesson,
  },
  {
    id: 1,
    title: 'Markov Decision Process',
    description: 'Understand states, actions, and rewards',
    component: MDPLesson,
  },
  {
    id: 2,
    title: 'Q-Learning',
    description: 'Master off-policy temporal difference learning',
    component: QLearningLesson,
  },
  {
    id: 3,
    title: 'SARSA',
    description: 'Learn on-policy TD learning and compare with Q-Learning',
    component: SARSALesson,
  },
  {
    id: 4,
    title: 'TD(λ) - Eligibility Traces',
    description: 'Bridge between TD and Monte Carlo using eligibility traces',
    component: TDLambdaLesson,
  },
  {
    id: 5,
    title: 'REINFORCE (1992)',
    description: 'Foundation of policy gradient methods',
    component: REINFORCELesson,
  },
  {
    id: 6,
    title: 'A2C (2016)',
    description: 'Actor-Critic methods reduce variance',
    component: A2CLesson,
  },
  {
    id: 7,
    title: 'PPO (2017)',
    description: 'Modern policy optimization - state of the art',
    component: PolicyGradientLesson,
  },
]

export default function LearningMode() {
  const { chapterId } = useParams()
  const navigate = useNavigate()
  const { currentChapter, setCurrentChapter, markChapterComplete, completedChapters } = useAppStore()
  const [viewMode, setViewMode] = useState<'tree' | 'list'>('tree')
  
  const [activeChapter, setActiveChapter] = useState(
    chapterId ? parseInt(chapterId) : currentChapter
  )
  
  useEffect(() => {
    if (chapterId !== undefined) {
      setActiveChapter(parseInt(chapterId))
      setCurrentChapter(parseInt(chapterId))
    }
  }, [chapterId, setCurrentChapter])
  
  // If no chapter is selected, show the tree/list overview
  const showOverview = chapterId === undefined
  
  const chapter = chapters[activeChapter]
  const ChapterComponent = chapter?.component
  
  const handleNext = () => {
    if (activeChapter < chapters.length - 1) {
      const nextChapter = activeChapter + 1
      navigate(`/learn/${nextChapter}`)
      setActiveChapter(nextChapter)
      setCurrentChapter(nextChapter)
    }
  }
  
  const handlePrevious = () => {
    if (activeChapter > 0) {
      const prevChapter = activeChapter - 1
      navigate(`/learn/${prevChapter}`)
      setActiveChapter(prevChapter)
      setCurrentChapter(prevChapter)
    }
  }
  
  const handleChapterSelect = (id: number) => {
    navigate(`/learn/${id}`)
    setActiveChapter(id)
    setCurrentChapter(id)
  }
  
  const handleMarkComplete = () => {
    markChapterComplete(activeChapter)
  }
  
  // Show overview (tree or list view) when no specific chapter is selected
  if (showOverview) {
    return (
      <div className="min-h-screen">
        {/* View Toggle */}
        <div className="fixed top-20 right-6 z-10 bg-white rounded-lg shadow-lg p-2 flex gap-2">
          <button
            onClick={() => setViewMode('tree')}
            className={`p-2 rounded-lg transition-all ${
              viewMode === 'tree'
                ? 'bg-blue-100 text-blue-600'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            title="Tree View"
          >
            <Network className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-all ${
              viewMode === 'list'
                ? 'bg-blue-100 text-blue-600'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            title="List View"
          >
            <List className="w-5 h-5" />
          </button>
        </div>

        {viewMode === 'tree' ? (
          <AlgorithmTree />
        ) : (
          <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold mb-8 text-center">Learning Path</h1>
            <div className="max-w-4xl mx-auto space-y-4">
              {chapters.map((chap) => {
                const completedSet = completedChapters instanceof Set
                  ? completedChapters
                  : new Set(completedChapters)
                const isCompleted = completedSet.has(chap.id)

                return (
                  <motion.button
                    key={chap.id}
                    onClick={() => handleChapterSelect(chap.id)}
                    whileHover={{ scale: 1.02 }}
                    className="w-full text-left p-6 rounded-xl bg-white shadow-lg border-2 border-transparent hover:border-blue-300 transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-semibold text-gray-500">
                            Chapter {chap.id + 1}
                          </span>
                          {isCompleted && (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          )}
                        </div>
                        <h3 className="text-xl font-bold mb-2">{chap.title}</h3>
                        <p className="text-gray-600">{chap.description}</p>
                      </div>
                      <ChevronRight className="w-6 h-6 text-gray-400" />
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </div>
        )}
      </div>
    )
  }

  if (!chapter) {
    return (
      <div className="p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Chapter not found</h1>
          <button onClick={() => navigate('/learn')} className="btn btn-primary">
            Back to Overview
          </button>
        </div>
      </div>
    )
  }
  
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Chapter Navigation Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-6">
          {/* Back to Overview Button */}
          <button
            onClick={() => navigate('/learn')}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 mb-4 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Overview
          </button>

          <h2 className="text-xl font-bold mb-4">Learning Path</h2>
          
          <div className="space-y-2">
            {chapters.map((chap) => {
              const isActive = chap.id === activeChapter
              // Ensure completedChapters is a Set (handle array from localStorage)
              const completedSet = completedChapters instanceof Set 
                ? completedChapters 
                : new Set(completedChapters)
              const isCompleted = completedSet.has(chap.id)
              
              return (
                <motion.button
                  key={chap.id}
                  onClick={() => handleChapterSelect(chap.id)}
                  whileHover={{ scale: 1.02 }}
                  className={`w-full text-left p-4 rounded-lg transition-all ${
                    isActive
                      ? 'bg-primary-50 border-2 border-primary-500'
                      : 'bg-gray-50 border-2 border-transparent hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-500">
                          Chapter {chap.id + 1}
                        </span>
                        {isCompleted && (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        )}
                      </div>
                      <h3 className={`font-semibold mt-1 ${
                        isActive ? 'text-primary-700' : 'text-gray-900'
                      }`}>
                        {chap.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {chap.description}
                      </p>
                    </div>
                  </div>
                </motion.button>
              )
            })}
          </div>
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500 mb-1">
                Chapter {activeChapter + 1} of {chapters.length}
              </div>
              <h1 className="text-3xl font-bold text-gray-900">{chapter.title}</h1>
              <p className="text-gray-600 mt-1">{chapter.description}</p>
            </div>
            
            {!completedChapters.has(activeChapter) && (
              <button
                onClick={handleMarkComplete}
                className="btn btn-accent flex items-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                Mark Complete
              </button>
            )}
          </div>
        </div>
        
        {/* Chapter Content */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="px-8 pt-8 pb-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeChapter}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {ChapterComponent && <ChapterComponent />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        
        {/* Navigation Footer */}
        <div className="bg-white border-t border-gray-200 px-8 py-4">
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={activeChapter === 0}
              className="btn btn-secondary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
              Previous
            </button>
            
            <div className="flex gap-2">
              {chapters.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === activeChapter
                      ? 'bg-primary-600 w-8'
                      : completedChapters.has(index)
                      ? 'bg-green-400'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            
            <button
              onClick={handleNext}
              disabled={activeChapter === chapters.length - 1}
              className="btn btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

