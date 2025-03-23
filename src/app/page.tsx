'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function Home() {
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    // Load profile data from localStorage if available
    if (typeof window !== 'undefined') {
      const savedProfile = localStorage.getItem('profile_data');
      if (savedProfile) {
        setProfileData(JSON.parse(savedProfile));
      }
    }
  }, []);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:max-w-2xl">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">{profileData?.name || 'Tara Prasad Pandey'}</span>
                <span className="block text-3xl mt-3 text-gray-700">{profileData?.title || 'Data Analyst & Automation Specialist'}</span>
              </h1>
              <p className="mt-6 text-base text-gray-800 font-medium bg-white p-5 border-l-4 border-blue-600 rounded-lg shadow-sm max-w-3xl leading-relaxed">
                {profileData?.bio || 'Results-driven Data Analyst with expertise in machine learning, automation and process automation. Experience in developing and implementing automated solutions using Python, Google Scripts, and MongoDB.'}
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link
                  href="/projects"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-700 hover:bg-blue-800"
                >
                  View Projects
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-5 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Contact Me
                </Link>
              </div>
            </div>
            <div className="mt-8 md:mt-0">
              <div className="relative h-64 w-64 rounded-full overflow-hidden border-4 border-gray-200 mx-auto">
                {profileData?.imageUrl ? (
                  profileData.imageUrl.startsWith('data:') ? (
                    // For data URLs (from file upload)
                    <img 
                      src={profileData.imageUrl}
                      alt={profileData.name || 'Tara Prasad Pandey'}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    // For regular file paths
                    <Image 
                      src={profileData.imageUrl} 
                      alt={profileData.name || 'Tara Prasad Pandey'} 
                      fill
                      className="object-cover"
                      priority
                    />
                  )
                ) : (
                  <Image 
                    src="/images/profile/profile.jpg" 
                    alt="Tara Prasad Pandey" 
                    fill
                    className="object-cover"
                    priority
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Skills */}
      <div className="bg-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Technical Skills & Expertise
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="relative p-6 bg-gray-50 rounded-lg border-t-4 border-blue-600">
              <div className="absolute -top-3 -left-3 h-10 w-10 rounded-full bg-blue-700 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mt-2">Languages & Databases</h3>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center text-gray-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-600 mr-2"></span>
                  Python
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-600 mr-2"></span>
                  Google Scripts
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-600 mr-2"></span>
                  MongoDB
                </li>
              </ul>
            </div>

            <div className="relative p-6 bg-gray-50 rounded-lg border-t-4 border-blue-600">
              <div className="absolute -top-3 -left-3 h-10 w-10 rounded-full bg-blue-700 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mt-2">ML/AI Frameworks</h3>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center text-gray-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-600 mr-2"></span>
                  TensorFlow
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-600 mr-2"></span>
                  scikit-learn
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-600 mr-2"></span>
                  Pandas, NumPy
                </li>
              </ul>
            </div>

            <div className="relative p-6 bg-gray-50 rounded-lg border-t-4 border-blue-600">
              <div className="absolute -top-3 -left-3 h-10 w-10 rounded-full bg-blue-700 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mt-2">Data Visualization</h3>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center text-gray-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-600 mr-2"></span>
                  Matplotlib
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-600 mr-2"></span>
                  Looker
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-600 mr-2"></span>
                  Dashboard Design
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Projects */}
      <div className="bg-gray-50 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Featured Projects
            </h2>
            <p className="mt-4 max-w-2xl text-lg text-gray-500 mx-auto">
              A selection of my recent work in data analysis, machine learning, and automation.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2">
            <div className="bg-white overflow-hidden shadow rounded-lg border-t-4 border-blue-600">
              <div className="p-6">
                <h3 className="text-xl font-medium text-gray-900">Automated Reporting System</h3>
                <p className="mt-2 text-gray-600">
                  Developed end-to-end automated reporting system using Python and Google Script with MongoDB integration for data storage and retrieval. Created automated visualization dashboards for business metrics.
                </p>
                <div className="mt-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2">
                    Python
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2">
                    Google Scripts
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    MongoDB
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg border-t-4 border-blue-600">
              <div className="p-6">
                <h3 className="text-xl font-medium text-gray-900">Deep Learning Classification System</h3>
                <p className="mt-2 text-gray-600">
                  Designed and implemented CNN models for image classification with integrated automated data preprocessing pipelines. This project focuses on classification using Deep learning with accurate prediction models.
                </p>
                <div className="mt-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2">
                    TensorFlow
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2">
                    CNN
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Python
                  </span>
                </div>
                <div className="mt-4">
                  <a href="#" className="text-sm font-medium text-blue-700 hover:text-blue-900">View Project →</a>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/projects"
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              View All Projects
            </Link>
          </div>
        </div>
      </div>

      {/* Experience Highlight */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Professional Experience
          </h2>
          
          <div className="space-y-12">
            <div className="relative">
              <div className="absolute inset-0 h-full w-px bg-blue-200 left-8 top-5"></div>
              
              <div className="relative flex items-start">
                <div className="h-16 w-16 flex items-center justify-center bg-blue-700 rounded-lg text-white text-sm font-medium">
                  2024
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-medium text-gray-900">Data Analyst</h3>
                  <p className="text-sm text-gray-600">Rippey AI – Louisville, CO (Remote) | Nov 2024 – Present</p>
                  <ul className="mt-2 space-y-1 text-gray-600 list-disc pl-5">
                    <li>Collected, cleaned and transformed large data sets to ensure data accuracy</li>
                    <li>Developed and optimized complex queries in MongoDB</li>
                    <li>Automated recurring reports using Python</li>
                    <li>Generated insights and actionable reports in Looker</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative flex items-start">
                <div className="h-16 w-16 flex items-center justify-center bg-blue-700 rounded-lg text-white text-sm font-medium">
                  2024
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-medium text-gray-900">Automation Analyst</h3>
                  <p className="text-sm text-gray-600">Rippey AI – Louisville, CO (Remote) | May 2024 – Nov 2024</p>
                  <ul className="mt-2 space-y-1 text-gray-600 list-disc pl-5">
                    <li>Developed automated data pipeline systems using Python and Google Scripts</li>
                    <li>Architected MongoDB database operations for efficient data storage</li>
                    <li>Created automated data visualization systems</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <Link
              href="/about"
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              View Full Resume
            </Link>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            <span className="block">Looking for data analysis expertise?</span>
            <span className="block text-blue-200 text-xl mt-2">Let's discuss how I can help with your projects.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-gray-50"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
