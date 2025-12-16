export interface Doctor {
  id: number
  name: string
  qualification: string
  specialties: string[]
  experience: number
  fees: number
  clinic: string | { name: string; [key: string]: any }
  location: string | { address: string; [key: string]: any }
  image?: string
  consultationTypes: string[]
}
