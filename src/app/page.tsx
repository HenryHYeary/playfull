"use client";

import React, { useState, useEffect } from 'react';

import Playlist from '@/components/Playlist';
import TrackList from '@/components/TrackList';

import { useSession } from "next-auth/react";
import Image from "next/image";
import { signIn, signOut } from "next-auth/react";
import { redirect } from 'next/navigation';

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
    collaborators: 3
  });

  const [playlistTracks, setPlaylistTracks] = useState<TrackProps[]>([
    {
      id: '1',
      title: 'Midnight City',
      artist: 'M83',
      album: 'Hurry Up, We\'re Dreaming',
      duration: '4:03',
      coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=60&h=60&fit=crop&crop=center',
    },
    {
      id: '2',
      title: 'Strobe',
      artist: 'Deadmau5',
      album: 'For Lack of a Better Name',
      duration: '10:32',
      coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=60&h=60&fit=crop&crop=center'
    },
    {
      id: '3',
      title: 'Porter Robinson',
      artist: 'Language',
      album: 'Spitfire EP',
      duration: '6:11',
      coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=60&h=60&fit=crop&crop=center'
    }
  ]);

  const [searchResults, setSearchResults] = useState<TrackProps[]>([
    {
      id: '4',
      title: 'Levels',
      artist: 'Avicii',
      album: 'True',
      duration: '3:18',
      coverUrl: 'https://images.unsplash.com/photo-1571974599782-87624638275e?w=60&h=60&fit=crop&crop=center'
    },
    {
      id: '5',
      title: 'Animals',
      artist: 'Martin Garrix',
      album: 'Animals',
      duration: '3:05',
      coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=60&h=60&fit=crop&crop=center'
    }
  ]);

  const addToPlaylist = (track: TrackProps) => {
    if (!playlistTracks.find(t => t.id === track.id)) {
      setPlaylistTracks([...playlistTracks, track]);
      setCurrentPlaylist(prev => ({
        ...prev,
        trackCount: prev.trackCount + 1
      }));
    }
  };

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
    const cachedSession = localStorage.getItem('session');
    if (cachedSession) {
      // Use cached session
      console.log(JSON.parse(cachedSession));
    }
  }, []);

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
