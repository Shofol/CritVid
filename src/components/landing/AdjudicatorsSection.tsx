import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { adjudicators } from '@/data/adjudicatorData';

const AdjudicatorsSection: React.FC = () => {
  // Use only the first 3 adjudicators for the landing page
  const featuredAdjudicators = adjudicators.slice(0, 3);

  return (
    <section className="py-16 bg-gray-900 w-full">
      <div className="container mx-auto px-4 max-w-none">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-white">Meet Our Adjudicators</h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Learn from industry professionals with years of experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {featuredAdjudicators.map((adjudicator) => (
            <Card 
              key={adjudicator.id}
              className="overflow-hidden hover:shadow-md transition-shadow group bg-gray-800 border-gray-700"
            >
              <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden">
                <img 
                  src={adjudicator.profileImage} 
                  alt={adjudicator.name}
                  className="w-full h-64 object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-white">{adjudicator.name}</h3>
                <p className="text-gray-300 mb-4">{adjudicator.credentials}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {adjudicator.danceStyles.slice(0, 3).map((style, index) => (
                    <span 
                      key={index} 
                      className="bg-primary/10 text-primary text-sm px-3 py-1 rounded-full"
                    >
                      {style}
                    </span>
                  ))}
                </div>
                
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="ml-1 font-medium text-white">{adjudicator.rating}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <span className="ml-1 text-sm text-gray-300">{adjudicator.averageTurnaround} days</span>
                  </div>
                </div>
                
                <Link to={`/find-adjudicator/${adjudicator.id}`}>
                  <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-white transition-colors">
                    View Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Link to="/find-adjudicator">
            <Button variant="secondary">
              View All Adjudicators
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AdjudicatorsSection;