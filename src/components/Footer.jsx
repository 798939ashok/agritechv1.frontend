import React from 'react';
import { Leaf, Github, Twitter, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-gray-950 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Leaf size={16} className="text-white" />
              </div>
              <span className="font-bold text-lg gradient-text">AgriSense AI</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              AI-powered crop health monitoring and farmer assistance system. Empowering Indian farmers with technology.
            </p>
          </div>
          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-3">Quick Links</h4>
            <div className="flex flex-col gap-2">
              {[['Disease Detection', '/disease-detection'], ['Plant ID', '/plant-id'], ['Weather', '/weather'], ['Govt News', '/news']].map(([label, path]) => (
                <Link key={path} to={path} className="text-gray-500 text-sm hover:text-primary-400 transition-colors">{label}</Link>
              ))}
            </div>
          </div>
          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-3">Contact</h4>
            <p className="text-gray-500 text-sm">Amrita Sai Institute of Science & Technology</p>
            <p className="text-gray-500 text-sm mt-1">Final Year CSE Project — 2026–27</p>
            <div className="flex gap-3 mt-4">
              {[Github, Twitter, Mail].map((Icon, i) => (
                <button key={i} className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-primary-400 hover:bg-gray-700 transition-all">
                  <Icon size={15} />
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-600 text-xs">
          © 2026 AgriSense AI. Built with React + Flask + TensorFlow.
        </div>
      </div>
    </footer>
  );
}
