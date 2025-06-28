import React from 'react';
import { MapPin, Clock, Phone, Search, Star, Shield, Home } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';

const VetSection: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-kawaii-blue/10 to-kawaii-purple/10">
      <div className="kawaii-container">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Home size={32} className="text-kawaii-yellow-dark" />
            <Shield size={28} className="text-kawaii-blue-dark" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Find Nearby Veterinary Help
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto font-quicksand">
            Locate the closest veterinarians and get professional help for your furry friends through PawBackHome
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Find a Vet Section */}
          <Card className="h-full">
            <div className="p-6 flex flex-col h-full">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Find a Vet
              </h3>
              <p className="text-gray-600 mb-6 font-quicksand">
                Search for veterinarians near you with our easy-to-use finder
              </p>
              <div className="space-y-4 flex-grow">
                <div className="relative">
                  <input 
                    type="text"
                    className="kawaii-input w-full pl-10"
                    placeholder="Enter your location 🏠"
                  />
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                </div>
                
                <select className="kawaii-input w-full">
                  <option>Within 5 miles</option>
                  <option>Within 10 miles</option>
                  <option>Within 25 miles</option>
                  <option>Within 50 miles</option>
                </select>
                
                <div className="space-y-2">
                  <label className="flex items-center p-3 border border-kawaii-blue/30 rounded-lg hover:bg-kawaii-blue/10 transition-colors duration-300">
                    <input type="checkbox" className="mr-2" />
                    <span>Emergency Services 24/7</span>
                  </label>
                  <label className="flex items-center p-3 border border-kawaii-blue/30 rounded-lg hover:bg-kawaii-blue/10 transition-colors duration-300">
                    <input type="checkbox" className="mr-2" />
                    <span>Exotic Pet Care</span>
                  </label>
                  <label className="flex items-center p-3 border border-kawaii-blue/30 rounded-lg hover:bg-kawaii-blue/10 transition-colors duration-300">
                    <input type="checkbox" className="mr-2" />
                    <span>House Calls Available</span>
                  </label>
                </div>
              </div>
              <div className="mt-6">
                <Button 
                  variant="blue" 
                  className="w-full"
                  icon={<Search size={18} />}
                >
                  Search Vets
                </Button>
              </div>
            </div>
          </Card>

          {/* Emergency Services Section */}
          <Card className="h-full">
            <div className="p-6 flex flex-col h-full">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Emergency Services
              </h3>
              <p className="text-gray-600 mb-6 font-quicksand">
                24/7 emergency veterinary care centers near you
              </p>
              <div className="space-y-4 flex-grow">
                <EmergencyVetCard
                  name="PawCare Emergency"
                  distance="0.8 miles"
                  rating={4.9}
                  waitTime="15 mins"
                  phone="(555) 123-4567"
                />
                <EmergencyVetCard
                  name="Night Owl Vet ER"
                  distance="2.3 miles"
                  rating={4.7}
                  waitTime="30 mins"
                  phone="(555) 987-6543"
                />
                <EmergencyVetCard
                  name="24/7 Pet Hospital"
                  distance="3.5 miles"
                  rating={4.8}
                  waitTime="20 mins"
                  phone="(555) 456-7890"
                />
              </div>
              <div className="mt-6">
                <Button variant="primary" className="w-full">
                  View All Emergency Vets
                </Button>
              </div>
            </div>
          </Card>

          {/* Featured Vets Section */}
          <Card className="h-full">
            <div className="p-6 flex flex-col h-full">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Featured Vets
              </h3>
              <p className="text-gray-600 mb-6 font-quicksand">
                Top-rated veterinarians in your area
              </p>
              <div className="space-y-4 flex-grow">
                <VetCard
                  name="Dr. Sarah Wilson"
                  specialty="General Care"
                  experience="15 years"
                  rating={4.9}
                  verified={true}
                />
                <VetCard
                  name="Dr. James Chen"
                  specialty="Exotic Pets"
                  experience="12 years"
                  rating={4.8}
                  verified={true}
                />
                <VetCard
                  name="Dr. Emily Brooks"
                  specialty="Surgery"
                  experience="20 years"
                  rating={5.0}
                  verified={true}
                />
              </div>
              <div className="mt-6">
                <Button variant="green" className="w-full">
                  Book Appointment
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

type EmergencyVetCardProps = {
  name: string;
  distance: string;
  rating: number;
  waitTime: string;
  phone: string;
};

const EmergencyVetCard: React.FC<EmergencyVetCardProps> = ({
  name,
  distance,
  rating,
  waitTime,
  phone
}) => {
  return (
    <div className="border border-kawaii-pink/30 rounded-lg p-4 hover:bg-kawaii-pink/10 transition-colors duration-300">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-bold text-gray-800">{name}</h4>
        <div className="flex items-center bg-kawaii-yellow rounded-full px-2 py-1">
          <Star size={14} className="mr-1 text-yellow-600" />
          <span className="text-sm font-bold">{rating}</span>
        </div>
      </div>
      <div className="space-y-1 text-sm text-gray-600">
        <div className="flex items-center">
          <MapPin size={14} className="mr-1" />
          <span>{distance}</span>
        </div>
        <div className="flex items-center">
          <Clock size={14} className="mr-1" />
          <span>Wait time: {waitTime}</span>
        </div>
        <div className="flex items-center">
          <Phone size={14} className="mr-1" />
          <span>{phone}</span>
        </div>
      </div>
    </div>
  );
};

type VetCardProps = {
  name: string;
  specialty: string;
  experience: string;
  rating: number;
  verified: boolean;
};

const VetCard: React.FC<VetCardProps> = ({
  name,
  specialty,
  experience,
  rating,
  verified
}) => {
  return (
    <div className="border border-kawaii-green/30 rounded-lg p-4 hover:bg-kawaii-green/10 transition-colors duration-300">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="font-bold text-gray-800 flex items-center">
            {name}
            {verified && (
              <Shield size={14} className="ml-1 text-kawaii-blue-dark" />
            )}
          </h4>
          <p className="text-sm text-gray-600">{specialty}</p>
        </div>
        <div className="flex items-center bg-kawaii-yellow rounded-full px-2 py-1">
          <Star size={14} className="mr-1 text-yellow-600" />
          <span className="text-sm font-bold">{rating}</span>
        </div>
      </div>
      <div className="text-sm text-gray-600">
        <p>{experience} experience</p>
      </div>
    </div>
  );
};

export default VetSection;