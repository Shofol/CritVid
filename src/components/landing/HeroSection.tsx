import { Button } from "@/components/ui/button";
import React from "react";
import { Link } from "react-router-dom";

const HeroSection: React.FC = () => {
  return (
    <section className="relative py-20 overflow-hidden bg-black">
      {/* Optional background video */}
      <div className="absolute inset-0 z-0 opacity-10 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          className="w-full h-full object-cover"
          poster="/placeholder.svg"
        >
          <source src="/sample-dance-video.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Left side - Text content */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
              Elite Dance Feedback.
              <br />
              <span className="text-primary">Anywhere. Anytime.</span>
            </h1>
            <p className="text-xl mb-8 text-gray-300 max-w-2xl">
              Upload your performance video. Choose a pro adjudicator. Get
              detailed feedback with video annotations, voice-over critiques,
              and AI training tips.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link to="/upload-video">
                <Button size="lg" className="px-8">
                  Upload Your Video
                </Button>
              </Link>
              <Link to="/signup?role=adjudicator">
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 border-white bg-white text-black hover:bg-transparent hover:text-white"
                >
                  Join as an Adjudicator
                </Button>
              </Link>
            </div>
          </div>

          {/* Right side - Graphics */}
          <div className="flex-1 relative mt-10 md:mt-0">
            <div className="relative rounded-xl overflow-hidden shadow-2xl border border-gray-800">
              <img
                src="https://d64gsuwffb70l.cloudfront.net/6823bfb42897122395a1a2c7_1747320667168_ea78877c.png"
                alt="Dance critique interface with adjudicator feedback"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
