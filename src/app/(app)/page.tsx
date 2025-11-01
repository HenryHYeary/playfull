"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import PlaylistPreview from '@/src/components/PlaylistPreview';
import { PlaylistPreviewProps } from '@/src/components/PlaylistPreview';

import { useSession } from "next-auth/react";


const PlaylistCreator: React.FC = () => {
  const { status } = useSession();
  const router = useRouter();
  const [playlists, setPlaylists] = useState<PlaylistPreviewProps[]>([]);

  useEffect(() => {
    if (status !== "authenticated") return;

    const controller = new AbortController();
    const load = async () => {
      try {
        const res = await fetch('/api/playlist/my-playlists', { signal: controller.signal });
        const body = await res.json();
        if (res.ok) {
          setPlaylists(body.playlists);
        } else {
          console.error('Failed to load playlists', body);
        }
      } catch (err: any) {
        if (err.name === 'AbortError') return;
        console.error('Error fetching playlists', err);
      }
    };
    load();
    return () => controller.abort();
  }, [status]);

  return (
    <div className='p-8 z-0'>
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <PlaylistPreview playlists={playlists} />
      </div>
    </div>
  )
}

export default PlaylistCreator;
