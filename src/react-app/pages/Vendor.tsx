

export default function Vendor() {
  const vendorPackages = [
    {
      name: "Vendor Package",
      amount: "$800",
      limit: "Unlimited",
      features: [
        "One 6-foot exhibit table with 2 chairs",
        "2 full conference event badges",
        "Visibility among national and state stakeholders in nurse aide training and testing"
      ]
    }
  ]

  return (
    <div className="min-h-screen w-full">
      {/* Hero Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-credentia-100 text-credentia-700 text-base font-medium mb-6">
              <span className="w-2 h-2 bg-credentia-500 rounded-full mr-2"></span>
              Exhibition Opportunities
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Become a
              <span className="text-credentia-500 block">Vendor</span>
            </h1>

          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="bg-[rgba(234,236,240,var(--tw-bg-opacity))] py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto ">
            {vendorPackages.map((pkg, index) => (
              <div key={index} className="bg-white rounded-xl p-7 shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300 flex flex-col">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{pkg.name}</h3>
                  <p className="text-2xl font-bold text-credentia-500 mb-1">{pkg.amount}</p>
                  <p className="text-sm text-credentia-600 font-medium">{pkg.limit}</p>
                </div>
                <ul className="space-y-3 mb-6 flex-1">
                  {pkg.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <div className="w-5 h-5 bg-credentia-100 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                        <svg className="w-2.5 h-2.5 text-credentia-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-slate-700 text-sm leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button className="w-full px-4 py-3 bg-credentia-500 text-white rounded-lg hover:bg-credentia-600 transition-colors font-medium text-sm mt-auto">
                  Book Now
                </button>
              </div>
            ))}
          </div>



        </div>
      </div>
    </div>
  )
}
