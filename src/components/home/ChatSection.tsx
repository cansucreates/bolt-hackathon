import React, { useState } from 'react';
import { MessageCircle, Send, PawPrint as Paw } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';

const ChatSection: React.FC = () => {
  const [message, setMessage] = useState('');

  return (
    <section className="py-16 bg-kawaii-purple/20">
      <div className="kawaii-container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Get Expert Vet Advice
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Chat with our AI vet assistant or connect with real veterinarians for pet health questions
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <Card>
            <div className="p-6">
              <div className="bg-kawaii-purple/10 rounded-lg p-4 mb-6">
                <div className="flex space-x-2 items-center mb-4">
                  <Paw size={20} className="text-kawaii-purple-dark" />
                  <h3 className="font-bold text-gray-800">
                    AI Vet Assistant
                  </h3>
                </div>
                <p className="text-gray-600">
                  Ask me any basic pet health questions! I can help with common concerns, but remember to always consult with a real veterinarian for serious health issues.
                </p>
              </div>
              
              <div className="space-y-4 mb-6">
                <ChatMessage 
                  type="user"
                  message="My dog ate a small piece of chocolate. Should I be worried?"
                />
                <ChatMessage 
                  type="bot"
                  message="Chocolate contains theobromine, which is toxic to dogs. The level of danger depends on the type of chocolate and your dog's size. Dark chocolate and baking chocolate are more dangerous than milk chocolate. Symptoms of chocolate toxicity include vomiting, diarrhea, increased heart rate, and in severe cases, seizures."
                />
                <ChatMessage 
                  type="bot"
                  message="For a small piece of milk chocolate and a medium-sized dog, monitor for any unusual symptoms. If you notice any concerning behavior or if it was dark chocolate, please contact your vet immediately or call the pet poison helpline at (855) 764-7661."
                />
                <ChatMessage 
                  type="user"
                  message="It was a small piece of milk chocolate and my dog is a 40-pound Labrador. She seems fine so far."
                />
                <ChatMessage 
                  type="bot"
                  message="For a 40-pound Labrador and a small piece of milk chocolate, the risk is likely low. Milk chocolate contains less theobromine than dark chocolate. Still, monitor your dog for the next 24 hours for any unusual symptoms like restlessness, excessive thirst, or vomiting. Make sure fresh water is available. If you notice any concerning symptoms, please contact your veterinarian."
                />
              </div>
              
              <div className="flex space-x-2">
                <input 
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask about pet health, behavior, or care..."
                  className="kawaii-input flex-1"
                />
                <Button 
                  variant="primary"
                  icon={<Send size={18} />}
                >
                  Send
                </Button>
              </div>
              
              <div className="mt-6 text-center">
                <p className="text-gray-500 text-sm mb-4">
                  Need to speak with a real veterinarian?
                </p>
                <Button 
                  variant="blue"
                  icon={<MessageCircle size={18} />}
                >
                  Connect with a Vet Now
                </Button>
              </div>
            </div>
          </Card>
          
          <div className="text-center mt-8">
            <p className="text-gray-600 mb-4">
              Remember, online advice is not a substitute for professional veterinary care
            </p>
            <Button variant="green">
              Find Emergency Vet Services
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

type ChatMessageProps = {
  type: 'user' | 'bot';
  message: string;
};

const ChatMessage: React.FC<ChatMessageProps> = ({
  type,
  message
}) => {
  return (
    <div className={`flex ${type === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div 
        className={`max-w-[80%] rounded-2xl p-4 ${
          type === 'user' 
            ? 'bg-kawaii-pink text-gray-700 rounded-tr-none' 
            : 'bg-white border border-kawaii-purple/30 text-gray-700 rounded-tl-none'
        }`}
      >
        {message}
      </div>
    </div>
  );
};

export default ChatSection;