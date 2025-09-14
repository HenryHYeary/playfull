import { PlaylistProps } from "@/app/page";
import { Users } from "lucide-react";

export default function Playlist({ name, coverUrl, description, trackCount, duration, collaborators, children }: PlaylistProps) {
  return (
    <div className="lg:col-span-2">
      <div className='bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden'>
        <div className="flex items-start space-x-6">
          <img
            src={coverUrl}
            alt={name}
            className='w-48 h-48 rounded-2xl object-cover shadow-2xl'
          />
          <div className="text-white pt-2">
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
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}