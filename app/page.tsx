"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import DoctorCard from "@/components/doctor-card"
import SearchBar from "@/components/search-bar"
import FilterPanel from "@/components/filter-panel"
import type { Doctor } from "@/types/doctor"

export default function Home() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([])
  const [consultationType, setConsultationType] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<string | null>(null)

  const router = useRouter()
  const searchParams = useSearchParams()

  // Fetch doctors data
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true)
        const response = await fetch("https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json")
        if (!response.ok) {
          throw new Error("Failed to fetch doctors")
        }
        const data = await response.json()
        setDoctors(data)
        setFilteredDoctors(data)
      } catch (err) {
        setError("Failed to load doctors. Please try again later.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchDoctors()
  }, [])

  // Apply URL params on initial load
  useEffect(() => {
    const specialties = searchParams.get("specialties")?.split(",") || []
    const consultation = searchParams.get("consultation")
    const sort = searchParams.get("sort")
    const search = searchParams.get("search") || ""

    if (specialties.length > 0) setSelectedSpecialties(specialties)
    if (consultation) setConsultationType(consultation)
    if (sort) setSortBy(sort)
    if (search) setSearchTerm(search)
  }, [searchParams])

  // Apply filters and update URL
  useEffect(() => {
    if (doctors.length === 0) return

    let filtered = [...doctors]

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((doctor) => doctor.name.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    // Apply specialty filter
    if (selectedSpecialties.length > 0) {
      filtered = filtered.filter((doctor) =>
        doctor.specialties.some((specialty) => selectedSpecialties.includes(specialty)),
      )
    }

    // Apply consultation type filter
    if (consultationType) {
      filtered = filtered.filter((doctor) => doctor.consultationTypes.includes(consultationType))
    }

    // Apply sorting
    if (sortBy) {
      if (sortBy === "fees") {
        filtered.sort((a, b) => a.fees - b.fees)
      } else if (sortBy === "experience") {
        filtered.sort((a, b) => b.experience - a.experience)
      }
    }

    setFilteredDoctors(filtered)

    // Update URL params
    const params = new URLSearchParams()
    if (searchTerm) params.set("search", searchTerm)
    if (selectedSpecialties.length > 0) params.set("specialties", selectedSpecialties.join(","))
    if (consultationType) params.set("consultation", consultationType)
    if (sortBy) params.set("sort", sortBy)

    const newUrl = `${window.location.pathname}?${params.toString()}`
    window.history.replaceState({ path: newUrl }, "", newUrl)
  }, [doctors, searchTerm, selectedSpecialties, consultationType, sortBy])

  const handleSearch = (term: string) => {
    setSearchTerm(term)
  }

  const handleSpecialtyChange = (specialty: string) => {
    setSelectedSpecialties((prev) =>
      prev.includes(specialty) ? prev.filter((s) => s !== specialty) : [...prev, specialty],
    )
  }

  const handleConsultationChange = (type: string) => {
    setConsultationType(type === consultationType ? null : type)
  }

  const handleSortChange = (sort: string) => {
    setSortBy(sort === sortBy ? null : sort)
  }

  if (loading) {
    return <div className="container mx-auto p-4 text-center">Loading doctors...</div>
  }

  if (error) {
    return <div className="container mx-auto p-4 text-center text-red-500">{error}</div>
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-blue-700 py-4">
        <div className="container mx-auto px-4">
          <SearchBar onSearch={handleSearch} initialValue={searchTerm} doctors={doctors} />
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <FilterPanel
              doctors={doctors}
              selectedSpecialties={selectedSpecialties}
              consultationType={consultationType}
              sortBy={sortBy}
              onSpecialtyChange={handleSpecialtyChange}
              onConsultationChange={handleConsultationChange}
              onSortChange={handleSortChange}
            />
          </div>

          <div className="md:col-span-3">
            {filteredDoctors.length === 0 ? (
              <div className="text-center py-10">
                <h3 className="text-lg font-medium">No doctors found</h3>
                <p className="text-gray-500">Try adjusting your filters or search term</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredDoctors.map((doctor) => (
                  <DoctorCard key={doctor.id} doctor={doctor} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
