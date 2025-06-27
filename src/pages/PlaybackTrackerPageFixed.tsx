import { AppLayout } from "@/components/AppLayout";
import PlaybackTrackerFixed from "@/components/PlaybackTrackerFixed";
import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getCritiqueById } from "../lib/critiqueService";
import { VIDEO_UPLOADS_BUCKET } from "../lib/storage";
import { supabase } from "../lib/supabase";
import { Critique, DrawAction } from "../types/critiqueTypes";

const PlaybackTrackerPageFixed: React.FC = () => {
  const [search] = useSearchParams();
  const critiqueId = search.get("critiqueId");
  const [drawActions, setDrawActions] = useState<DrawAction[]>([]);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [critique, setCritique] = useState<Critique | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const fetchSignedUrl = async (clientId: string, file_name: string) => {
      if (clientId && file_name) {
        try {
          const { data, error } = await supabase.storage
            .from(VIDEO_UPLOADS_BUCKET)
            .createSignedUrl(`${clientId}/${file_name}`, 3600);

          if (data) {
            setVideoUrl(data.signedUrl);
          }
        } catch (error) {
          console.log(error);
        }
      }
    };

    const fetchCritique = async () => {
      const critiqueData = await getCritiqueById(critiqueId);
      setCritique(critiqueData);
      fetchSignedUrl(critiqueData.user_id, critiqueData.video.file_name);
    };

    if (critiqueId) {
      fetchCritique();
    }
  }, [critiqueId]);

  return (
    <AppLayout noHeader={true}>
      <div className="container mx-auto">
        <PlaybackTrackerFixed
          videoUrl={videoUrl}
          drawActions={drawActions}
          setDrawActions={setDrawActions}
          videoRef={videoRef}
          critique={critique}
        />
      </div>
    </AppLayout>
  );
};

export default PlaybackTrackerPageFixed;
