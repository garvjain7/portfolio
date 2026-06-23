export type ProjectStatus = 'Live' | 'In Progress' | 'Archived' | 'Completed'

export interface Project {
  id: string
  name: string
  description: string
  longDescription: string
  stack: string[]
  status: ProjectStatus
  featured: boolean
  liveUrl?: string
  githubUrl?: string
  highlights: string[]
  aiQuery: string
}

export interface ProjectTile {
  id: string
  name: string
  description: string
  stack: string[]
  status: ProjectStatus
  featured: boolean
  liveUrl?: string
  githubUrl?: string
  aiQuery: string
}