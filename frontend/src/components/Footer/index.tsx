"use client";
import React from "react";
import {
  HeartPulse,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Github,
  Linkedin,
  Twitter,
  Instagram,
} from "lucide-react";
import SpotlightButton from "../SpotlightButton";

const Footer = () => {
  return (
    <footer className="relative  text-white overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-red-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-purple-500/5 rounded-full blur-2xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/3 rounded-full blur-3xl" />
      </div>

      {/* Main Footer Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        {/* Top Section - Main Brand */}
        <div className="mb-16">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
            {/* Brand Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-[#fb2c36]/50 rounded-xl">
                  <HeartPulse className="text-white animate-pulse" size={32} />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-red-500 ">
                    HEART PREDICT
                  </h2>
                  <p className="text-gray-400 text-sm">
                    AI-Powered Health Analytics
                  </p>
                </div>
              </div>

              <div className="space-y-2 max-w-md">
                <p className="text-lg text-gray-300">We create possibilities</p>
                <p className="text-lg text-gray-300">
                  for the connected world.
                </p>
                <p className="text-xl font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
                  Be Bold.
                </p>
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center lg:text-right space-y-4">
              <p className="text-gray-300 text-lg">
                Ready to predict your health?
              </p>
              <SpotlightButton
                main="Try Analysis"
                styleDefault={false}
                customStyles={{
                  button:
                    "relative w-full max-w-40 overflow-hidden rounded-sm px-2 py-2 text-lg font-medium text-white cursor-pointer bg-gradient-to-br from-pink-500/10 to-pink-600/10 border border-pink-500/20 backdrop-blur-sm hover:border-pink-400/40 duration-700",
                  text: "pointer-events-none relative z-10 mix-blend-difference cursor-pointer flex flex-row items-center text-sm justify-center gap-2 text-pink-500",
                  spotlight:
                    "pointer-events-none absolute left-[50%] top-[50%] h-10 w-10 -translate-x-[50%] -translate-y-[50%] rounded-full bg-fuchsia-800/10",
                }}
                href="/predict"
              />
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Explore Column */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
              Explore
            </h3>
            <ul className="space-y-3">
              {[
                { name: "Home", href: "/" },
                { name: "About", href: "/about" },
                { name: "Capabilities", href: "/capabilities" },
                { name: "Careers", href: "/careers" },
                { name: "Research", href: "/research" },
              ].map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="group text-gray-400 hover:text-white transition-colors duration-300 flex items-center space-x-2"
                  >
                    <span>{link.name}</span>
                    <ExternalLink
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      size={14}
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Products Column */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
              Products
            </h3>
            <ul className="space-y-3">
              {[
                "Heart Disease Prediction",
                "Risk Assessment Tool",
                "Health Analytics API",
                "Medical Dashboard",
                "AI Consultation",
              ].map((product, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="group text-gray-400 hover:text-white transition-colors duration-300 flex items-center space-x-2"
                  >
                    <span>{product}</span>
                    <ExternalLink
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      size={14}
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info Column */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
              Contact
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="text-red-400 mt-1 flex-shrink-0" size={18} />
                <div className="text-gray-400 text-sm">
                  <p>East Java, Indonesia</p>
                  <p>Universitas Muhammadiyah Lamongan</p>
                  <p className="font-medium text-white mt-1">
                    M. Cita Prasetya Agam
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="text-red-400 flex-shrink-0" size={18} />
                <a
                  href="mailto:agam.prasetya03@gmail.com"
                  className="text-gray-400 hover:text-white transition-colors duration-300 text-sm"
                >
                  agam.prasetya03@gmail.com
                </a>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="text-red-400 flex-shrink-0" size={18} />
                <a
                  href="tel:+6289937870930"
                  className="text-gray-400 hover:text-white transition-colors duration-300 text-sm"
                >
                  +62-8993787093
                </a>
              </div>
            </div>
          </div>

          {/* Social & Legal Column */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
              Connect
            </h3>

            {/* Social Links */}
            <div className="space-y-4">
              <p className="text-sm text-gray-400 font-medium">Follow Us</p>
              <div className="flex space-x-4">
                {[
                  {
                    icon: Linkedin,
                    href: "https://www.linkedin.com/in/agaam/",
                    color: "hover:text-blue-400",
                  },
                  { icon: Twitter, href: "#", color: "hover:text-sky-400" },
                  { icon: Instagram, href: "#", color: "hover:text-pink-400" },
                  { icon: Github, href: "#", color: "hover:text-gray-400" },
                ].map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className={`p-2 bg-gray-800/50 rounded-lg text-gray-400 ${social.color} transition-all duration-300 hover:bg-gray-700/50 hover:scale-110`}
                  >
                    <social.icon size={20} />
                  </a>
                ))}
              </div>
            </div>

            {/* Legal Links */}
            <div className="space-y-3">
              <p className="text-sm text-gray-400 font-medium">Legal</p>
              <div className="space-y-2">
                {[
                  { name: "Privacy Policy", href: "/privacy" },
                  { name: "Terms of Service", href: "/terms" },
                  { name: "Cookie Policy", href: "/cookies" },
                ].map((legal, index) => (
                  <a
                    key={index}
                    href={legal.href}
                    className="block text-sm text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    {legal.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <div className="text-center lg:text-left">
              <p className="text-sm text-gray-400">
                © {new Date().getFullYear()} Heart Predict. All Rights
                Reserved.
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Powered by Advanced Machine Learning & Neural Networks
              </p>
            </div>

            {/* Creator Credit */}
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-400">Created by</p>
                <p className="text-lg font-semibold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
                  Agaam
                </p>
              </div>
              <div className="w-20 h-px bg-gradient-to-r from-red-500 to-pink-500"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating elements */}
      <div className="absolute bottom-10 left-10 w-3 h-3 bg-red-500 rounded-full animate-ping" />
      <div className="absolute top-10 right-10 w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
    </footer>
  );
};

export default Footer;
