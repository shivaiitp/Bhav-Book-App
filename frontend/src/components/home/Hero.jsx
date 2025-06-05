// src/components/Hero.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(0);
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  const inspirationalQuotes = [
    "Write the truth, even if your hand trembles.",
    "Write freely — we'll help you understand what your heart is really saying.",
    "Every word written is a step toward clarity.",
    "Your journal speaks. Our insights help you listen.",
    "Reflect. Release. Renew.",
    "Today's journal entry is tomorrow's reflection.",
    "Let your emotions breathe through your pen.",
    "Even messy thoughts deserve the page.",
    "Jot it down. We'll help you make sense of it.",
    "One sentence today can heal a thousand tomorrows.",
    "Your journal is a mirror—look closely.",
    "Your reflections deserve understanding — that's where we come in.",
    "Your story matters. Write it.",
    "You write the thoughts, we reflect the feelings.",
    "Your words hold patterns. We help you uncover them.",
    "Behind every entry lies a story—we help bring it to light.",
    "In the quiet of journaling, you meet yourself.",
    "Let the ink reveal what the heart hides.",
    "Your words are seeds. Plant them with purpose.",
    "We read between the lines so you can see within.",
    "Capture moments. Create memories.",
    "In stillness, your thoughts find a voice.",
    "Pen what you can't say out loud.",
    "A journal doesn't judge, it listens.",
    "The blank page is a canvas for your thoughts.",
    "Let your mind speak; we'll translate the emotion behind it.",
    "Write to understand, not to impress.",
    "Thoughts unspoken often carry the most meaning — we help you find it.",
    "Each page is progress, not perfection."
  ];

  useEffect(() => {
    setIsVisible(true);
    
    const getRandomQuote = () => {
      let newIndex;
      do {
        newIndex = Math.floor(Math.random() * inspirationalQuotes.length);
      } while (newIndex === currentQuote && inspirationalQuotes.length > 1);
      
      setCurrentQuote(newIndex);
    };
    
    const quoteInterval = setInterval(getRandomQuote, 5000);
    
    return () => clearInterval(quoteInterval);
  }, [currentQuote, inspirationalQuotes.length]);

  const handleStartWriting = () => {
    if (!isAuthenticated) {
      // Redirect to login with return URL to journal page
      navigate('/auth/login', { 
        state: { from: { pathname: '/journal' } } 
      });
    } else {
      // User is authenticated, go to journal
      navigate('/journal');
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden">
      {/* Local bubble decorations that only appear in the Hero section */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute rounded-full bg-sky-200 dark:bg-sky-900 opacity-30 w-64 h-64 -top-10 -left-10"></div>
        <div className="absolute rounded-full bg-sky-200 dark:bg-sky-900 opacity-30 w-96 h-96 top-1/4 right-0 transform translate-x-1/3"></div>
        <div className="absolute rounded-full bg-sky-300 dark:bg-sky-900 opacity-20 w-80 h-80 bottom-0 left-1/4"></div>
        <div className="absolute rounded-full bg-sky-200 dark:bg-sky-900 opacity-20 w-72 h-72 bottom-10 right-10"></div>
        <div className="absolute rounded-full bg-sky-300 dark:bg-sky-900 opacity-25 w-48 h-48 top-1/2 left-1/3 transform -translate-x-1/2"></div>
      </div>
      
      <div 
        className={`relative z-10 max-w-4xl mx-auto px-4 py-16 text-center transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0 translate-y-10'}`}
      >
        <div className="mt-5">
          <span className="inline-block px-4 py-1 bg-sky-200/80 dark:bg-sky-800/50 text-sky-800 dark:text-sky-200 rounded-full text-sm font-medium mb-6 shadow-sm backdrop-blur-sm">
            Your Personal Journey
          </span>
        </div>
        
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-sky-950 dark:text-sky-300 mb-6 leading-tight tracking-tight">
          <span className="inline-block relative">
            <span className="relative z-10">Capture</span>
            <span className="absolute bottom-0 left-0 w-full h-3 bg-sky-300 dark:bg-sky-700 -z-10 transform -rotate-1"></span>
          </span>{" "}
          Your Thoughts, 
          <span className="block text-sky-700 dark:text-sky-400">Every Day.</span>
        </h1>
        
        <div className="h-16 flex items-center justify-center mb-6">
          <p 
            className="text-xl md:text-2xl text-sky-800 dark:text-sky-300 italic transition-opacity duration-1000"
          >
            "{inspirationalQuotes[currentQuote]}"
          </p>
        </div>
        
        <p className="text-lg md:text-xl text-sky-800 dark:text-sky-300 mb-10 leading-relaxed max-w-3xl mx-auto dark:contrast-100 contrast-200">
          Embark on a journey of self-discovery through the simple yet powerful practice of daily journaling. Your thoughts deserve to be captured, explored, and treasured — and with intelligent insights and personalized suggestions, we help you understand the emotions and patterns behind your words.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          <button
            onClick={handleStartWriting}
            className="
              bg-sky-700 hover:bg-sky-800 dark:bg-sky-500 dark:hover:bg-sky-600
              text-white font-semibold rounded-lg px-8 py-4 
              shadow-lg hover:shadow-xl
              transform hover:-translate-y-1
              transition-all duration-300
              focus:outline-none focus:ring-4 focus:ring-sky-300 dark:focus:ring-sky-700
              inline-flex items-center justify-center
              w-full sm:w-auto
            "
            aria-label="Write Journal Today"
          >
            <span>Start Writing Now</span>
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </button>
          
          <a
            href="/about"
            className="
              border-2 border-sky-500 hover:border-sky-600 dark:border-sky-700 dark:hover:border-sky-600
              text-sky-800 hover:text-sky-900 dark:text-sky-400 dark:hover:text-sky-300
              font-medium rounded-lg px-8 py-4
              transform hover:-translate-y-1
              transition-all duration-300
              focus:outline-none focus:ring-4 focus:ring-sky-200 dark:focus:ring-sky-800
              inline-flex items-center justify-center
              w-full sm:w-auto
            "
          >
            Learn More
          </a>
        </div>
        
        <div className="mt-12 flex justify-center items-center space-x-8">
          <div className="flex items-center">
            <div className="flex -space-x-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-sky-300 dark:bg-sky-700 flex items-center justify-center text-xs text-sky-800 dark:text-sky-200 border-2 border-white dark:border-slate-900 shadow-sm">
                  {['J', 'S', 'M'][i]}
                </div>
              ))}
            </div>
            <span className="ml-3 text-sm text-sky-800 dark:text-sky-400 font-medium">Join 2,000+ writers</span>
          </div>
          
          <div className="flex items-center">
            <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
            <span className="ml-1 text-sm text-sky-800 dark:text-sky-400 font-medium">4.9 Average Rating</span>
          </div>
        </div>
      </div>
    </section>
  );
}
