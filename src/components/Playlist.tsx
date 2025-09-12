import { PlaylistProps } from "@/app/page";
import { Users, Play } from "lucide-react";

export default function Playlist({ name, coverUrl, description, trackCount, duration, collaborators }: PlaylistProps) {
  return (
    <div className="lg:col-span-2">
      <div className='bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden'>
        <div className="flex items-end space-x-6">
          <img
            src={coverUrl}
            alt={name}
            className='w-48 h-48 rounded-2xl shadow-2xl object-cover'
          />
          <div className="text-white">
            <p className="text-sm font-medium uppercase tracking-white opacity-80">Playlist</p>
            <h2 className='text-4xl font-bold mb-2'>{name}</h2>
            <p className='text-lg opacity-90 mb-4'>{description}</p>
            <div className='flex items-center space-x-6 text-sm opacity-80'>
              <span className='text-sm text-bold mb-5'>{trackCount} songs</span>
              <span className='text-sm text-bold mb-5'>{duration}</span>
              {collaborators && (
                <div className='flex items-center space-x-1'>
                  <Users className='h-4 w-4 mb-5' />
                  <span className='text-sm text-bold mb-5'>{collaborators}</span>
                </div>
                )
              }
            </div>
          </div>
        </div>
        
        <div className="p6 border-b border-white/10">
          <div className="flex items-center space-x-4">
            <button className="bg-green-500 hover:bg-green-400 rounded-full p-4 transition-colors">
              <Play className="h-6 w-6 text-white ml-1" fill="white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}