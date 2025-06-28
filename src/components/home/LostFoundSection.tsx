import React, { useState } from 'react';
import { Search, Upload, Heart, Home } from 'lucide-react';
import { Link } from '../navigation/Link';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';

const LostFoundSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <section className="py-16 relative">
      <div className="kawaii-container">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Home size={32} className="text-kawaii-yellow-dark" />
            <Heart size={28} className="text-kawaii-pink-dark fill-kawaii-pink-dark" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Lost & Found Pets
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto font-quicksand">
            Help reunite pets with their families by reporting found animals or searching for your lost companion
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          <Card className="flex-1 p-8">
            <div className="flex flex-col items-center text-center h-full">
              <Search size={48} className="text-kawaii-pink-dark mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Lost a Pet?</h3>
              <p className="text-gray-600 mb-6 font-quicksand">
                Search our database of found pets or report your missing furry friend
              </p>
              
              {/* Centered search input container */}
              <div className="w-full max-w-md mx-auto mb-6">
                <Input 
                  placeholder="🔍 Search by description, location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-center"
                />
              </div>
              
              {/* Action buttons that link to registry */}
              <div className="flex flex-col sm:flex-row gap-4 w-full mt-auto">
                <Link to="/lost-found/registry" className="flex-1">
                  <Button 
                    variant="primary" 
                    className="w-full justify-center"
                  >
                    Search Lost Pets
                  </Button>
                </Link>
                <Link to="/lost-found/registry" className="flex-1">
                  <Button 
                    variant="blue" 
                    icon={<Upload size={18} />}
                    className="w-full justify-center"
                  >
                    Report Lost Pet
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
          
          <Card className="flex-1 p-8">
            <div className="flex flex-col items-center text-center h-full">
              <div className="flex items-center gap-2 mb-4">
                <Heart size={48} className="text-kawaii-pink-dark" />
                <Home size={32} className="text-kawaii-yellow-dark" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Found a Pet?</h3>
              <p className="text-gray-600 mb-6 font-quicksand">
                Report a found pet to help them get back home to their worried families
              </p>
              <div className="border-2 border-dashed border-kawaii-pink rounded-lg p-8 mb-6 w-full">
                <div className="flex flex-col items-center">
                  <Upload size={32} className="text-kawaii-pink-dark mb-2" />
                  <p className="text-gray-600 text-sm font-quicksand">
                    Drop a photo here or click to upload
                  </p>
                </div>
              </div>
              
              {/* Single button that links to registry */}
              <div className="w-full mt-auto">
                <Link to="/lost-found/registry" className="w-full">
                  <Button 
                    variant="green" 
                    className="w-full justify-center"
                  >
                    Help Pet Get Home
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <PetCard 
            name="Fluffy"
            type="Lost"
            species="Dog"
            breed="Golden Retriever"
            location="Central Park, New York"
            date="Sep 15, 2025"
            imageUrl="https://images.pexels.com/photos/1490908/pexels-photo-1490908.jpeg"
          />
          <PetCard 
            name="Unknown"
            type="Found"
            species="Cat"
            breed="Tabby"
            location="Main Street, Boston"
            date="Sep 16, 2025"
            imageUrl="https://images.pexels.com/photos/2061057/pexels-photo-2061057.jpeg"
          />
          <PetCard 
            name="Max"
            type="Lost"
            species="Dog"
            breed="Corgi"
            location="Riverfront Park, Chicago"
            date="Sep 14, 2025"
            imageUrl="https://images.pexels.com/photos/1629781/pexels-photo-1629781.jpeg"
          />
        </div>
        
        <div className="text-center mt-8">
          <Link to="/lost-found/registry">
            <Button variant="primary">
              View All Reports
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

type PetCardProps = {
  name: string;
  type: 'Lost' | 'Found';
  species: string;
  breed: string;
  location: string;
  date: string;
  imageUrl: string;
};

const PetCard: React.FC<PetCardProps> = ({
  name,
  type,
  species,
  breed,
  location,
  date,
  imageUrl
}) => {
  return (
    <Card hover>
      <div className="relative">
        <img 
          src={imageUrl} 
          alt={`${type} ${species} - ${breed}`}
          className="w-full h-48 object-cover rounded-t-kawaii"
        />
        <span className={`absolute top-3 right-3 text-sm font-bold py-1 px-3 rounded-full ${
          type === 'Lost' ? 'bg-kawaii-pink' : 'bg-kawaii-green'
        }`}>
          {type}
        </span>
      </div>
      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-800 mb-1">{name}</h3>
        <p className="text-gray-600 mb-2">{species} - {breed}</p>
        <div className="text-sm text-gray-500 mb-4">
          <p>{location}</p>
          <p>{date}</p>
        </div>
        <Link to="/lost-found/registry" className="w-full">
          <Button 
            variant={type === 'Lost' ? 'primary' : 'green'}
            className="w-full justify-center"
          >
            {type === 'Lost' ? 'I Found This Pet' : 'Help Get Home'}
          </Button>
        </Link>
      </div>
    </Card>
  );
};

export default LostFoundSection;