"use client";
import { newAccountVerification } from "@/actions/new-account-verification";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import React, { useState, useEffect, useCallback } from "react";

const VerificationTokenPage = () => {
  const [timeLeft, setTimeLeft] = useState(300);
  const [isExpired, setIsExpired] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const onSubmit = useCallback(() => {
    if (success || error) return;
    if (!token) {
      setError("Missing token!");
      return;
    }
    newAccountVerification(token)
      .then((data) => {
        setError(data.error);
        setSuccess(data.success);
        console.log(token);
      })
      .catch(() => {
        setError("Something went wrong!");
      });
  }, [token, success]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  // Generate floating elements once and store in state
  const [floatingElements] = useState(() => {
    const elements = [];
    for (let i = 0; i < 6; i++) {
      elements.push({
        id: i,
        size: Math.random() * 50 + 30,
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 3,
        duration: 3 + Math.random() * 2,
      });
    }
    return elements;
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          setIsExpired(true);
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleResendToken = async () => {
    setIsResending(true);
    // Simulate API call
    setTimeout(() => {
      setIsResending(false);
      setTimeLeft(300);
      setIsExpired(false);
    }, 2000);
  };

  const handleGoToLogin = () => {
    window.location.href = "/login";
  };

  const handleContactSupport = () => {
    window.location.href = "/support";
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-950 relative overflow-hidden flex items-center justify-center">
        {/* Enhanced Darker Background */}
        <div className="absolute inset-0 floating-bg">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950/90 via-black/95 to-gray-950/90"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-gray-950/80 to-black/60"></div>
        </div>

        {/* Floating Decorative Elements */}
        {floatingElements.map((element) => (
          <div
            key={element.id}
            className="absolute rounded-full bg-gradient-to-r from-pink-500/4 to-purple-500/4 border border-pink-500/8"
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
        <div className="relative z-10 text-center max-w-lg mx-auto px-6">
          {/* Verification Icon */}
          <div className="mb-8 slide-up-1">
            <div className="verification-icon w-24 h-24 mx-auto bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 slide-up-1">
            Check Your Email
          </h1>

          {/* Main Message */}
          <p className="text-lg text-gray-300 mb-6 leading-relaxed slide-up-2">
            We've sent a verification token to your email address. Please check
            your inbox and enter the token to continue.
          </p>

          {/* Error/Success Display Form */}
          {(error || success) && (
            <div className="mb-6 slide-up-2">
              <div
                className={`p-4 rounded-2xl border ${
                  error
                    ? "bg-red-900/20 border-red-500/30 backdrop-blur-sm"
                    : "bg-green-900/20 border-green-500/30 backdrop-blur-sm"
                }`}
              >
                <div className="flex items-center gap-3">
                  {error ? (
                    <svg
                      className="w-6 h-6 text-red-400 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-6 h-6 text-green-400 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  )}
                  <div className="text-left">
                    <h3
                      className={`font-semibold text-sm ${error ? "text-red-300" : "text-green-300"}`}
                    >
                      {error ? "Verification Error" : "Success"}
                    </h3>
                    <p
                      className={`text-sm mt-1 ${error ? "text-red-200" : "text-green-200"}`}
                    >
                      {error || success}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Additional Info */}
          <div className="mt-8 slide-up-4">
            <div className="text-sm text-gray-400 mb-4">
              Didn't receive the email? Check your spam folder or
              <button
                onClick={handleContactSupport}
                className="text-pink-400 hover:text-pink-300 transition-colors duration-300 underline decoration-dotted underline-offset-4 ml-1"
              >
                contact support
              </button>
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-8 p-6 bg-gray-950/60 backdrop-blur-sm border border-gray-800/40 rounded-2xl slide-up-4">
            <h3 className="text-lg font-semibold text-white mb-3">
              What's Next?
            </h3>
            <div className="space-y-3 text-sm text-gray-300 text-left">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-pink-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  1
                </div>
                <span>Check your email inbox for the verification token</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-pink-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  2
                </div>
                <span>Copy the 6-digit token from the email</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-pink-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  3
                </div>
                <span>The verification will complete automatically</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Gradient Overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/90 to-transparent pointer-events-none"></div>
      </div>
    </>
  );
};

export default dynamic(() => Promise.resolve(VerificationTokenPage), {
  ssr: false,
});
