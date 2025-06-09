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
    <AppLayout noHeader={false}>
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
                <ol className="list-decimal list-inside space-y-3 text-sm">
                  <li className="font-medium">
                    Click "Start Screen Recording" below
                  </li>
                  <li>
                    <span className="font-medium">IMPORTANT:</span> When the
                    browser asks for screen recording permissions:
                    <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                      <li>Choose the screen/window you want to record</li>
                      <li className="text-red-600 font-medium">
                        ✅ CHECK the "Share audio" or "Share system audio"
                        checkbox
                      </li>
                      <li>This ensures video/system sounds are captured</li>
                    </ul>
                  </li>
                  <li>
                    <span className="font-medium">Grant microphone access</span>{" "}
                    when prompted (for your voice commentary)
                  </li>
                  <li>
                    The recording will capture:
                    <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                      <li>📹 Screen video</li>
                      <li>
                        🔊 System/application audio (if "Share audio" was
                        checked)
                      </li>
                      <li>🎤 Your microphone audio</li>
                    </ul>
                  </li>
                  <li>Click "Stop Recording" when finished</li>
                  <li>Download or preview your recording</li>
                </ol>

                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <span className="text-yellow-600 font-bold">💡</span>
                    <div>
                      <p className="text-sm text-yellow-800 font-medium mb-1">
                        Troubleshooting Audio Issues:
                      </p>
                      <ul className="text-xs text-yellow-700 space-y-1">
                        <li>
                          • No sound? Make sure you checked "Share audio" in the
                          screen sharing dialog
                        </li>
                        <li>
                          • No microphone? Check browser permissions and allow
                          microphone access
                        </li>
                        <li>
                          • Volume issues? Adjust your system volume and
                          microphone levels
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
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
