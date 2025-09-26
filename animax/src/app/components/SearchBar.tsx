"use client"
import { Search } from "lucide-react"

export default function SearchBar() {
  return (
    <div className="flex items-center bg-gradient-to-r from-purple-700 to-purple-600 rounded-md p-2 m-4">
      <Search className="text-gray-300 mr-2" />
      <input
        type="text"
        placeholder="Rechercher"
        className="bg-transparent outline-none text-white w-full placeholder-gray-300"
      />
    </div>
  )
}
