import React from "react";
import {
  HeartPulse,
  Activity,
  Brain,
  Stethoscope,
  ChevronRight,
  Globe,
  Users,
  BookOpen,
} from "lucide-react";

const HealthFeaturesSection = () => {
  return (
    <section className="relative w-full ">
      {/* Top Feature Cards */}
      <div className="max-w-7xl mx-auto px-6 mb-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Card - Accurate and AI-powered */}
          <div className="text-center space-y-6">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl">
                  <Globe className="text-white" size={40} />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <Brain className="text-white" size={16} />
                </div>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              Accurate and AI-powered
            </h3>
            <p className="text-gray-300 leading-relaxed max-w-md mx-auto">
              Our AI model is developed and maintained as an open-source
              project, the foundation for millions of health predictions
              worldwide who want to build reliable diagnostic tools together.
            </p>
          </div>

          {/* Right Card - Fast and cross-device */}
          <div className="text-center space-y-6">
            <div className="flex justify-center mb-6">
              <div className="relative">
                {/* Isometric device stack */}
                <div className="relative transform rotate-12">
                  <div className="w-16 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-lg transform translate-x-4 translate-y-2"></div>
                  <div className="w-16 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg shadow-lg transform translate-x-2 translate-y-1 absolute top-0"></div>
                  <div className="w-16 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg shadow-lg absolute top-0"></div>
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <Activity className="text-white" size={12} />
                </div>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              Fast and cross-device
            </h3>
            <p className="text-gray-300 leading-relaxed max-w-md mx-auto">
              You can analyze, predict, and diagnose on multiple devices,
              including mobile phones, tablets, desktop computers, and medical
              equipment.
            </p>
          </div>
        </div>
      </div>

      {/* Main Learning Section */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left Column - Main Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
                Everything you need to start your
                <span className="text-red-400"> health AI</span> learning
                journey
              </h2>
            </div>

            <div className="space-y-6">
              <p className="text-xl text-gray-300 leading-relaxed">
                Our platform offers a comprehensive library of learning
                resources. Access tutorials, research papers, case studies, and
                content from medical experts to help you build better health
                prediction models.
              </p>
            </div>
          </div>

          {/* Right Column - Learning Cards */}
          <div className="space-y-8">
            {/* Card 1 - AI Health for Beginners */}
            <div className="group p-8 rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 backdrop-blur-sm hover:border-purple-500/30 transition-all duration-300">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-purple-500/20 rounded-xl">
                  <BookOpen className="text-purple-400" size={24} />
                </div>
                <div className="flex-1 space-y-3">
                  <h3 className="text-xl font-semibold text-white">
                    AI Health for Beginners videos
                  </h3>
                  <p className="text-gray-300 leading-relaxed text-sm">
                    Getting started with health AI development? We have you
                    covered with our AI Health for Beginners videos. Explore
                    tutorials on medical data, neural networks, prediction
                    models, machine learning fundamentals, diagnostic
                    algorithms, and more.
                  </p>
                  <button className="group/btn text-purple-400 hover:text-purple-300 font-medium flex items-center space-x-2 transition-colors duration-300">
                    <span>Browse beginner videos</span>
                    <ChevronRight
                      className="group-hover/btn:translate-x-1 transition-transform duration-300"
                      size={16}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Card 2 - Medical Research Hub */}
            <div className="group p-8 rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 backdrop-blur-sm hover:border-blue-500/30 transition-all duration-300">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-blue-500/20 rounded-xl">
                  <Stethoscope className="text-blue-400" size={24} />
                </div>
                <div className="flex-1 space-y-3">
                  <h3 className="text-xl font-semibold text-white">
                    Medical Research Hub
                  </h3>
                  <p className="text-gray-300 leading-relaxed text-sm">
                    Discover your path to build health prediction models with
                    our Medical Research Hub. Whether you're just starting or an
                    experienced medical professional, our research-based
                    approach helps you arrive at your goals faster, with more
                    confidence and accuracy.
                  </p>
                  <button className="group/btn text-blue-400 hover:text-blue-300 font-medium flex items-center space-x-2 transition-colors duration-300">
                    <span>Get started</span>
                    <ChevronRight
                      className="group-hover/btn:translate-x-1 transition-transform duration-300"
                      size={16}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Card 3 - Healthcare Learning */}
            <div className="group p-8 rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 backdrop-blur-sm hover:border-green-500/30 transition-all duration-300">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-green-500/20 rounded-xl">
                  <Users className="text-green-400" size={24} />
                </div>
                <div className="flex-1 space-y-3">
                  <h3 className="text-xl font-semibold text-white">
                    Healthcare Learning
                  </h3>
                  <p className="text-gray-300 leading-relaxed text-sm">
                    Get an introduction to the medical knowledge and skills
                    needed for a career as a health AI developer. Experience
                    comprehensive learning courses that provide a broad
                    perspective on core technologies leveraging medical AI and
                    machine learning.
                  </p>
                  <button className="group/btn text-green-400 hover:text-green-300 font-medium flex items-center space-x-2 transition-colors duration-300">
                    <span>Explore courses</span>
                    <ChevronRight
                      className="group-hover/btn:translate-x-1 transition-transform duration-300"
                      size={16}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative background elements */}
      <div className="absolute top-20 left-10 w-40 h-40 bg-purple-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-pink-500/5 rounded-full blur-2xl" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-500/3 rounded-full blur-3xl" />
    </section>
  );
};

export default HealthFeaturesSection;
