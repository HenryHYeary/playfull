import { TrackProps } from "@/app/page";
import { Clock, Trash } from "lucide-react";

interface TrackListProps {
  playlistTracks: TrackProps[];
  removeFromPlaylist: Function
}

export default function TrackList({ playlistTracks, removeFromPlaylist }: TrackListProps) {
  return (
    <div className="p-2">
      <div className="space-y-3">
        {playlistTracks.map((track, index) => (
          <div
            key={track.id}
            className="group flex items-center space-x-4 p-3 rounded-lg hover:bg-white/5 transition-colors"
          >
            <span className="text-gray-400 text-sm w-6 text-center">
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

            <p className="text-white-400 text-sm hidden sm:block">{track.album}</p>

            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <span className="text-white-400 text-sm">{track.duration}</span>
            </div>

            <button
              onClick={() => removeFromPlaylist(track.id)}
              className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400 transition-all"
            >
              <Trash className="h-5 w-5" /> 
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
