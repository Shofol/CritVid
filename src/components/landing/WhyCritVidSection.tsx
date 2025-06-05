import React from 'react';

const WhyCritVidSection: React.FC = () => {
  const features = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.465a5 5 0 001.06-7.072m-2.829 9.9a9 9 0 010-12.728" />
        </svg>
      ),
      title: 'Voice-over + real-time annotations',
      description: 'Receive detailed audio feedback synchronized with visual annotations',
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      title: 'AI exercises suggested for improvement',
      description: 'Get personalized training recommendations based on your performance',
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'Child-safe & parent-approved system',
      description: 'Secure platform with parental controls and privacy protections',
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      title: 'No expensive travel for adjudication',
      description: 'Save time and money by getting professional feedback remotely',
    },
  ];

  return (
    <section className="py-16 bg-gray-900 w-full">
      <div className="container mx-auto px-4 max-w-none">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-white">Why CritVid?</h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Our platform offers unique advantages for dancers at all levels
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-center max-w-7xl mx-auto">
          {/* Left side - Features list */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-4 p-4 rounded-lg hover:bg-gray-800 transition-colors">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-white">{feature.title}</h3>
                    <p className="text-gray-300 text-sm">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Right side - Mobile app mockup */}
          <div className="flex-1 flex justify-center">
            <div className="relative max-w-xs">
              {/* Phone frame */}
              <div className="border-8 border-gray-800 rounded-[3rem] overflow-hidden shadow-xl">
                <div className="aspect-[9/19] w-full bg-gray-800 overflow-hidden">
                  {/* App screen content */}
                  <div className="h-full flex flex-col">
                    {/* App header */}
                    <div className="bg-primary text-white p-4">
                      <div className="text-lg font-semibold">CritVid Feedback</div>
                    </div>
                    
                    {/* App content */}
                    <div className="flex-1 p-4 bg-gray-700">
                      {/* Video thumbnail */}
                      <div className="rounded-lg overflow-hidden mb-4 relative">
                        <img 
                          src="/placeholder.svg" 
                          alt="Dance video" 
                          className="w-full h-32 object-cover"
                        />
                      </div>
                      
                      {/* Feedback timeline */}
                      <div className="space-y-3">
                        <div className="bg-gray-800 p-3 rounded-lg shadow-sm">
                          <div className="text-xs text-gray-400 mb-1">0:23</div>
                          <div className="text-sm font-medium text-white">Arm position needs adjustment</div>
                        </div>
                        
                        <div className="bg-primary/10 p-3 rounded-lg shadow-sm border border-primary/30">
                          <div className="text-xs text-primary mb-1">AI Tip: 3x Relevé Holds</div>
                          <div className="text-sm text-white">Practice relevé balance exercises</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyCritVidSection;