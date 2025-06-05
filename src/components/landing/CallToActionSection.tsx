import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const CallToActionSection: React.FC = () => {
  return (
    <section className="py-20 bg-primary/5 w-full">
      <div className="container mx-auto px-4 text-center max-w-none">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to Level Up Your Performance?
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          Submit your first routine and get actionable feedback from industry pros.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/upload-video">
            <Button size="lg" className="px-8">
              Get Started Now
            </Button>
          </Link>
          <Link to="/help">
            <Button size="lg" variant="outline" className="px-8">
              Learn More
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CallToActionSection;