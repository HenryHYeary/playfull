"use client";

import React, { useState, useEffect } from 'react';

import Playlist from '@/components/Playlist';
import TrackList from '@/components/TrackList';

import { useSession } from "next-auth/react";
import Image from "next/image";
import { signIn, signOut } from "next-auth/react";
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

export interface TrackProps {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  coverUrl: string;
}

export interface PlaylistProps {
  id: string;
  name: string;
  description: string;
  trackCount: number;
  duration: string;
  coverUrl: string;
  isPublic: boolean;
  collaborators?: number;
  children?: React.ReactNode
}

const PlaylistCreator: React.FC = () => {
  const { data: session, status } = useSession();

  const [currentPlaylist, setCurrentPlaylist] = useState<PlaylistProps>({
    id: '1',
    name: 'My Awesome Playlist',
    description: 'Perfect vibes for coding sessions',
    trackCount: 12,
    duration: '47 min',
    coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&crop=center',
    isPublic: false,
  });

  const [playlistTracks, setPlaylistTracks] = useState<TrackProps[]>([]);

  const removeFromPlaylist = (trackId: string) => {
    setPlaylistTracks(playlistTracks.filter(track => track.id !== trackId));
    setCurrentPlaylist(prev => ({
      ...prev,
      trackCount: prev.trackCount - 1
    }));
  };

  useEffect(() => {
    if (session) {
      localStorage.setItem('session', JSON.stringify(session));
    }
  }, [session]);


    useEffect(() => {
    if (!session?.accessToken) return;

    const fetchTop = async () => {
      try {
        const res = await fetch("https://api.spotify.com/v1/me/top/tracks?limit=3&offset=0", {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            "Content-Type": "application/json",
          },
        });

        if (res.status === 401) {
          console.warn("Spotify returned 401. Token may be expired.");
          return;
        }

        if (!res.ok) {
          const err = await res.text();
          throw new Error(`Spotify API error: ${res.status} ${err}`);
        }

        const data = await res.json();
        setPlaylistTracks(data.items ?? data);
      } catch (error) {
        console.error("Failed to fetch top tracks:", error);
      }
    };
    
    fetchTop();
  }, [session])

  // Hacky useEffect hook, only for temporary aesthetic purposes, will pull playlists from API eventually
   useEffect(() => {
    if (playlistTracks.length > 0) {
      setCurrentPlaylist({
        ...currentPlaylist,
        coverUrl: playlistTracks[0].album.images[0].url
      })
    }
  }, [playlistTracks]);

  if (status === "loading") return <div>Loading...</div>

  if (status === "unauthenticated") {
    return (
     <>
      Not signed in <br />
      <button className="cursor-pointer" onClick={() => signIn()}>Sign in</button>
     </>
    )
  }

  return (
    <div className='p-8'>
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <Playlist {...currentPlaylist}>
          <TrackList playlistTracks={playlistTracks} removeFromPlaylist={removeFromPlaylist}/>
        </Playlist>
      </div>
      <button className="cursor-pointer" onClick={() => signOut()}>Sign out</button>
    </div>
  )
}

export default PlaylistCreator;
