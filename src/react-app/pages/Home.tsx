import { useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

// Add Font Awesome CSS
const addFontAwesome = () => {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
  document.head.appendChild(link);
};

interface HomeProps {
  setIsRegistrationModalOpen: (open: boolean) => void;
}

export default function Home({ setIsRegistrationModalOpen }: HomeProps) {

  useEffect(() => {
    // Load Google Fonts
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // Load Font Awesome
    addFontAwesome();
  }, []);



  return (
    <>
      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
            {/* Left Column - Content */}
            <div className="text-left">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-credentia-100 text-credentia-700 text-base font-medium mb-6">
                <span className="w-2 h-2 bg-credentia-500 rounded-full mr-2"></span>
                Timeless Innovation
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                NNAAP & MACE
                <span className="text-credentia-500 block">Conference 2025</span>
              </h1>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                Join us at the inaugural NNAAP and MACE Conference exploring the full suite of testing solutions designed to support your candidates and elevate your state's nurse aide programs.
              </p>
              <div className="flex justify-start">
                <button
                  onClick={() => setIsRegistrationModalOpen(true)}
                  className="px-6 py-3 rounded-full font-medium text-base h-12 bg-credentia-500 text-white hover:bg-credentia-500 transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow-md"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(28, 117, 188, 1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(28, 117, 188, 1)';
                  }}
                >
                  Register Now
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </div>

            {/* Right Column - Video */}
            <div className="hidden lg:block scale-110">
              <video
                src="/pattern.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-auto"
              >
              </video>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
