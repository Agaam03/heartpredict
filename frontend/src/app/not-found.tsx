"use client";
import dynamic from "next/dynamic";
import React from "react";

const AuthErrorPage = () => {
  const floatingElements = [];
  for (let i = 0; i < 8; i++) {
    floatingElements.push({
      id: i,
      size: Math.random() * 60 + 40,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 4,
      duration: 4 + Math.random() * 3,
    });
  }

  const handleTryAgain = () => {
    window.location.href = "/login";
  };

  const handleGoHome = () => {
    window.location.href = "/";
  };

  const handleContactSupport = () => {
    // You can customize this to your support contact method
    window.location.href = "/";
  };

  return (
    <>
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translate(-50%, -50%) translateY(0px) rotate(0deg);
          }
          33% {
            transform: translate(-50%, -50%) translateY(-20px) rotate(120deg);
          }
          66% {
            transform: translate(-50%, -50%) translateY(10px) rotate(240deg);
          }
        }

        @keyframes glow {
          0%,
          100% {
            text-shadow: 0 0 20px rgba(255, 20, 147, 0.6),
              0 0 40px rgba(255, 20, 147, 0.4), 0 0 60px rgba(255, 20, 147, 0.2);
          }
          50% {
            text-shadow: 0 0 30px rgba(255, 20, 147, 0.8),
              0 0 60px rgba(255, 20, 147, 0.6), 0 0 90px rgba(255, 20, 147, 0.4);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes backgroundPulse {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.6;
          }
        }

        .error-number {
          animation: glow 3s ease-in-out infinite;
        }

        .slide-up-1 {
          animation: slideUp 0.8s ease-out 0.2s both;
        }

        .slide-up-2 {
          animation: slideUp 0.8s ease-out 0.4s both;
        }

        .slide-up-3 {
          animation: slideUp 0.8s ease-out 0.6s both;
        }

        .slide-up-4 {
          animation: slideUp 0.8s ease-out 0.8s both;
        }

        .floating-bg {
          animation: backgroundPulse 6s ease-in-out infinite;
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden flex items-center justify-center">
        {/* Enhanced Dark Background with Floating Elements */}
        <div className="absolute inset-0 floating-bg">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-900/10 via-transparent to-purple-900/10"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-pink-900/5 to-transparent"></div>
        </div>

        {/* Floating Decorative Elements */}
        {floatingElements.map((element) => (
          <div
            key={element.id}
            className="absolute rounded-full bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20"
            style={{
              width: `${element.size}px`,
              height: `${element.size}px`,
              left: `${element.left}%`,
              top: `${element.top}%`,
              animation: `float ${element.duration}s ease-in-out infinite ${element.delay}s`,
              transform: "translate(-50%, -50%)",
            }}
          />
        ))}

        {/* Main Content */}
        <div className="relative z-10 text-center max-w-2xl mx-auto px-6">
          {/* Error Code */}
          <h1 className="text-9xl md:text-[12rem] font-black mb-4 error-number">
            <span className="bg-gradient-to-r from-pink-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
              401
            </span>
          </h1>

          {/* Error Title */}
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 slide-up-1">
            Access Denied
          </h2>

          {/* Error Message */}
          <p className="text-lg md:text-xl text-gray-300 mb-4 leading-relaxed slide-up-2">
            Authentication failed. Your session may have expired or your
            credentials are invalid.
          </p>

          <p className="text-base md:text-lg text-gray-400 mb-12 slide-up-2">
            Please verify your login credentials and try again, or contact
            support if the problem persists.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center slide-up-3">
            <button
              onClick={handleTryAgain}
              className="group relative px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-full hover:from-pink-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-pink-500/25 min-w-[200px]"
            >
              <span className="relative z-10">Try Again</span>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </button>

            <button
              onClick={handleGoHome}
              className="group px-8 py-4 border-2 border-pink-500 text-pink-400 font-semibold rounded-full hover:bg-pink-500 hover:text-white transform hover:scale-105 transition-all duration-300 min-w-[200px]"
            >
              Go to Homepage
            </button>
          </div>

          {/* Support Link */}
          <div className="mt-8 slide-up-4">
            <button
              onClick={handleContactSupport}
              className="text-gray-400 hover:text-pink-400 transition-colors duration-300 underline decoration-dotted underline-offset-4"
            >
              Need help? Contact Support
            </button>
          </div>

          {/* Additional Info */}
          <div className="mt-12 p-6 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl slide-up-4">
            <h3 className="text-lg font-semibold text-white mb-3">
              Common Solutions:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Clear your browser cache and cookies</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Check your internet connection</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Verify your login credentials</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Try using a different browser</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Gradient Overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 to-transparent pointer-events-none"></div>
      </div>
    </>
  );
};

export default dynamic(() => Promise.resolve(AuthErrorPage), { ssr: false });
