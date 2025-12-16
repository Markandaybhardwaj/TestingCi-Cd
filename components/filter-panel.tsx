"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import type { Doctor } from "@/types/doctor"

interface FilterPanelProps {
  doctors: Doctor[]
  selectedSpecialties: string[]
  consultationType: string | null
  sortBy: string | null
  onSpecialtyChange: (specialty: string) => void
  onConsultationChange: (type: string) => void
  onSortChange: (sort: string) => void
}

export default function FilterPanel({
  doctors,
  selectedSpecialties,
  consultationType,
  sortBy,
  onSpecialtyChange,
  onConsultationChange,
  onSortChange,
}: FilterPanelProps) {
  const [expandedSections, setExpandedSections] = useState({
    sort: true,
    specialties: true,
    consultation: true,
  })

  // Get unique specialties from all doctors
  const allSpecialties = Array.from(new Set(doctors.flatMap((doctor) => doctor.specialties))).sort()

  const toggleSection = (section: "sort" | "specialties" | "consultation") => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  return (
    <div className="bg-white rounded-md shadow-sm p-4">
      {/* Sort By Section */}
      <div className="mb-4 border-b pb-4">
        <div className="flex justify-between items-center cursor-pointer mb-2" onClick={() => toggleSection("sort")}>
          <h3 className="font-medium text-gray-800" data-testid="filter-header-sort">
            Sort by
          </h3>
          {expandedSections.sort ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>

        {expandedSections.sort && (
          <div className="space-y-2 mt-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                checked={sortBy === "fees"}
                onChange={() => onSortChange("fees")}
                className="form-radio"
                data-testid="sort-fees"
              />
              <span className="text-sm">Price: Low-High</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                checked={sortBy === "experience"}
                onChange={() => onSortChange("experience")}
                className="form-radio"
                data-testid="sort-experience"
              />
              <span className="text-sm">Experience: Most Experience first</span>
            </label>
          </div>
        )}
      </div>

      {/* Specialties Section */}
      <div className="mb-4 border-b pb-4">
        <div
          className="flex justify-between items-center cursor-pointer mb-2"
          onClick={() => toggleSection("specialties")}
        >
          <h3 className="font-medium text-gray-800" data-testid="filter-header-speciality">
            Specialities
          </h3>
          {expandedSections.specialties ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>

        {expandedSections.specialties && (
          <div className="space-y-2 mt-2 max-h-60 overflow-y-auto">
            {allSpecialties.map((specialty) => (
              <label key={specialty} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedSpecialties.includes(specialty)}
                  onChange={() => onSpecialtyChange(specialty)}
                  className="form-checkbox"
                  data-testid={`filter-specialty-${typeof specialty === "string" ? specialty.replace(/\//g, "-") : specialty}`}
                />
                <span className="text-sm">{specialty}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Mode of Consultation Section */}
      <div className="mb-4">
        <div
          className="flex justify-between items-center cursor-pointer mb-2"
          onClick={() => toggleSection("consultation")}
        >
          <h3 className="font-medium text-gray-800" data-testid="filter-header-moc">
            Mode of consultation
          </h3>
          {expandedSections.consultation ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>

        {expandedSections.consultation && (
          <div className="space-y-2 mt-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                checked={consultationType === "Video Consult"}
                onChange={() => onConsultationChange("Video Consult")}
                className="form-radio"
                data-testid="filter-video-consult"
              />
              <span className="text-sm">Video Consultation</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                checked={consultationType === "In Clinic"}
                onChange={() => onConsultationChange("In Clinic")}
                className="form-radio"
                data-testid="filter-in-clinic"
              />
              <span className="text-sm">In-clinic Consultation</span>
            </label>
          </div>
        )}
      </div>
    </div>
  )
}
