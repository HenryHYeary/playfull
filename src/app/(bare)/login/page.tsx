"use client";

import React from 'react';
import { signIn } from 'next-auth/react';

function handleSignIn() {
  signIn('spotify', { callbackUrl: '/' });
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-md">

        <div className="flex justify-center">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl shadow-purple-500/50">
            <svg 
              className="w-12 h-12 text-white" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
              <circle cx="12" cy="12" r="3" fill="white"/>
            </svg>
          </div>
        </div>

        <div>
          <h1 className="text-5xl font-bold text-white mb-3">
            Play<span className="text-yellow-200">full</span>
          </h1>
          <p className="text-xl text-slate-300">
            Create playlists from audio features
          </p>
        </div>

        <p className="text-slate-400 text-sm leading-relaxed">
          Fine-tune your music selection with precision controls for danceability, energy, mood, and more.
        </p>

        <button
          onClick={handleSignIn}
          className="group relative w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/50"
        >
          <div className="flex items-center justify-center gap-3">
            <svg 
              className="w-6 h-6" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
            <span>Continue with Spotify</span>
          </div>
        </button>

        <p className="text-xs text-slate-500 mt-6">
          By signing in, you agree to connect your Spotify account
        </p>
      </div>
    </div>
  );
}