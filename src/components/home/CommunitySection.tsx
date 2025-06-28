import React from 'react';
import { MessageCircle, Heart, Clock, Users, MapPin, Home } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';

const CommunitySection: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-kawaii-purple/10 via-kawaii-pink/10 to-transparent">
      <div className="kawaii-container">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Users size={32} className="text-kawaii-purple-dark" />
            <Home size={28} className="text-kawaii-pink-dark" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Join Our Pet-Loving Community
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto font-quicksand">
            Connect with fellow animal lovers, share stories, and get advice from our friendly PawBackHome community
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Community Forums Section */}
          <Card className="h-full bg-white/70 backdrop-blur-sm hover:bg-white/80 transition-colors duration-300">
            <div className="p-6 flex flex-col h-full">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Community Forums
              </h3>
              <p className="text-gray-600 mb-6 font-quicksand">
                Join discussions on pet care, training tips, and share your own experiences
              </p>
              <div className="space-y-4 flex-grow">
                <ForumTopic 
                  title="Training Tips for New Puppies"
                  replies={28}
                  lastActive="2 hours ago"
                />
                <ForumTopic 
                  title="Homemade Pet Treats - Share Your Recipes!"
                  replies={42}
                  lastActive="4 hours ago"
                />
                <ForumTopic 
                  title="How to Introduce a New Cat to Your Home"
                  replies={19}
                  lastActive="Yesterday"
                />
              </div>
              <div className="mt-6">
                <Button variant="primary" className="w-full">
                  Browse All Topics
                </Button>
              </div>
            </div>
          </Card>

          {/* Community Feed Section */}
          <Card className="h-full bg-white/70 backdrop-blur-sm hover:bg-white/80 transition-colors duration-300">
            <div className="p-6 flex flex-col h-full">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Community Feed
              </h3>
              <p className="text-gray-600 mb-6 font-quicksand">
                See what's happening in the PawBackHome community
              </p>
              <div className="space-y-4 flex-grow">
                <CommunityPost 
                  username="Sarah_PetLover"
                  time="15 minutes ago"
                  content="Just found this beautiful cat wandering around Main Street. No collar, very friendly. Anyone recognize this cutie? Let's help them get back home!"
                  imageUrl="https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg"
                  likes={24}
                  comments={8}
                />
                <CommunityPost 
                  username="MaxDogTrainer"
                  time="2 hours ago"
                  content="Success story! After 6 weeks of training, Luna finally mastered the 'stay' command and is ready to go back home!"
                  likes={46}
                  comments={12}
                />
              </div>
              <div className="mt-6">
                <Button variant="blue" className="w-full">
                  Join Community
                </Button>
              </div>
            </div>
          </Card>

          {/* Upcoming Events Section */}
          <Card className="h-full bg-white/70 backdrop-blur-sm hover:bg-white/80 transition-colors duration-300">
            <div className="p-6 flex flex-col h-full">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Upcoming Events
              </h3>
              <p className="text-gray-600 mb-6 font-quicksand">
                Join local pet events and volunteer opportunities
              </p>
              <div className="space-y-4 flex-grow">
                <EventCard 
                  title="Pet Adoption Fair"
                  date="Sep 25, 2025"
                  location="Central Park, New York"
                  attendees={156}
                />
                <EventCard 
                  title="Pet First Aid Workshop"
                  date="Oct 5, 2025"
                  location="Community Center, Boston"
                  attendees={42}
                />
                <EventCard 
                  title="Doggy Fun Run"
                  date="Oct 12, 2025"
                  location="Riverside Park, Chicago"
                  attendees={89}
                />
              </div>
              <div className="mt-6">
                <Button variant="green" className="w-full">
                  See All Events
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

type ForumTopicProps = {
  title: string;
  replies: number;
  lastActive: string;
};

const ForumTopic: React.FC<ForumTopicProps> = ({
  title,
  replies,
  lastActive
}) => {
  return (
    <div className="border border-kawaii-pink/30 rounded-lg p-4 hover:bg-kawaii-pink/10 transition-colors duration-300">
      <h4 className="font-bold text-gray-800">{title}</h4>
      <div className="flex justify-between items-center mt-2 text-sm text-gray-600">
        <div className="flex items-center">
          <MessageCircle size={14} className="mr-1" />
          <span>{replies} replies</span>
        </div>
        <div className="flex items-center">
          <Clock size={14} className="mr-1" />
          <span>{lastActive}</span>
        </div>
      </div>
    </div>
  );
};

type EventCardProps = {
  title: string;
  date: string;
  location: string;
  attendees: number;
};

const EventCard: React.FC<EventCardProps> = ({
  title,
  date,
  location,
  attendees
}) => {
  return (
    <div className="border border-kawaii-green/30 rounded-lg p-4 hover:bg-kawaii-green/10 transition-colors duration-300">
      <h4 className="font-bold text-gray-800">{title}</h4>
      <div className="mt-2 text-sm text-gray-600">
        <div className="flex items-center mb-1">
          <Clock size={14} className="mr-1" />
          <span>{date}</span>
        </div>
        <div className="flex items-center mb-1">
          <MapPin size={14} className="mr-1" />
          <span>{location}</span>
        </div>
        <div className="flex items-center">
          <Users size={14} className="mr-1" />
          <span>{attendees} attending</span>
        </div>
      </div>
    </div>
  );
};

type CommunityPostProps = {
  username: string;
  time: string;
  content: string;
  imageUrl?: string;
  likes: number;
  comments: number;
};

const CommunityPost: React.FC<CommunityPostProps> = ({
  username,
  time,
  content,
  imageUrl,
  likes,
  comments
}) => {
  return (
    <div className="border border-kawaii-blue/30 rounded-lg p-4 bg-white/50 hover:bg-white/60 transition-colors duration-300">
      <div className="flex items-center mb-3">
        <div className="w-10 h-10 rounded-full bg-kawaii-pink-dark flex items-center justify-center text-white font-bold">
          {username.charAt(0)}
        </div>
        <div className="ml-3">
          <h4 className="font-bold text-gray-800">{username}</h4>
          <p className="text-xs text-gray-500">{time}</p>
        </div>
      </div>
      <p className="text-gray-700 mb-3 font-quicksand">{content}</p>
      {imageUrl && (
        <div className="mb-3">
          <img 
            src={imageUrl} 
            alt="Post"
            className="w-full rounded-lg"
          />
        </div>
      )}
      <div className="flex space-x-4 text-sm text-gray-600">
        <div className="flex items-center">
          <Heart size={16} className="mr-1 text-kawaii-pink-dark" />
          <span>{likes}</span>
        </div>
        <div className="flex items-center">
          <MessageCircle size={16} className="mr-1" />
          <span>{comments}</span>
        </div>
      </div>
    </div>
  );
};

export default CommunitySection;