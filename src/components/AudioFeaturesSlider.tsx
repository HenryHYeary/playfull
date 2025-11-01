"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Check, X, PlusCircle } from "lucide-react";
import { Track } from "@prisma/client";

type FilterValue = {
  min: number;
  max: number;
  enabled: boolean
}

type Filters = {
  [key: string]: FilterValue;
}

type AudioFeature = {
  key: string;
  label: string;
  description: string;
  min: number;
  max: number;
  step: number;
  color: string;
}

const AUDIO_FEATURES: AudioFeature[] = [
  {
    key: "danceability",
    label: "Danceability",
    description: "How suitable a track is for dancing.",
    min: 0,
    max: 1,
    step: 0.01,
    color: "bg-purple-500"
  },
  {
    key: "energy", 
    label: "Energy",
    description: "Intensity and activity level.",
    min: 0,
    max: 1,
    step: 0.01,
    color: "bg-red-500"
  },
  {
    key: "valence",
    label: "Valence",
    description: "Musical positiveness (happy vs sad)",
    min: 0,
    max: 1,
    step: 0.01,
    color: "bg-yellow-500"
  },
  {
    key: 'acousticness',
    label: 'Acousticness',
    description: 'Confidence the track is acoustic',
    min: 0,
    max: 1,
    step: 0.01,
    color: 'bg-green-500'
  },
  {
    key: 'instrumentalness',
    label: 'Instrumentalness',
    description: 'Predicts if track contains no vocals',
    min: 0,
    max: 1,
    step: 0.01,
    color: 'bg-blue-500'
  },
  {
    key: 'speechiness',
    label: 'Speechiness',
    description: 'Presence of spoken words',
    min: 0,
    max: 1,
    step: 0.01,
    color: 'bg-pink-500'
  },
  {
    key: 'liveness',
    label: 'Liveness',
    description: 'Presence of audience in recording',
    min: 0,
    max: 1,
    step: 0.01,
    color: 'bg-orange-500'
  },
  {
    key: "tempo",
    label: "Tempo",
    description: "Overall tempo in BPM",
    min: 50,
    max: 200,
    step: 1,
    color: "bg-indigo-500"
  },
];

