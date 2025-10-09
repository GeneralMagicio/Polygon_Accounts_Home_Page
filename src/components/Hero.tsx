import React from 'react';

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-white to-purple-50">
      {/* Geometric background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 border-2 border-purple-500 rotate-45"></div>
        <div className="absolute top-40 right-32 w-24 h-24 border-2 border-purple-400 rotate-12"></div>
        <div className="absolute bottom-32 left-1/3 w-20 h-20 border-2 border-purple-300 -rotate-12"></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 border-2 border-purple-500 rotate-45"></div>
      </div>

      <div className="container mx-auto px-4 py-20 lg:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <img 
              src="/polygon logo.webp" 
              alt="Polygon Logo" 
              className="w-20 h-20 rounded-full mx-auto mb-6 shadow-lg"
            />
          </div>

          <h1 className="text-3xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Create your{' '}
            <span className="bg-gradient-to-r from-purple-600 to-purple-500 bg-clip-text text-transparent">
              Polygon Account
            </span>{' '}
            in 20 seconds
          </h1>
          
<p className="text-xl lg:text-2xl text-gray-600 mb-6 max-w-3xl mx-auto leading-relaxed">
  Safe, fast & free. <br />
  Create your Polygon Account to start using Web3 and DeFi today.
</p>

<div className="flex flex-col items-center gap-3 mb-8">
  <a
    href="https://app.polygon.ac"
    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-semibold rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
  >
    Start now
  </a>

  <p className="text-xl lg:text-2xl text-purple-600 leading-relaxed text-center m-0">
    Enter the PolyPrize Raffle to win $100 <br />
    → by <strong>Midnight Oct 13, 2025</strong> ←
  </p>
</div>




          {/* Visual representation of the app */}
          <div className="relative max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-100">
              <div className="flex items-center justify-center mb-4">
                <img 
                  src="/polygon logo.webp" 
                  alt="Polygon Logo" 
                  className="w-12 h-12 rounded-full"
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Polygon Accounts</h3>
              <p className="text-sm text-gray-500 mb-4">The easiest way to onboard to Polygon</p>
              <div className="bg-purple-50 rounded-lg p-3 text-center">
                <span className="text-purple-600 font-mono text-sm">yourname.polygon.ac</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;