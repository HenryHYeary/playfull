"use client";

import React, { use, useState } from 'react';
import { Search, Play, Pause, Plus, Heart, MoreHorizontal, Clock, Users, Shuffle, Volume2 } from "lucide-react";

import Playlist from '@/components/Playlist';
export interface TrackProps {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  coverUrl: string;
  isPlaying?: boolean;
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
}

const PlaylistCreator: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
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
      isPlaying: true
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

  const [currentlyPlaying, setCurrentlyPlaying] = useState<string>('1');

  const togglePlayPause = (trackId: string) => {
    setCurrentlyPlaying(currentlyPlaying === trackId ? '' : trackId);
    setPlaylistTracks(tracks => 
      tracks.map(track => ({
        ...track,
        isPlaying: track.id === trackId ? !track.isPlaying : false
      }))
    );
  }

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


  return (
    <div className='p-8'>
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        <Playlist {...currentPlaylist} />
      </div>
    </div>
  )
}

export default PlaylistCreator;