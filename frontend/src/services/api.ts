import axios from 'axios'
import type { AlgorithmType, SimulationConfig } from '@/store/useAppStore'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
})

export interface SimulationResponse {
  session_id: string
  status: string
  message: string
  total_episodes: number
}

export interface SimulationStatus {
  session_id: string
  status: 'started' | 'running' | 'completed' | 'error'
  algorithm: string
  total_episodes: number
  error?: string
}

/**
 * Start a new simulation
 */
export async function startSimulation(
  algorithm: AlgorithmType,
  config: Record<string, any>
): Promise<SimulationResponse> {
  const response = await api.post('/api/simulate', {
    algorithm,
    config,
  })
  return response.data
}

/**
 * Get simulation status
 */
export async function getSimulationStatus(
  sessionId: string
): Promise<SimulationStatus> {
  const response = await api.get(`/api/simulate/status/${sessionId}`)
  return response.data
}

/**
 * Stream simulation updates via Server-Sent Events
 */
export function streamSimulation(
  sessionId: string,
  onMessage: (data: any) => void,
  onError?: (error: any) => void,
  onComplete?: () => void
): () => void {
  const eventSource = new EventSource(
    `${API_BASE}/api/simulate/stream/${sessionId}`
  )
  
  eventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data)
      
      // Handle status messages
      if (data.status === 'completed') {
        console.log('[SSE] Simulation completed')
        onComplete?.()
        eventSource.close()
      } else if (data.status === 'error') {
        console.error('[SSE] Simulation error:', data.error)
        onError?.(new Error(data.error))
        eventSource.close()
      } else if (data.status === 'started') {
        console.log('[SSE] Simulation started')
        // Don't send this to onMessage, it's just a status update
      } else {
        // Regular episode data
        onMessage(data)
      }
    } catch (error) {
      console.error('[SSE] Error parsing SSE data:', error, 'Raw data:', event.data)
      onError?.(error)
    }
  }
  
  eventSource.onerror = (error) => {
    console.error('[SSE] Connection error:', error, 'ReadyState:', eventSource.readyState)
    // Only call onError if the connection is actually broken
    // EventSource automatically reconnects on transient errors
    if (eventSource.readyState === EventSource.CLOSED) {
      console.error('[SSE] Connection closed, stopping')
      // Create a more helpful error message
      const errorMsg = error instanceof Error 
        ? error.message 
        : `SSE connection failed for session ${sessionId}. The simulation may have encountered an error.`
      onError?.(new Error(errorMsg))
      eventSource.close()
    } else {
      console.log('[SSE] Connection error, but will retry... State:', eventSource.readyState)
    }
  }
  
  eventSource.onopen = () => {
    console.log('[SSE] Connection opened')
  }
  
  // Return cleanup function
  return () => {
    console.log('[SSE] Closing connection')
    eventSource.close()
  }
}

/**
 * Health check
 */
export async function healthCheck() {
  const response = await api.get('/health')
  return response.data
}

export default api

