import { useState } from 'react'
import Home from './pages/Home'
import About from './pages/About'
import Speakers from './pages/Speakers'

import Agenda from './pages/Agenda'
import RegistrationModal from './components/RegistrationModal'

export default function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home
          setIsRegistrationModalOpen={setIsRegistrationModalOpen}
        />
      case 'about':
        return <About />
      case 'speakers':
        return <Speakers />
      case 'agenda':
        return <Agenda />

      default:
        return <Home
          setIsRegistrationModalOpen={setIsRegistrationModalOpen}
        />
    }
  }

  return (
    <div className="min-h-screen w-full bg-white flex flex-col">
      {/* Header with Navigation */}
      <header className="bg-white py-4 sticky top-0 z-20" style={{ boxShadow: '0px 12px 22px 0px rgba(24, 50, 84, 0.05)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex-shrink-0">
              <a href="/">
                <img
                  height="55"
                  className="min-h-[45px] max-h-[65px] max-w-[240px] lg:max-w-none"
                  src="https://credentia.com/storage/logos/credentia-updated-logo.svg"
                  alt="Credentia Logo"
                />
              </a>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
            <button
              onClick={() => setCurrentPage('home')}
              className={`text-base font-medium transition-colors relative ${
                currentPage === 'home'
                  ? 'text-credentia-600'
                  : 'text-slate-700 hover:text-credentia-600'
              }`}
            >
              Home
              {currentPage === 'home' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-credentia-600"></div>
              )}
            </button>
            <button
              onClick={() => setCurrentPage('about')}
              className={`text-base font-medium transition-colors relative ${
                currentPage === 'about'
                  ? 'text-credentia-600'
                  : 'text-slate-700 hover:text-credentia-600'
              }`}
            >
              About
              {currentPage === 'about' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-credentia-600"></div>
              )}
            </button>
            <button
              onClick={() => setCurrentPage('speakers')}
              className={`text-base font-medium transition-colors relative ${
                currentPage === 'speakers'
                  ? 'text-credentia-600'
                  : 'text-slate-700 hover:text-credentia-600'
              }`}
            >
              Speakers
              {currentPage === 'speakers' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: 'rgba(28, 117, 188, 1)' }}></div>
              )}
            </button>
            <button
              onClick={() => setCurrentPage('agenda')}
              className={`text-base font-medium transition-colors relative ${
                currentPage === 'agenda'
                  ? 'text-slate-700'
                  : 'text-slate-700 hover:text-slate-600'
              }`}
              style={{
                color: currentPage === 'agenda' ? 'rgba(28, 117, 188, 1)' : undefined
              }}
            >
              Agenda
              {currentPage === 'agenda' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-credentia-500"></div>
              )}
            </button>

            </nav>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-slate-700 hover:text-credentia-500 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <nav className="lg:hidden border-t border-slate-200 mt-4 pt-4">
              <div className="flex flex-col space-y-4">
                <button
                  onClick={() => { setCurrentPage('home'); setIsMobileMenuOpen(false); }}
                  className={`text-left py-2 px-4 rounded-lg transition-colors ${
                    currentPage === 'home' ? 'text-credentia-500 bg-credentia-50' : 'text-slate-700 hover:text-credentia-500'
                  }`}
                >
                  Home
                </button>
                <button
                  onClick={() => { setCurrentPage('about'); setIsMobileMenuOpen(false); }}
                  className={`text-left py-2 px-4 rounded-lg transition-colors ${
                    currentPage === 'about' ? 'text-credentia-500 bg-credentia-50' : 'text-slate-700 hover:text-credentia-500'
                  }`}
                >
                  About
                </button>
                <button
                  onClick={() => { setIsRegistrationModalOpen(true); setIsMobileMenuOpen(false); }}
                  className="text-left py-2 px-4 rounded-lg transition-colors text-slate-700 hover:text-credentia-500"
                >
                  Register
                </button>
                <button
                  onClick={() => { setCurrentPage('speakers'); setIsMobileMenuOpen(false); }}
                  className={`text-left py-2 px-4 rounded-lg transition-colors ${
                    currentPage === 'speakers' ? 'text-credentia-500 bg-credentia-50' : 'text-slate-700 hover:text-credentia-500'
                  }`}
                >
                  Speakers
                </button>
                <button
                  onClick={() => { setCurrentPage('agenda'); setIsMobileMenuOpen(false); }}
                  className={`text-left py-2 px-4 rounded-lg transition-colors ${
                    currentPage === 'agenda' ? 'text-credentia-500 bg-credentia-50' : 'text-slate-700 hover:text-credentia-500'
                  }`}
                >
                  Agenda
                </button>

              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Page Content */}
      <main className="flex-1 w-full flex justify-center">
        {renderPage()}
      </main>

      {/* Footer */}
      <footer className="bg-white text-[#486284] py-6 w-full border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-row items-center justify-between">
            <div className="flex-grow">
              <a href="/" className="flex-grow">
                <img
                  height="55"
                  className="min-h-[35px] max-h-[55px] max-w-[200px] lg:max-w-none"
                  src="https://credentia.com/storage/logos/logo_Credentia_icon.svg"
                  alt="Credentia"
                />
              </a>
            </div>

            <div className="flex-grow hidden md:block">
              <p className="text-center justify-between">
                © 2007 - 2025 All rights reserved. Credentia and the
                Credentia logo mark are trademarks of Credentia Nurse Aide LLC
              </p>
            </div>

            <nav className="flex-grow justify-end flex flex-row" aria-labelledby="social-navigation">
              <h2 className="sr-only" id="social-navigation">Social Media Profiles</h2>
              <a className="mr-[1rem]" href="https://www.linkedin.com/company/credentia-services/" target="_blank" rel="noopener noreferrer">
                <i className="rounded-md border-[1px] !flex justify-center items-center px-4 py-2 fab fa fa-fw fa-linkedin" aria-hidden="true"></i>
              </a>
              <a className="mr-[1rem]" href="https://twitter.com/getcredentia" target="_blank" rel="noopener noreferrer">
                <i className="rounded-md border-[1px] !flex justify-center items-center px-4 py-2 fab fa fa-fw fa-twitter" aria-hidden="true"></i>
              </a>
              <a className="mr-[1rem]" href="https://www.instagram.com/credentianurseaide/" target="_blank" rel="noopener noreferrer">
                <i className="rounded-md border-[1px] !flex justify-center items-center px-4 py-2 fab fa fa-fw fa-instagram" aria-hidden="true"></i>
              </a>
            </nav>
          </div>
        </div>

        <div className="hidden sm:block md:hidden max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="flex-grow block md:hidden">
            <p className="text-center">
              © 2007 - 2025 All rights reserved. Credentia and the
              Credentia logo mark are trademarks of Credentia Nurse Aide LLC
            </p>
          </div>
        </div>

        <div className="block sm:hidden max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="flex-grow block md:hidden">
            <p className="text-center">
              © 2007 - 2025 All rights reserved. Credentia and the
              Credentia logo mark are trademarks of Credentia Nurse Aide LLC
            </p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <RegistrationModal
        isOpen={isRegistrationModalOpen}
        onClose={() => setIsRegistrationModalOpen(false)}
      />
    </div>
  )
}