export default function AudioFeaturesSlider() {
  const [filters, setFilters] = useState<Filters>(
    AUDIO_FEATURES.reduce((acc, feature) => {
      acc[feature.key] = {
        min: feature.min,
        max: feature.max,
        enabled: false
      };
      return acc;
    }, {} as Filters)
  );

  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [playlistName, setPlaylistName] = useState<string>("");
  const [selectedTracks, setSelectedTracks] = useState<Set<string>>(new Set());
  const [creatingPlaylist, setCreatingPlaylist] = useState<boolean>(false);
  const [playlistSuccess, setPlaylistSuccess] = useState<string | null>(null);

  const toggleTrackSelection = (spotifyId: string) => {
    setSelectedTracks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(spotifyId)) {
        newSet.delete(spotifyId);
      } else {
        newSet.add(spotifyId);
      }
      return newSet;
    });
  }

  const selectAllTracks = () => {
    setSelectedTracks(new Set(tracks.map(t => t.spotifyId)));
  }

  const deselectAllTracks = () => {
    setSelectedTracks(new Set());
  }

  const createPlaylist = async () => {
    if (!playlistName.trim()) {
      setError("Please enter a playlist name");
      return;
    }

    if (selectedTracks.size === 0) {
      setError("Please select at least one track");
      return;
    }

    setCreatingPlaylist(true);
    setError(null);
    setPlaylistSuccess(null);

    try {
      const response = await fetch("/api/playlist/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playlistName: playlistName.trim(),
          trackIds: Array.from(selectedTracks)
        })
      });

      const data = await response.json();

      if (data.success) {
        setPlaylistSuccess(`Playlist created! ${data.trackCount} tracks added.`);
        setPlaylistName("");
        setSelectedTracks(new Set());

        if (data.playlistUrl) {
          window.open(data.playlistUrl, "_blank");
        }
      } else {
        setError(data.error || "Failed to create playlist");
      }
    } catch (error) {
      setError("Network error: " + (error instanceof Error ? error.message : "Unknown error"));
    } finally {
      setCreatingPlaylist(false);
    }
  }


  const updateFilter = (key: string, type: "min" | "max", value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [type]: parseFloat(value)
      }
    }));
  }

  const toggleFilter = (key: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        enabled: !prev[key].enabled
      }
    }));
  };

  const resetFilters = () => {
    setFilters(
      AUDIO_FEATURES.reduce((acc, feature) => {
        acc[feature.key] = {
          min: feature.min,
          max: feature.max,
          enabled: false
        };

        return acc
      }, {} as Filters)
    );
    setTracks([]);
  };

  const fetchRecommendations = async () => {
    setLoading(true);
    setError(null);

    try {
      const body: Record<string, number> = {};
      Object.keys(filters).forEach(key => {
        if (filters[key].enabled) {
          const feature = AUDIO_FEATURES.find(f => f.key === key);
          if (!feature) return;

          if (filters[key].min !== feature.min) {
            body[`min${key.charAt(0).toUpperCase()}${key.slice(1)}`] = filters[key].min;
          }
          if (filters[key].max !== feature.max) {
            body[`max${key.charAt(0).toUpperCase()}${key.slice(1)}`] = filters[key].max;
          }
        }
      });

      const response = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...body, limit: 50 })
      });

      const data = await response.json();

      if (data.success) {
        setTracks(data.tracks);
      } else {
        setError(data.error || "Failed to fetch recommendations")
      }
    } catch (error) {
      setError("Network error: " + (error instanceof Error ? error.message: "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-white p-8 w-full">
      <div className="max-w-6xl mx-auto w-full">
        <h1 className="text-4xl font-bold mb-2 text-center">
          Playfull Playlist Generator
        </h1>
        <p className="text-center text-slate-300 mb-8">
          Adjust audio features to find your perfect tracks
        </p>

        <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 mb-6 border border-slate-700">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Audio Features</h2>
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition"
            >
              Reset All
            </button>
          </div>

          <div className="space-y-6">
            {AUDIO_FEATURES.map(feature => {
              const filter = filters[feature.key];
              const isEnabled = filter.enabled;

              return (
                <div key={feature.key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input 
                        type="checkbox"
                        checked={isEnabled}
                        onChange={() => toggleFilter(feature.key)}
                        className="w-5 h-5 rounded cursor-pointer"
                      />
                      <div>
                        <h3 className="font-semibold text-sm sm:text-lg">{feature.label}</h3>
                        <p className="text-xs sm:text-sm text-slate-400">{feature.description}</p>
                      </div>
                    </div>
                    <div className="text-xs sm:text-sm text-slate-300">
                      {filter.min.toFixed(feature.step >= 1 ? 0 : 2)} - {filter.max.toFixed(feature.step >= 1 ? 0 : 2)}
                    </div>
                  </div>

                  {isEnabled && (
                    <div className="space-y-2 pl-8">
                      <div className="flex items-center gap-4">
                        <label className="text-sm w-12 text-slate-400">Min:</label>
                        <input 
                          type="range" 
                          min={feature.min}
                          max={filter.max}
                          step={feature.step}
                          value={filter.min}
                          onChange={(e) => updateFilter(feature.key, "min", e.target.value)}
                          className="flex-1 h-2 rounded-lg appearance-none cursor-pointer bg-slate-700"
                          style={{
                            background: `linear-gradient(to right, ${feature.color.replace('bg-', '#')} 0%, ${feature.color.replace('bg-', '#')} ${((filter.min - feature.min) / (feature.max - feature.min)) * 100}%, rgb(51, 65, 85) ${((filter.min - feature.min) / (feature.max - feature.min)) * 100}%, rgb(51, 65, 85) 100%)`
                          }}
                        />
                        <span className="text-sm w-12 text-right">{filter.min.toFixed(feature.step >= 1 ? 0 : 2)}</span>
                      </div>

                      <div className="flex items-center gap-4">
                        <label className="text-sm w-12 text-slate-400">Max:</label>
                        <input 
                          type="range"
                          min={filter.min}
                          max={feature.max}
                          step={feature.step}
                          value={filter.max}
                          onChange={(e) => updateFilter(feature.key, "max", e.target.value)}
                          className="flex-1 h-2 rounded-lg appearance-none cursor-pointer bg-slate-700"
                          style={{
                            background: `linear-gradient(to right, rgb(51, 65, 85) 0%, rgb(51, 65, 85) ${((filter.max - feature.min) / (feature.max - feature.min)) * 100}%, ${feature.color.replace('bg-', '#')} ${((filter.max - feature.min) / (feature.max - feature.min)) * 100}%, ${feature.color.replace('bg-', '#')} 100%)`
                          }}
                        />
                        <span className="text-sm w-12 text-right">{filter.max.toFixed(feature.step >= 1 ? 0 : 2)}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <button 
            onClick={fetchRecommendations}
            disabled={loading || !Object.values(filters).some(f => f.enabled)}
            className="w-full cursor-pointer pt-5"
          >
            {loading ? "Loading..." : "Get Recommendations"}
          </button>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-6">
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {tracks.length > 0 && (
          <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700">
            <h2 className="text-2xl font-semibold mb-4">
              Found {tracks.length} tracks
            </h2>
            <div className="space-y-2 overflow-y-auto">
              {tracks.map((track, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition"
                >
                  <input 
                    type="checkbox"
                    checked={selectedTracks.has(track.spotifyId)}
                    onChange={() => toggleTrackSelection(track.spotifyId)}
                    className="w-5 h-5 rounded cursor-pointer"
                  />
                  <div className="flex flex-col justify-center items-center">
                    <p className="font-semibold text-xs sm:text-sm">{track.trackName}</p>
                    <p className="text-xs sm:text-sm text-slate-400">{track.artistName}</p>
                  </div>
                  <div className="text-xs text-slate-400 text-right">
                    <div>D: {track.danceability?.toFixed(2)}</div>
                    <div>E: {track.energy?.toFixed(2)}</div>
                    <div>V: {track.valence?.toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-4">
              <div className="flex pt-2 items-center space-x-3">
                <button
                  onClick={selectAllTracks}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white rounded-md shadow-md transition"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span className="font-medium text-xs sm:text-lg">Select all songs</span>
                </button>

                <button
                  onClick={deselectAllTracks}

                  className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 text-slate-200 rounded-md transition"
                >
                  <X className="w-4 h-4" />
                  <span className="text-xs sm:text-lg">Clear</span>
                </button>

                <span className="text-sm text-slate-400 ml-2">
                  {selectedTracks.size} selected
                </span>
              </div>

              <div className="flex flex-col items-start space-y-2">
                <label className="text-sm sm:text-lg sm:pt-3 text-slate-300">Playlist name</label>
                <div className="flex items-center space-x-2">
                  <input
                    value={playlistName}
                    onChange={(e) => setPlaylistName(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") createPlaylist(); }}
                    placeholder="e.g. Morning Run"
                    maxLength={80}
                    className="bg-white text-black rounded-md px-3 py-2 w-56 focus:outline-none"
                  />

                  <button
                    onClick={createPlaylist}
                    disabled={creatingPlaylist}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-white ${
                      creatingPlaylist ? "bg-gray-500 cursor-wait" : "bg-green-500 hover:bg-green-600"
                    }`}
                    aria-busy={creatingPlaylist}
                  >
                    {creatingPlaylist ? (
                      // small inline spinner
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                      </svg>
                    ) : (
                      <span></span>
                    )}
                    <span className="text-sm sm:text-lg">{creatingPlaylist ? "Creating..." : "Create"}</span>
                  </button>
                </div>

                {playlistSuccess && (
                  <p className="text-sm text-green-400 mt-1">{playlistSuccess}</p>
                )}
                {error && (
                  <p className="text-sm text-red-400 mt-1">{error}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
