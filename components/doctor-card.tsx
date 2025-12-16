import Image from "next/image"
import { MapPin, Building } from "lucide-react"
import type { Doctor } from "@/types/doctor"

interface DoctorCardProps {
  doctor: Doctor
}

export default function DoctorCard({ doctor }: DoctorCardProps) {
  // Ensure all properties have fallback values
  const {
    name = "Unknown Doctor",
    qualification = "",
    specialties = [],
    experience = 0,
    fees = 0,
    clinic = "",
    location = "",
    image = "",
  } = doctor || {}

  // Handle case where clinic or location might be objects
  const renderClinic = () => {
    if (typeof clinic === "string") {
      return clinic
    } else if (clinic && typeof clinic === "object") {
      // If clinic is an object with name property
      return clinic.name || JSON.stringify(clinic)
    }
    return ""
  }

  const renderLocation = () => {
    if (typeof location === "string") {
      return location
    } else if (location && typeof location === "object") {
      // If location is an object with address property
      return location.address || JSON.stringify(location)
    }
    return ""
  }

  return (
    <div className="bg-white rounded-md shadow-sm overflow-hidden" data-testid="doctor-card">
      <div className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-shrink-0">
            <Image
              src={image || "/placeholder.svg?height=80&width=80"}
              alt={name}
              width={80}
              height={80}
              className="rounded-full object-cover"
            />
          </div>

          <div className="flex-grow">
            <div className="flex flex-col md:flex-row md:justify-between">
              <div>
                <h2 className="text-lg font-medium" data-testid="doctor-name">
                  {name}
                </h2>
                <p className="text-gray-600">{qualification}</p>
                <p className="text-gray-600" data-testid="doctor-specialty">
                  {Array.isArray(specialties) ? specialties.join(", ") : ""}
                </p>
                <p className="text-gray-600" data-testid="doctor-experience">
                  {experience} yrs exp.
                </p>
              </div>

              <div className="mt-2 md:mt-0 text-right">
                <p className="text-lg font-medium" data-testid="doctor-fee">
                  ₹ {fees}
                </p>
              </div>
            </div>

            <div className="mt-3">
              <div className="flex items-center text-gray-600 text-sm mb-1">
                <Building size={16} className="mr-1" />
                <span>{renderClinic()}</span>
              </div>
              <div className="flex items-center text-gray-600 text-sm">
                <MapPin size={16} className="mr-1" />
                <span>{renderLocation()}</span>
              </div>
            </div>

            <div className="mt-4">
              <button className="w-full md:w-auto float-right px-4 py-2 bg-white border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors">
                Book Appointment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
