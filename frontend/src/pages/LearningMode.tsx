import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, CheckCircle, List, Network, Menu, X } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import IntroToRLLesson from '@/components/lessons/IntroToRLLesson'
import BanditAdventure from '@/components/lessons/BanditAdventure'
import MDPStory from '@/components/lessons/MDPStory'
import QLearningLessonNew from '@/components/lessons/QLearningLessonNew'
import SARSAStory from '@/components/lessons/SARSAStory'
import TDLambdaStory from '@/components/lessons/TDLambdaStory'
import REINFORCEStory from '@/components/lessons/REINFORCEStory'
import A2CStory from '@/components/lessons/A2CStory'
import PPOStory from '@/components/lessons/PPOStory'
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
    title: 'Welcome to RL',
    description: 'Your journey into intelligent agents begins here',
    component: IntroToRLLesson,
  },
  {
    id: 1,
    title: 'The Casino Heist 🎰',
    description: 'Master the explore-exploit dilemma through a thrilling heist',
    component: BanditAdventure,
  },
  {
    id: 2,
    title: 'The Master Blueprint 🗺️',
    description: 'Unlock the strategic framework behind all intelligent decisions',
    component: MDPStory,
  },
  {
    id: 3,
    title: 'The Learning Robot 🤖',
    description: 'Watch Q-Learning discover optimal paths through trial and error',
    component: QLearningLessonNew,
  },
  {
    id: 4,
    title: 'The Cautious Explorer 🛡️',
    description: 'Discover why safety matters in reinforcement learning',
    component: SARSAStory,
  },
  {
    id: 5,
    title: 'Time Traveler\'s Advantage ⏰',
    description: 'Master the art of crediting actions across time',
    component: TDLambdaStory,
  },
  {
    id: 6,
    title: 'Evolution of Intelligence 🧬',
    description: 'Witness AI evolve from random to genius with REINFORCE',
    component: REINFORCEStory,
  },
  {
    id: 7,
    title: 'The Dynamic Duo 🎭',
    description: 'See how Actor and Critic team up for powerful learning',
    component: A2CStory,
  },
  {
    id: 8,
    title: 'The Safety Revolution 🛡️',
    description: 'Discover PPO - the algorithm powering ChatGPT and modern AI',
    component: PPOStory,
  },
]

export default function LearningMode() {
  const { chapterId } = useParams()
  const navigate = useNavigate()
  const { currentChapter, setCurrentChapter, markChapterComplete, completedChapters } = useAppStore()
  const [viewMode, setViewMode] = useState<'tree' | 'list'>('tree')
  const [isSidebarVisible, setIsSidebarVisible] = useState(true)
  
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
    <div className="flex h-screen bg-gray-50 relative">
      {/* Chapter Navigation Sidebar */}
      <AnimatePresence>
        {isSidebarVisible && (
          <motion.div
            initial={{ x: -320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -320, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="w-80 bg-white border-r border-gray-200 overflow-y-auto flex-shrink-0"
          >
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Sidebar Toggle Button (when sidebar is hidden) */}
      <AnimatePresence>
        {!isSidebarVisible && (
          <motion.button
            initial={{ x: -60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -60, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            onClick={() => setIsSidebarVisible(true)}
            className="fixed left-4 top-4 z-50 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform"
            title="Show sidebar"
          >
            <Menu className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Sidebar Toggle Button */}
              {isSidebarVisible && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsSidebarVisible(false)}
                  className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                  title="Hide sidebar"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </motion.button>
              )}
              
              <div>
                <div className="text-sm text-gray-500 mb-1">
                  Chapter {activeChapter + 1} of {chapters.length}
                </div>
                <h1 className="text-3xl font-bold text-gray-900">{chapter.title}</h1>
                <p className="text-gray-600 mt-1">{chapter.description}</p>
              </div>
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

