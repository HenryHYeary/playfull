export default function SearchResults() {
  return (
    <div className="space-y-6">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
       <h3 className="text-xl font-bold text-white mb-3">Quick Generate</h3> 
       <div className="grid grid-cols-2 gap-3">
        <button className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-3 rounded-lg font-medium hover:shadow-lg transition-all">
          🎵 Mood
        </button>       
       </div>
      </div>
    </div>
  )
}
