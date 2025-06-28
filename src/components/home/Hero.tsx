import React from 'react';
import { Heart, Search, MapPin, Users, Home } from 'lucide-react';
import Button from '../ui/Button';

const Hero: React.FC = () => {
  return (
    <div className="relative pt-16 md:pt-20 pb-8 md:pb-10">
      <div className="kawaii-container pt-8 md:pt-16 text-center px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="inline-block relative mb-4">
            <div className="flex items-center gap-2">
              <Heart 
                size={24} 
                className="inline-block text-kawaii-pink-dark fill-kawaii-pink-dark animate-pulse sm:h-8 sm:w-8" 
              />
              <Home 
                size={20} 
                className="inline-block text-kawaii-yellow-dark fill-kawaii-yellow-dark sm:h-6 sm:w-6" 
              />
            </div>
            <span className="kawaii-floating inline-block relative">
              <span className="absolute -top-2 -right-2 transform rotate-12">
                <Heart size={12} className="text-kawaii-pink-dark fill-kawaii-pink-dark sm:h-4 sm:w-4" />
              </span>
            </span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4 md:mb-6 leading-tight">
            Send Every Paw
            <span className="text-kawaii-pink-dark"> Back Home</span>
          </h1>
          
          <div className="mb-6 md:mb-8">
            <p className="text-2xl md:text-3xl font-bold text-kawaii-yellow-dark mb-2 font-quicksand">
              🏡 "Send every paw back home."
            </p>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4 sm:px-0 font-quicksand">
              Connect with a community of animal lovers to help lost pets find their way home, support adoption, and provide care for animals in need.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center px-4 sm:px-0">
            <Button 
              variant="primary"
              icon={<Search size={18} className="sm:w-5 sm:h-5" />}
              className="text-base sm:text-lg w-full sm:w-auto"
            >
              Find Lost Pet
            </Button>
            <Button 
              variant="blue"
              icon={<MapPin size={18} className="sm:w-5 sm:h-5" />}
              className="text-base sm:text-lg w-full sm:w-auto"
            >
              Report Found Pet
            </Button>
          </div>
          
          <div className="mt-12 md:mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 px-4 sm:px-0">
            <FeatureCard 
              icon={<Search size={32} className="text-kawaii-pink-dark sm:w-10 sm:h-10" />}
              title="Lost & Found"
              description="Quickly report or search for lost pets with our AI-powered photo recognition"
            />
            <FeatureCard 
              icon={<MapPin size={32} className="text-kawaii-blue-dark sm:w-10 sm:h-10" />}
              title="Find Nearby Vets"
              description="Locate the closest veterinarians and pet emergency services"
            />
            <FeatureCard 
              icon={<Users size={32} className="text-kawaii-green-dark sm:w-10 sm:h-10" />}
              title="Community Support"
              description="Connect with local volunteers and animal lovers"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

type FeatureCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="kawaii-card hover:transform hover:scale-105 transition-transform duration-300 p-4 sm:p-6">
      <div className="flex flex-col items-center">
        <div className="mb-3 sm:mb-4">{icon}</div>
        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-sm sm:text-base text-gray-600 text-center">{description}</p>
      </div>
    </div>
  );
};

export default Hero;