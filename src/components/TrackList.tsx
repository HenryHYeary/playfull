import { TrackProps } from "@/app/page";

interface TrackListProps {
  playlistTracks: TrackProps[]
}

export default function TrackList({ playlistTracks }: TrackListProps) {
  return (
    <div className="p-2">
      <div className="space-y-2">
        {playlistTracks.map((track, index) => (
          <div
            key={track.id}
            className="group flex items-center space-x-4 p-3 rounded-lg hover:bg-white/5 transition-colors"
          >
            <span className="text-gray-400 text-sm w-6 text-center group-hover:hidden">
              {index + 1}
            </span>

            <img 
              src={track.coverUrl} 
              alt={`${track.title} cover`} 
              className="w-12 h-12 rounded-lg object-cover shadow-2xl"
            />

            <div className="flex-1">
              <p className="text-white font-medium group-hover:text-blue transition-colors">
                {track.title}
              </p>
              <p className="text-gray-400 text-sm">
                {track.artist}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}