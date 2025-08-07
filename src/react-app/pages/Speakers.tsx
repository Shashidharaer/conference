

export default function Speakers() {
  const speakers = [
    {
      name: "Henry Sorenson",
      title: "President",
      company: "Prov, Inc.",
      bio: "Leading expert in psychometric testing and assessment development.",
      expertise: ["Psychometric Testing", "Assessment Development", "Industry Leadership"]
    },
    {
      name: "Brian Syzdek",
      title: "Senior Psychometrician | Psychologist",
      company: "Prov, Inc.",
      bio: "Specialized in test validation and statistical analysis for healthcare assessments.",
      expertise: ["Test Validation", "Statistical Analysis", "Healthcare Assessments"]
    },
    {
      name: "David Cox",
      title: "President",
      company: "Professional Testing, Inc. (PTI)",
      bio: "Pioneer in computerized testing solutions and adaptive assessments.",
      expertise: ["Computerized Testing", "Adaptive Assessments", "Technology Innovation"]
    },
    {
      name: "Reed Castle",
      title: "Executive Vice President",
      company: "Professional Testing, Inc. (PTI)",
      bio: "Expert in test delivery platforms and security protocols.",
      expertise: ["Test Delivery", "Security Protocols", "Platform Development"]
    },
    {
      name: "Vicky Castillo",
      title: "Founder and CEO",
      company: "FACETS Healthcare",
      bio: "Healthcare consultant specializing in workforce development and training programs.",
      expertise: ["Workforce Development", "Training Programs", "Healthcare Consulting"]
    }
  ]

    return (
    <div className="min-h-screen w-full ">
      {/* Hero Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-credentia-100 text-credentia-700 text-base font-medium mb-6">
              <span className="w-2 h-2 bg-credentia-500 rounded-full mr-2"></span>
              Expert Panel
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Featured
              <span className="text-credentia-500 block">Speakers</span>
            </h1>

          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="bg-[rgba(234,236,240,var(--tw-bg-opacity))] py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Speakers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {speakers.map((speaker, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300 group">
                <div className="text-center mb-6">

                  <h3 className="font-bold text-slate-900 text-xl mb-2">{speaker.name}</h3>
                  <p className="text-credentia-500 text-base font-medium mb-1">{speaker.title}</p>
                  <p className="text-slate-500 text-base mb-4">{speaker.company}</p>
                </div>

                <p className="text-slate-600 text-center text-base leading-relaxed">{speaker.bio}</p>


              </div>
            ))}
          </div>


        </div>
      </div>
    </div>
  )
}
