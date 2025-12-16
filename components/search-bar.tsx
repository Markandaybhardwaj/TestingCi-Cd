"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Search } from "lucide-react"
import type { Doctor } from "@/types/doctor"

interface SearchBarProps {
  onSearch: (term: string) => void
  initialValue: string
  doctors: Doctor[]
}

export default function SearchBar({ onSearch, initialValue, doctors }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState(initialValue)
  const [suggestions, setSuggestions] = useState<Doctor[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setSearchTerm(initialValue)
  }, [initialValue])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)

    if (value.trim() === "") {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    const filtered = doctors.filter((doctor) => doctor.name.toLowerCase().includes(value.toLowerCase())).slice(0, 3)

    setSuggestions(filtered)
    setShowSuggestions(true)
  }

  const handleSuggestionClick = (name: string) => {
    setSearchTerm(name)
    onSearch(name)
    setShowSuggestions(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchTerm)
    setShowSuggestions(false)
  }

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          placeholder="Search Symptoms, Doctors, Specialties, Clinics"
          className="w-full py-2 px-4 pr-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => searchTerm.trim() !== "" && setSuggestions.length > 0 && setShowSuggestions(true)}
          ref={inputRef}
          data-testid="autocomplete-input"
        />
        <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500">
          <Search size={20} />
        </button>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <div
          className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-auto"
          ref={suggestionsRef}
        >
          <ul className="py-1">
            {suggestions.map((doctor) => (
              <li
                key={doctor.id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSuggestionClick(doctor.name)}
                data-testid="suggestion-item"
              >
                {doctor.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
