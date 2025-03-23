'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function About() {
  const [aboutData, setAboutData] = useState({
    profileSection: {
      bio: "Results-driven Data Analyst specializing in automation, machine learning models, and data visualization with advanced skills in Python, SQL, and Power BI.",
    },
    skills: [
      { category: 'Languages', items: ['Python', 'Google Scripts'] },
      { category: 'Databases', items: ['MongoDB'] },
      { category: 'ML/AI Frameworks', items: ['TensorFlow', 'scikit-learn', 'Pandas', 'NumPy'] },
      { category: 'Data Visualization', items: ['Matplotlib', 'Dashboard Design', 'Looker', 'Jupyter Notebook'] },
      { category: 'Development Tools', items: ['Git', 'Jupyter Notebook', 'Google Colab', 'Anaconda'] },
      { category: 'Project Management', items: ['Notion', 'Jira'] }
    ],
    certifications: [
      'Data Analyst: Data Analyst Associate certificate',
      'Kaggle: Competitions Contributor',
      'MongoDB University: MongoDB Basics',
      'Google: Data Analytics Professional Certificate'
    ],
    professionalSummary: "I'm a passionate Data Analyst with 5+ years of experience in analyzing large datasets and creating automated solutions. I specialize in developing machine learning models and creating insightful data visualizations that drive business decisions.",
    experience: [
      {
        title: 'Data Analyst',
        company: 'Rippey AI',
        location: 'Louisville, CO (Remote)',
        period: 'Nov 2024 - Present',
        description: [
          'Large data sets were collected, cleaned and transformed to ensure data accuracy and consistency for analysis and reporting.',
          'Developed and optimized complex queries in MongoDB to support business intelligence and reporting needs.',
          'Automated recurring reports using Python, significantly reducing manual effort and improving efficiency.',
          'Generated insights and actionable reports in Looker, helping management and business teams make informed decisions.',
          'Designed and maintained dashboards for real-time monitoring of key performance metrics.'
        ]
      },
      {
        title: 'Automation Analyst',
        company: 'Rippey AI',
        location: 'Louisville, CO (Remote)',
        period: 'May 2023 - Oct 2024',
        description: [
          'Developed automated workflows using Python and Google Apps Script, reducing 40+ hours of manual work per week.',
          'Created and maintained ETL processes for data warehousing and analytics.',
          'Built dashboards in Looker Studio, providing stakeholders with real-time access to key performance metrics.',
          'Collaborated with cross-functional teams to identify and implement process improvements.',
          'Conducted training sessions for team members on using automated tools and dashboards.'
        ]
      }
    ],
    education: [
      {
        degree: 'Master of Science in Data Analytics',
        institution: 'Seattle University',
        year: '2021-2023',
        description: 'Specialized in machine learning and predictive modeling. Developed a thesis project analyzing customer retention patterns for SaaS businesses.'
      },
      {
        degree: 'Bachelor of Science in Computer Science',
        institution: 'University of Washington',
        year: '2016-2020',
        description: 'Focused on algorithms and data structures. Participated in multiple hackathons and completed internships at tech companies.'
      }
    ]
  });
  
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    // Load profile data from localStorage if available
    if (typeof window !== 'undefined') {
      const savedProfile = localStorage.getItem('profile_data');
      if (savedProfile) {
        setProfileData(JSON.parse(savedProfile));
      }
      
      // Load about page data if available
      const savedAboutData = localStorage.getItem('about_page_data');
      if (savedAboutData) {
        try {
          setAboutData(JSON.parse(savedAboutData));
        } catch (error) {
          console.error('Error parsing about page data:', error);
        }
      }
    }
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* About Me Section */}
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="md:flex">
            <div className="md:shrink-0 p-6">
              <div className="h-48 w-48 rounded-full overflow-hidden bg-gray-200 mx-auto border-4 border-blue-600">
                {profileData?.imageUrl ? (
                  profileData.imageUrl.startsWith('data:') ? (
                    // For data URLs (from file upload)
                    <img 
                      src={profileData.imageUrl}
                      alt={profileData?.name || "Tara Prasad Pandey"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    // For regular file paths
                    <Image 
                      src={profileData.imageUrl}
                      alt={profileData?.name || "Tara Prasad Pandey"}
                      width={192}
                      height={192}
                      className="h-full w-full object-cover"
                    />
                  )
                ) : (
                  <Image 
                    src="/images/profile/profile.jpg"
                    alt="Tara Prasad Pandey"
                    width={192}
                    height={192}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
            </div>
            
            <div className="px-6 py-8 md:p-8 md:flex-1">
              <h1 className="text-3xl font-bold text-gray-900">{profileData?.name || "Tara Prasad Pandey"}</h1>
              <p className="mt-1 text-xl text-blue-600 font-medium">{profileData?.title || "Data Analyst"}</p>
              
              <div className="mt-4 text-gray-800 leading-relaxed">
                <p className="bg-gray-50 p-5 border-l-4 border-blue-600 mb-4 text-gray-800 font-medium">
                  {aboutData.profileSection.bio}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Location</h3>
                    <p className="mt-1">{profileData?.location || "Seattle, WA"}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Email</h3>
                    <p className="mt-1">{profileData?.email || "sheahead22@gmail.com"}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">LinkedIn</h3>
                    <p className="mt-1">
                      <a 
                        href={profileData?.linkedin || "https://www.linkedin.com/in/Brainwave1999"}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {profileData?.linkedin || "linkedin.com/in/Brainwave1999"}
                      </a>
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                    <p className="mt-1">{profileData?.phone || "+1 (555) 123-4567"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Skills section - Updated with different styling */}
        <div className="mt-8 bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="bg-blue-600 p-2 rounded-md text-white mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </span>
              Skills
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {aboutData.skills.map((skill, index) => (
                <div key={index} className="bg-gray-50 p-5 rounded-lg shadow border-l-4 border-blue-600">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{skill.category}</h3>
                  <ul className="space-y-2">
                    {skill.items.map((item, i) => (
                      <li key={i} className="flex items-center">
                        <svg className="h-5 w-5 text-blue-600 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-800 font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Certifications Section */}
        <div className="mt-8 bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="bg-blue-600 p-2 rounded-md text-white mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </span>
              Certifications
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {aboutData.certifications.map((cert, index) => (
                <div key={index} className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100 shadow-sm flex items-center">
                  <div className="flex-shrink-0 h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{cert}</h3>
                    <p className="text-sm text-gray-600">Verified Professional Credential</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Experience Section - Enhanced for better visibility */}
        <div className="mt-8 bg-white shadow-lg rounded-lg overflow-hidden border border-blue-100">
          <div className="px-6 py-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="bg-blue-600 p-2 rounded-md text-white mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
              Professional Experience
            </h2>
            
            <div className="space-y-8 mt-8">
              {aboutData.experience.map((exp, index) => (
                <div key={index} className="relative pl-8 pb-6">
                  {index !== aboutData.experience.length - 1 && (
                    <div className="absolute top-0 left-3 h-full w-0.5 bg-blue-300"></div>
                  )}
                  <div className="absolute top-0 left-0 h-6 w-6 rounded-full border-4 border-blue-600 bg-white"></div>
                  
                  <div className="bg-blue-50 p-6 rounded-lg shadow-md border-l-4 border-blue-600">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{exp.title}</h3>
                        <p className="text-blue-700 font-medium">{exp.company} | {exp.location}</p>
                      </div>
                      <p className="text-sm text-white font-semibold bg-blue-600 px-4 py-1 rounded-full mt-2 md:mt-0 md:ml-4 inline-block">
                        {exp.period}
                      </p>
                    </div>
                    
                    <ul className="mt-5 space-y-3">
                      {exp.description.map((item, i) => (
                        <li key={i} className="flex bg-white p-3 rounded-lg shadow-sm">
                          <svg className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-800">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Education Section */}
        <div className="mt-8 bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="bg-blue-600 p-2 rounded-md text-white mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998a12.078 12.078 0 01.665-6.479L12 14z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998a12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                </svg>
              </span>
              Education
            </h2>
            
            <div className="space-y-6 mt-8">
              {aboutData.education.map((edu, index) => (
                <div key={index} className="bg-gray-50 p-5 rounded-lg">
                  <div className="flex items-start">
                    <div className="bg-blue-100 rounded-full p-3 mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-bold text-gray-900">{edu.degree}</h3>
                      <p className="text-sm text-gray-600">{edu.institution} | {edu.year}</p>
                      <p className="mt-2 text-gray-600">{edu.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Call to Action */}
        <div className="mt-8 bg-blue-600 shadow rounded-lg overflow-hidden">
          <div className="px-6 py-8 md:px-10 md:py-12 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Interested in working together?</h2>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              I'm currently open to new opportunities and projects. Feel free to reach out to discuss how my skills and experience can help your organization.
            </p>
            <Link 
              href="/contact" 
              className="inline-block bg-white text-blue-700 font-bold py-3 px-6 rounded-md hover:bg-blue-50 transition-colors"
            >
              Contact Me
            </Link>
            <Link 
              href="/files/resume.pdf" 
              className="inline-block ml-4 bg-transparent text-white font-bold py-3 px-6 rounded-md border-2 border-white hover:bg-white hover:text-blue-700 transition-colors"
              target="_blank"
            >
              Download Resume
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 