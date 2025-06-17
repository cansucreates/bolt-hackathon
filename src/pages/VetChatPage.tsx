import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageCircle, 
  Send, 
  Upload, 
  Video, 
  Phone, 
  Clock, 
  Star, 
  AlertTriangle, 
  Heart, 
  Bot, 
  Stethoscope,
  CreditCard,
  MapPin,
  User,
  Shield
} from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'ai' | 'vet';
  content: string;
  timestamp: Date;
  sender?: {
    name: string;
    avatar: string;
    credentials?: string;
  };
}

interface VetProfile {
  id: string;
  name: string;
  credentials: string;
  avatar: string;
  specialties: string[];
  rating: number;
  reviewCount: number;
  isOnline: boolean;
  responseTime: string;
  consultationFee: number;
}

const mockVets: VetProfile[] = [
  {
    id: '1',
    name: 'Dr. Sarah Wilson',
    credentials: 'DVM, DACVIM',
    avatar: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg',
    specialties: ['Internal Medicine', 'Emergency Care'],
    rating: 4.9,
    reviewCount: 127,
    isOnline: true,
    responseTime: '< 5 min',
    consultationFee: 45
  },
  {
    id: '2',
    name: 'Dr. James Chen',
    credentials: 'DVM, MS',
    avatar: 'https://images.pexels.com/photos/6749778/pexels-photo-6749778.jpeg',
    specialties: ['Exotic Pets', 'Avian Medicine'],
    rating: 4.8,
    reviewCount: 89,
    isOnline: true,
    responseTime: '< 10 min',
    consultationFee: 55
  },
  {
    id: '3',
    name: 'Dr. Emily Brooks',
    credentials: 'DVM, DACVS',
    avatar: 'https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg',
    specialties: ['Surgery', 'Emergency Medicine'],
    rating: 5.0,
    reviewCount: 203,
    isOnline: false,
    responseTime: '< 30 min',
    consultationFee: 75
  }
];

const aiResponses: { [key: string]: string } = {
  'default': "I'm here to help with basic pet care questions! Please remember that I'm an AI assistant and my advice shouldn't replace professional veterinary care. For serious health concerns, please consult with a licensed veterinarian.",
  'eating': "Loss of appetite in pets can have various causes. Monitor for other symptoms like lethargy, vomiting, or changes in behavior. If your pet hasn't eaten for more than 24 hours (12 hours for puppies/kittens), please contact a veterinarian immediately.",
  'vomiting': "Occasional vomiting can be normal, but frequent vomiting or vomiting with blood requires immediate veterinary attention. Withhold food for 12-24 hours and provide small amounts of water. If symptoms persist or worsen, seek professional care.",
  'emergency': "This sounds like it could be an emergency! Please contact your nearest emergency veterinary clinic immediately or call the Pet Poison Helpline at (855) 764-7661. Don't wait - immediate professional care is needed.",
  'behavior': "Behavioral changes can indicate health issues or stress. Consider recent changes in environment, routine, or diet. For persistent behavioral problems, consult with a veterinarian or certified animal behaviorist.",
  'vaccination': "Vaccinations are crucial for your pet's health. Puppies and kittens need a series of vaccines starting at 6-8 weeks. Adult pets typically need annual boosters. Consult your veterinarian for a personalized vaccination schedule."
};

const VetChatPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ai' | 'vet'>('ai');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedVet, setSelectedVet] = useState<VetProfile | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');

    if (activeTab === 'ai') {
      setIsTyping(true);
      
      setTimeout(() => {
        const response = getAIResponse(inputMessage);
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: response,
          timestamp: new Date(),
          sender: {
            name: 'AI Vet Assistant',
            avatar: '🤖'
          }
        };
        setMessages(prev => [...prev, aiMessage]);
        setIsTyping(false);
      }, 1500);
    }
  };

  const getAIResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('emergency') || lowerMessage.includes('urgent') || 
        lowerMessage.includes('blood') || lowerMessage.includes('poison')) {
      return aiResponses.emergency;
    } else if (lowerMessage.includes('eat') || lowerMessage.includes('appetite') || 
               lowerMessage.includes('food')) {
      return aiResponses.eating;
    } else if (lowerMessage.includes('vomit') || lowerMessage.includes('throw up') || 
               lowerMessage.includes('sick')) {
      return aiResponses.vomiting;
    } else if (lowerMessage.includes('behavior') || lowerMessage.includes('aggressive') || 
               lowerMessage.includes('anxious')) {
      return aiResponses.behavior;
    } else if (lowerMessage.includes('vaccine') || lowerMessage.includes('shot') || 
               lowerMessage.includes('immunization')) {
      return aiResponses.vaccination;
    } else {
      return aiResponses.default;
    }
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleVetSelection = (vet: VetProfile) => {
    setSelectedVet(vet);
    if (vet.consultationFee > 0) {
      setShowPayment(true);
    }
  };

  const startConsultation = () => {
    setShowPayment(false);
    setActiveTab('vet');
    
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      type: 'vet',
      content: `Hello! I'm ${selectedVet?.name}. I'm here to help with your pet's health concerns. Please describe what's happening with your pet and I'll do my best to assist you.`,
      timestamp: new Date(),
      sender: {
        name: selectedVet?.name || '',
        avatar: selectedVet?.avatar || '',
        credentials: selectedVet?.credentials
      }
    };
    
    setMessages([welcomeMessage]);
  };

  const PaymentModal: React.FC = () => {
    if (!showPayment || !selectedVet) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-kawaii shadow-kawaii max-w-md w-full p-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Consultation Payment</h3>
          
          <div className="flex items-center gap-4 mb-6 p-4 bg-kawaii-blue/20 rounded-kawaii">
            <img 
              src={selectedVet.avatar} 
              alt={selectedVet.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h4 className="font-bold text-gray-800">{selectedVet.name}</h4>
              <p className="text-sm text-gray-600">{selectedVet.credentials}</p>
              <div className="flex items-center gap-1 mt-1">
                <Star size={14} className="text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-semibold">{selectedVet.rating}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600">Consultation Fee:</span>
              <span className="font-bold">${selectedVet.consultationFee}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Platform Fee:</span>
              <span className="font-bold">$5</span>
            </div>
            <div className="border-t pt-2 flex justify-between">
              <span className="font-bold text-gray-800">Total:</span>
              <span className="font-bold text-lg">${selectedVet.consultationFee + 5}</span>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <input
              type="text"
              placeholder="Card Number"
              className="kawaii-input w-full"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="MM/YY"
                className="kawaii-input"
              />
              <input
                type="text"
                placeholder="CVC"
                className="kawaii-input"
              />
            </div>
            <input
              type="text"
              placeholder="Cardholder Name"
              className="kawaii-input w-full"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowPayment(false)}
              className="flex-1 py-3 px-4 border border-gray-300 rounded-kawaii text-gray-700 font-bold hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={startConsultation}
              className="flex-1 py-3 px-4 bg-kawaii-green hover:bg-kawaii-green-dark text-gray-700 font-bold rounded-kawaii transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <CreditCard size={18} />
              Pay & Start
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="floating-heart absolute top-20 left-10 w-6 h-6 text-kawaii-blue-dark opacity-30">
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </div>
        <div className="floating-heart absolute top-40 right-20 w-8 h-8 text-kawaii-blue-dark opacity-25" style={{ animationDelay: '1s' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </div>
      </div>

      <div className="relative z-10 pt-24 pb-16">
        {/* Header */}
        <div className="max-w-4xl mx-auto px-4 text-center mb-12">
          <div className="mb-8">
            <div className="inline-block bouncing-paw">
              <MessageCircle size={64} className="text-kawaii-blue-dark" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gradient">
            💬 Veterinary Chat
          </h1>
          <p className="text-xl text-gray-700 font-quicksand max-w-2xl mx-auto">
            Get instant help from our AI assistant or connect with licensed veterinarians
          </p>
        </div>

        <div className="max-w-4xl mx-auto px-4">
          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-kawaii shadow-kawaii border-2 border-kawaii-blue/30 p-2 flex">
              <button
                onClick={() => setActiveTab('ai')}
                className={`flex items-center gap-2 px-6 py-3 rounded-kawaii font-bold transition-all duration-300 ${
                  activeTab === 'ai'
                    ? 'bg-kawaii-blue text-gray-700 shadow-md'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Bot size={20} />
                AI Assistant
              </button>
              <button
                onClick={() => setActiveTab('vet')}
                className={`flex items-center gap-2 px-6 py-3 rounded-kawaii font-bold transition-all duration-300 ${
                  activeTab === 'vet'
                    ? 'bg-kawaii-green text-gray-700 shadow-md'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Stethoscope size={20} />
                Real Veterinarians
              </button>
            </div>
          </div>

          {/* Main Chat Container */}
          <div className="bg-white/90 backdrop-blur-sm rounded-kawaii shadow-kawaii border-2 border-kawaii-blue/30 overflow-hidden">
            
            {/* Chat Header */}
            <div className="p-6 border-b border-gray-200 bg-kawaii-blue/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {activeTab === 'ai' ? (
                    <>
                      <div className="w-12 h-12 bg-kawaii-blue-dark rounded-full flex items-center justify-center">
                        <Bot size={24} className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">AI Vet Assistant</h3>
                        <p className="text-gray-600 font-quicksand">Always available • Instant responses</p>
                      </div>
                    </>
                  ) : selectedVet ? (
                    <>
                      <img 
                        src={selectedVet.avatar} 
                        alt={selectedVet.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{selectedVet.name}</h3>
                        <p className="text-gray-600 font-quicksand">{selectedVet.credentials}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-12 h-12 bg-kawaii-green-dark rounded-full flex items-center justify-center">
                        <Stethoscope size={24} className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">Professional Veterinarians</h3>
                        <p className="text-gray-600 font-quicksand">Choose a vet to start consultation</p>
                      </div>
                    </>
                  )}
                </div>
                
                {selectedVet && (
                  <div className="flex gap-3">
                    <button className="p-3 bg-kawaii-green hover:bg-kawaii-green-dark rounded-kawaii transition-colors duration-200">
                      <Video size={20} className="text-gray-700" />
                    </button>
                    <button className="p-3 bg-kawaii-blue hover:bg-kawaii-blue-dark rounded-kawaii transition-colors duration-200">
                      <Phone size={20} className="text-gray-700" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Vet Selection (only shown when vet tab is active and no vet selected) */}
            {activeTab === 'vet' && !selectedVet && (
              <div className="p-6 border-b border-gray-200">
                <h4 className="text-lg font-bold text-gray-800 mb-4">Available Veterinarians</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {mockVets.map((vet) => (
                    <div key={vet.id} className="border border-gray-200 rounded-kawaii p-4 hover:bg-gray-50 transition-colors duration-200">
                      <div className="flex items-center gap-3 mb-3">
                        <img 
                          src={vet.avatar} 
                          alt={vet.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h5 className="font-bold text-gray-800">{vet.name}</h5>
                            {vet.isOnline && (
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{vet.credentials}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 mb-2">
                        <Star size={14} className="text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-semibold">{vet.rating}</span>
                        <span className="text-xs text-gray-500">({vet.reviewCount})</span>
                      </div>
                      
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-1">
                          <Clock size={14} className="text-gray-500" />
                          <span className="text-sm text-gray-600">{vet.responseTime}</span>
                        </div>
                        <span className="text-sm font-bold text-green-600">${vet.consultationFee}</span>
                      </div>
                      
                      <button
                        onClick={() => handleVetSelection(vet)}
                        className="w-full py-2 px-4 bg-kawaii-green hover:bg-kawaii-green-dark text-gray-700 font-bold rounded-kawaii transition-colors duration-200"
                      >
                        Start Chat
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Messages Area */}
            <div className="h-96 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">
                    {activeTab === 'ai' ? '🤖' : '🩺'}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-700 mb-3">
                    {activeTab === 'ai' ? 'AI Vet Assistant Ready' : 'Ready for Consultation'}
                  </h3>
                  <p className="text-gray-600 font-quicksand text-lg max-w-md mx-auto">
                    {activeTab === 'ai' 
                      ? 'Ask me any pet care questions and I\'ll help you right away!'
                      : selectedVet 
                        ? 'Your veterinarian is ready to help with your pet\'s health concerns.'
                        : 'Select a veterinarian above to begin your consultation.'
                    }
                  </p>
                  
                  {activeTab === 'ai' && (
                    <div className="mt-6">
                      <p className="text-sm text-gray-500 mb-4">Try asking about:</p>
                      <div className="flex flex-wrap justify-center gap-2">
                        {['Pet not eating', 'Vomiting', 'Behavior changes', 'Vaccination schedule'].map((topic) => (
                          <button
                            key={topic}
                            onClick={() => setInputMessage(`My pet is ${topic.toLowerCase()}`)}
                            className="px-4 py-2 bg-kawaii-blue/30 hover:bg-kawaii-blue/50 rounded-kawaii text-sm font-quicksand transition-colors duration-200"
                          >
                            {topic}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                messages.map((message) => (
                  <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-kawaii p-4 ${
                      message.type === 'user' 
                        ? 'bg-kawaii-blue text-gray-700' 
                        : message.type === 'ai'
                        ? 'bg-gray-100 text-gray-700'
                        : 'bg-kawaii-green text-gray-700'
                    }`}>
                      {message.sender && message.type !== 'user' && (
                        <div className="flex items-center gap-2 mb-2">
                          {typeof message.sender.avatar === 'string' && message.sender.avatar.startsWith('http') ? (
                            <img 
                              src={message.sender.avatar} 
                              alt={message.sender.name}
                              className="w-6 h-6 rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-lg">{message.sender.avatar}</span>
                          )}
                          <span className="text-sm font-bold">{message.sender.name}</span>
                          {message.sender.credentials && (
                            <span className="text-xs text-gray-500">{message.sender.credentials}</span>
                          )}
                        </div>
                      )}
                      <p className="font-quicksand leading-relaxed">{message.content}</p>
                      <div className="text-xs text-gray-500 mt-2">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))
              )}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-kawaii p-4 max-w-[80%]">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <span className="text-sm text-gray-600 ml-2">AI is typing...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-6 border-t border-gray-200 bg-gray-50/50">
              {(activeTab === 'ai' || selectedVet) && (
                <>
                  {/* Emergency Notice for AI */}
                  {activeTab === 'ai' && (
                    <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-kawaii">
                      <div className="flex items-center gap-2">
                        <AlertTriangle size={16} className="text-yellow-600" />
                        <span className="text-sm text-yellow-800 font-quicksand">
                          <strong>Important:</strong> This AI provides general guidance only. For emergencies, contact your vet immediately.
                        </span>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-3">
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*,.pdf,.doc,.docx"
                      multiple
                    />
                    
                    <button
                      onClick={handleFileUpload}
                      className="p-3 bg-white hover:bg-gray-50 border border-gray-200 rounded-kawaii transition-colors duration-200"
                      title="Upload photo or document"
                    >
                      <Upload size={20} className="text-gray-600" />
                    </button>
                    
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder={activeTab === 'ai' ? 'Ask about your pet\'s health...' : 'Describe your pet\'s symptoms...'}
                      className="flex-1 kawaii-input"
                    />
                    
                    <button
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim()}
                      className="p-3 bg-kawaii-blue hover:bg-kawaii-blue-dark disabled:opacity-50 disabled:cursor-not-allowed rounded-kawaii transition-colors duration-200"
                    >
                      <Send size={20} className="text-gray-700" />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Emergency Contact Section */}
          <div className="mt-8 bg-red-50 border-2 border-red-200 rounded-kawaii p-6">
            <h3 className="text-xl font-bold text-red-800 mb-4 flex items-center gap-2">
              <AlertTriangle size={20} className="text-red-600" />
              Emergency? Need Immediate Help?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-4 bg-white rounded-kawaii">
                <div>
                  <h4 className="font-bold text-gray-800">24/7 Emergency Pet Hospital</h4>
                  <p className="text-sm text-gray-600">1.2 miles away • Always open</p>
                </div>
                <div className="flex gap-2">
                  <button className="w-10 h-10 bg-red-100 hover:bg-red-200 rounded-kawaii transition-colors duration-200 flex items-center justify-center">
                    <Phone size={16} className="text-red-600" />
                  </button>
                  <button className="w-10 h-10 bg-blue-100 hover:bg-blue-200 rounded-kawaii transition-colors duration-200 flex items-center justify-center">
                    <MapPin size={16} className="text-blue-600" />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-white rounded-kawaii">
                <div>
                  <h4 className="font-bold text-gray-800">Pet Poison Helpline</h4>
                  <p className="text-sm text-gray-600">(855) 764-7661 • 24/7 Support</p>
                </div>
                <button className="w-10 h-10 bg-red-100 hover:bg-red-200 rounded-kawaii transition-colors duration-200 flex items-center justify-center">
                  <Phone size={16} className="text-red-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PaymentModal />
    </div>
  );
};

export default VetChatPage;