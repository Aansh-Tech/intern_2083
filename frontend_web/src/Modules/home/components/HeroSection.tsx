import { Button } from '@/common/components/Button';
import { Link } from 'react-router-dom';

export const HeroSection = () => {
  return (
    <section className="text-center py-12">
      <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium mb-4">
        Available for new projects
      </span>
      <h1 className="text-5xl font-bold tracking-tight mb-4">
        Architecting <span className="text-blue-600 dark:text-blue-400">digital experiences.</span>
      </h1>
      <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
        I design and build calm, high-performance interfaces for ambitious software teams. Currently focused on developer tools and design systems.
      </p>
      <div className="flex justify-center gap-4">
        <Link to="/projects">
          <Button variant="primary" size="lg">All projects</Button>
        </Link>
        <Link to="/about">
          <Button variant="outline" size="lg">About me</Button>
        </Link>
      </div>
    </section>
  );
};