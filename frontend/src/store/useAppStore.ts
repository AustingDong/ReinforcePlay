import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type AlgorithmType = 'bandit' | 'qlearning' | 'ppo'

export interface GridCell {
  x: number
  y: number
  type: 'empty' | 'obstacle' | 'reward' | 'goal' | 'start'
  value: number
}

export interface SimulationConfig {
  algorithm: AlgorithmType
  params: Record<string, any>
  grid?: GridCell[]
}

export interface SimulationResult {
  episode: number
  reward: number
  qValues?: number[]
  trajectory?: any[]
  [key: string]: any
}

interface AppState {
  // Learning progress
  currentChapter: number
  completedChapters: Set<number>
  
  // Playground state
  simulationConfig: SimulationConfig | null
  simulationResults: SimulationResult[]
  isSimulating: boolean
  currentSessionId: string | null
  
  // Grid editor state
  gridWidth: number
  gridHeight: number
  grid: GridCell[]
  
  // Actions
  setCurrentChapter: (chapter: number) => void
  markChapterComplete: (chapter: number) => void
  
  setSimulationConfig: (config: SimulationConfig) => void
  setSimulationResults: (results: SimulationResult[]) => void
  addSimulationResult: (result: SimulationResult) => void
  clearSimulationResults: () => void
  setIsSimulating: (isSimulating: boolean) => void
  setCurrentSessionId: (sessionId: string | null) => void
  
  setGridDimensions: (width: number, height: number) => void
  updateGridCell: (cell: GridCell) => void
  clearGrid: () => void
  setGrid: (grid: GridCell[]) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Initial state
      currentChapter: 0,
      completedChapters: new Set<number>(),
      
      simulationConfig: null,
      simulationResults: [],
      isSimulating: false,
      currentSessionId: null,
      
      gridWidth: 5,
      gridHeight: 5,
      grid: [],
      
      // Actions
      setCurrentChapter: (chapter) => set({ currentChapter: chapter }),
      
      markChapterComplete: (chapter) =>
        set((state) => ({
          completedChapters: new Set([...state.completedChapters, chapter]),
        })),
      
      setSimulationConfig: (config) => set({ simulationConfig: config }),
      
      setSimulationResults: (results) => set({ simulationResults: results }),
      
      addSimulationResult: (result) =>
        set((state) => ({
          simulationResults: [...state.simulationResults, result],
        })),
      
      clearSimulationResults: () => set({ simulationResults: [] }),
      
      setIsSimulating: (isSimulating) => set({ isSimulating }),
      
      setCurrentSessionId: (sessionId) => set({ currentSessionId: sessionId }),
      
      setGridDimensions: (width, height) =>
        set({
          gridWidth: width,
          gridHeight: height,
          grid: [],
        }),
      
      updateGridCell: (cell) =>
        set((state) => {
          const existingIndex = state.grid.findIndex(
            (c) => c.x === cell.x && c.y === cell.y
          )
          
          if (existingIndex >= 0) {
            const newGrid = [...state.grid]
            newGrid[existingIndex] = cell
            return { grid: newGrid }
          } else {
            return { grid: [...state.grid, cell] }
          }
        }),
      
      clearGrid: () => set({ grid: [] }),
      
      setGrid: (grid) => set({ grid }),
    }),
    {
      name: 'reinforceplay-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentChapter: state.currentChapter,
        completedChapters: Array.from(state.completedChapters),
        gridWidth: state.gridWidth,
        gridHeight: state.gridHeight,
      }),
      // Rehydrate the Set from the array stored in localStorage
      onRehydrateStorage: () => (state) => {
        if (state && Array.isArray(state.completedChapters)) {
          state.completedChapters = new Set(state.completedChapters)
        }
      },
    }
  )
)

