"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import AudioFeaturesSlider from "@/components/AudioFeaturesSlider";

export default function Create() {
  const search = useSearchParams();
  const addTo = search.get("addTo");
  const name = search.get("name") 
  const [initialPlaylistId, setInitialPlaylistId] = useState<string | null>(null);
  const [initialPlaylistName, setInitialPlaylistName] = useState<string | null>(null);

  useEffect(() => {
    if (addTo) {
      setInitialPlaylistId(addTo);
      setInitialPlaylistName(name)
    }
  }, [addTo, name]);

  return (
    <div>
      <AudioFeaturesSlider addingToPlaylistId={initialPlaylistId} addingToPlaylistName={initialPlaylistName} />
    </div>
  );
}