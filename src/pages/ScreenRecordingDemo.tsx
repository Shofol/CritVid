import AppLayout from "@/components/AppLayout";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useScreenRecorder } from "@/hooks/useScreenRecorder";
import { Download, Mic, Monitor, Square } from "lucide-react";
import React, { useRef } from "react";

const ScreenRecordingDemo: React.FC = () => {
  const {
    isRecording,
    recordedVideoUrl,
    permissionStatus,
    errorMessage,
    requestPermissions,
    startRecording,
    stopRecording,
    clearRecording,
  } = useScreenRecorder();

  const videoRef = useRef<HTMLVideoElement>(null);

  const handleStartRecording = async () => {
    try {
      if (permissionStatus !== "granted") {
        const hasPermission = await requestPermissions();
        if (!hasPermission) return;
      }

      await startRecording();
    } catch (error) {
      console.error("Failed to start recording:", error);
    }
  };

  const handleStopRecording = async () => {
    await stopRecording();
  };

  const handleDownload = () => {
    if (recordedVideoUrl) {
      const a = document.createElement("a");
      a.href = recordedVideoUrl;
      a.download = `screen-recording-${Date.now()}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <AppLayout>
      <div className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4 text-gray-800">
              🎥 Screen Recording
            </h1>
            <p className="text-lg text-gray-600">
              Record your screen with both system audio and microphone audio for
              comprehensive critiques.
            </p>
          </div>

          <div className="grid gap-6">
            {/* Instructions Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="w-5 h-5" />
                  How to Use Screen Recording
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>Click "Start Screen Recording" below</li>
                  <li>
                    Grant screen recording and microphone permissions when
                    prompted
                  </li>
                  <li>Select which screen/window to record</li>
                  <li>
                    Make sure to check "Share audio" in the browser dialog
                  </li>
                  <li>
                    The recording will capture both your screen video and mixed
                    audio (system + microphone)
                  </li>
                  <li>Click "Stop Recording" when finished</li>
                  <li>Download or preview your recording</li>
                </ol>
              </CardContent>
            </Card>

            {/* Error Messages */}
            {errorMessage && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">
                  {errorMessage}
                </AlertDescription>
              </Alert>
            )}

            {/* Recording Controls */}
            <Card>
              <CardHeader>
                <CardTitle>Recording Controls</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 items-center">
                  {!isRecording ? (
                    <Button
                      onClick={handleStartRecording}
                      className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                    >
                      <Monitor className="w-5 h-5" />
                      Start Screen Recording
                    </Button>
                  ) : (
                    <Button
                      onClick={handleStopRecording}
                      className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2 animate-pulse"
                    >
                      <Square className="w-5 h-5" />
                      Stop Recording
                    </Button>
                  )}

                  {isRecording && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-800 rounded-lg border border-red-300">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-semibold">
                        🎥 Screen Recording in Progress...
                      </span>
                    </div>
                  )}

                  {recordedVideoUrl && (
                    <Button
                      onClick={handleDownload}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download Recording
                    </Button>
                  )}

                  {recordedVideoUrl && (
                    <Button
                      onClick={clearRecording}
                      variant="outline"
                      className="text-red-600 border-red-300 hover:bg-red-50"
                    >
                      Clear Recording
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Video Preview */}
            {recordedVideoUrl && (
              <Card>
                <CardHeader>
                  <CardTitle>Recording Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <video
                    ref={videoRef}
                    src={recordedVideoUrl}
                    controls
                    className="w-full rounded-lg border"
                    style={{ maxHeight: "500px" }}
                  >
                    Your browser does not support the video tag.
                  </video>
                  <p className="text-sm text-gray-600 mt-2">
                    This recording includes both screen video and mixed audio
                    (system + microphone).
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Features Info */}
            <Card>
              <CardHeader>
                <CardTitle>🎯 Key Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <Monitor className="w-6 h-6 text-blue-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">
                        Screen Capture
                      </h3>
                      <p className="text-sm text-gray-600">
                        Records your entire screen or selected window with high
                        quality video.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mic className="w-6 h-6 text-green-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">
                        Mixed Audio
                      </h3>
                      <p className="text-sm text-gray-600">
                        Captures both system audio and microphone input in a
                        single recording.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ScreenRecordingDemo;
