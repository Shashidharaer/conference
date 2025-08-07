
export default function About() {
  return (
    <div className="min-h-screen w-full">
      {/* Hero Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-credentia-100 text-credentia-700 text-base font-medium mb-6">
              <span className="w-2 h-2 bg-credentia-500 rounded-full mr-2"></span>
              Inaugural Event
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              About the
              <span className="text-credentia-500 block">Conference</span>
            </h1>

          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="bg-[rgba(234,236,240,var(--tw-bg-opacity))] h-ful py-8 lg:py-12 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 ">
            {/* Conference Overview */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-8 lg:p-12 shadow-sm border border-slate-200">
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 bg-credentia-100 rounded-xl flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-credentia-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900">Conference Overview</h2>
                </div>
                <div className="space-y-6 text-slate-600 leading-relaxed">
                  <p className="text-lg">
                    The NNAAP & MACE Conference 2025 brings together healthcare professionals, educators, and industry leaders
                    to explore the latest advancements in nurse aide competency evaluation and testing excellence.
                  </p>
                  <p className="text-lg">
                    This inaugural event will feature expert speakers, hands-on workshops, and networking opportunities
                    designed to enhance your understanding of credentialing processes and workforce development.
                  </p>
                </div>
              </div>
            </div>

            {/* Key Highlights */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 bg-credentia-100 rounded-xl flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-credentia-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">Key Highlights</h2>
                </div>
                <ul className="space-y-4">
                  {[
                    'Comprehensive testing solutions and best practices',
                    'Expert insights from industry leaders',
                    'Hands-on workshops and demonstrations',
                    'Networking with healthcare professionals'
                  ].map((highlight, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-6 h-6 bg-credentia-100 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                        <svg className="w-3 h-3 text-credentia-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-slate-700 font-medium text-base">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>


        </div>
      </div>
    </div>
  )
}
