import { redirect } from "next/navigation";
import React from "react";

type Props = {
  playlists: PlaylistPreviewProps[];
  children?: React.ReactNode;
};

export type PlaylistPreviewProps = {
  id: string,
  name: string,
  url: string,
  trackCount: number,
  image: string,
}

export default function PlaylistPreview({ playlists, children }: Props) {
  return (
    <>
      {playlists.length ? playlists.map((p) => (
        <div className="lg:col-span-2 sm:col-span-1" key={p.id}>
          <div className='bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 relative z-0'>
            <div className="flex items-start space-x-6 pt-3 pl-3">
              <img
                src={p.image}
                alt={p.name}
                className='w-48 h-48 rounded-2xl object-cover shadow-2xl'
              />
              <div className="text-white">
                <h2 className='text-xl md:text-3xl font-bold mb-2'>{p.name}</h2>
                <div className='flex items-center space-x-6 text-sm opacity-80'>
                  <span className='text-sm font-bold mb-5'>{p.trackCount} songs</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )) : (
        <div className="justify-center items-center">
          You have no playlists. Why not create some? 
          <span onClick={() => redirect("/create")} className="justify-center items-center underline">Create a playlist</span>
        </div>
      )}
      {children}
    </>
  )
}