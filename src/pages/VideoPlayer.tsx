import StandardVideoPlayer from "@/components/StandardVideoPlayer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { VIDEO_UPLOADS_BUCKET } from "../lib/storage";
import { supabase } from "../lib/supabase";

export default function VideoPlayer() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("user_id");
  const navigate = useNavigate();
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    const fetchSignedUrl = async () => {
      if (id) {
        try {
          const { data, error } = await supabase.storage
            .from(VIDEO_UPLOADS_BUCKET)
            .createSignedUrl(`${userId}/${id}`, 3600);

          if (data) {
            console.log(data.signedUrl);
            setSrc(data.signedUrl);
          }
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchSignedUrl();
  }, [id, userId]);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Video Player</CardTitle>
          </CardHeader>
          <CardContent>
            {src ? (
              <>
                <StandardVideoPlayer
                  src={src}
                  title={`Video ${id || "1"}`}
                  className="aspect-video w-full"
                />

                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold mb-2">Video Information</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>
                      <strong>Video ID:</strong> {id || "1"}
                    </p>
                    <p>
                      <strong>Format:</strong> MP4
                    </p>
                    <p>
                      <strong>Quality:</strong> HD
                    </p>
                    <p>
                      <strong>Status:</strong> Ready to play
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <p>Loading Video...</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
