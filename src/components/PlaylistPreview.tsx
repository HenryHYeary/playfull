"use client";
import React from "react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  const goToCreateAdd = (playlistId?: string, playlistName?: string) => {
    const url = playlistId && playlistName ? `/create?addTo=${encodeURIComponent(playlistId)}&name=${encodeURIComponent(playlistName)}` : `/create`;
    router.push(url);
  };

  return (
    <>
      {Array.isArray(playlists) && playlists.length ? playlists.map((p) => (
        <button
          key={p.id}
          onClick={() => goToCreateAdd(p.id, p.name)}
          className="lg:col-span-2 sm:col-span-1 w-full text-left focus:outline-none cursor-pointer"
          aria-label={`Add tracks to ${p.name}`}
        >
          <div className='bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 relative z-0 hover:ring-2 hover:ring-white/10 transition p-3'>
            <div className="flex items-start space-x-6">
              <img
                src={p.image}
                alt={p.name}    // navigate to the create page; include playlist id when adding to existing playlist
                className='w-48 h-48 rounded-2xl object-cover shadow-2xl'
              />
              <div className="text-white">
                <h2 className='text-sm sm:text-xl font-bold mb-2'>{p.name}</h2>
                <div className='flex items-center space-x-6 text-sm opacity-80'>
                  <span className='text-xs sm:text-sm font-bold mb-5'>{p.trackCount} songs</span>
                </div>
              </div>
            </div>
          </div>
        </button>
      )) : (
        <div className="justify-center items-center text-white">
          You have no playlists. Why not create some?{" "}
          <button
            onClick={() => goToCreateAdd()}
            className="justify-center items-center font-semibold underline cursor-pointer"
          >
            Create a playlist
          </button>
        </div>
      )}
      {children}
    </>
  )
}