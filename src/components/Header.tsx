import { Search, Volume2 } from "lucide-react"

export default function Header() {
  return (
    <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 roundned-lg p-2">
              <Volume2 className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Play<span className="text-yellow-200">full</span></h1>
              <p className="text-purple-200">Create. Share. Play.</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search songs, artists, albums..."
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full py-3 pl-10 pr-4 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-96"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}