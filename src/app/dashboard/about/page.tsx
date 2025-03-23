'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ImageUpload from '../../components/ImageUpload';

export default function AboutPageEditor() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // About page sections state
  const [formData, setFormData] = useState({
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
  
  // Check authentication
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = localStorage.getItem('dashboard_auth');
      if (auth === 'true') {
        setIsAuthenticated(true);
      } else {
        // Redirect if not authenticated
        router.push('/dashboard');
      }
      
      // Try to load saved about page data
      const savedAboutData = localStorage.getItem('about_page_data');
      if (savedAboutData) {
        try {
          setFormData(JSON.parse(savedAboutData));
        } catch (error) {
          console.error('Error parsing about page data:', error);
        }
      }
      
      setIsLoading(false);
    }
  }, [router]);

  const handleChange = (section, key, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };
  
  const handleSkillChange = (index, field, value) => {
    const updatedSkills = [...formData.skills];
    
    if (field === 'category') {
      updatedSkills[index] = { ...updatedSkills[index], category: value };
    } else if (field === 'items') {
      // Split comma-separated values into array
      updatedSkills[index] = { 
        ...updatedSkills[index], 
        items: value.split(',').map(item => item.trim()) 
      };
    }
    
    setFormData(prev => ({ ...prev, skills: updatedSkills }));
  };
  
  const addSkill = () => {
    setFormData(prev => ({
      ...prev,
      skills: [...prev.skills, { category: '', items: [] }]
    }));
  };
  
  const removeSkill = (index) => {
    const updatedSkills = [...formData.skills];
    updatedSkills.splice(index, 1);
    setFormData(prev => ({ ...prev, skills: updatedSkills }));
  };
  
  const handleExperienceChange = (index, field, value) => {
    const updatedExperience = [...formData.experience];
    
    if (field === 'description') {
      // Split lines into array for description
      updatedExperience[index] = { 
        ...updatedExperience[index], 
        description: value.split('\n').map(item => item.trim()).filter(item => item) 
      };
    } else {
      updatedExperience[index] = { ...updatedExperience[index], [field]: value };
    }
    
    setFormData(prev => ({ ...prev, experience: updatedExperience }));
  };
  
  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      experience: [...prev.experience, { 
        title: '',
        company: '',
        location: '',
        period: '',
        description: ['']
      }]
    }));
  };
  
  const removeExperience = (index) => {
    const updatedExperience = [...formData.experience];
    updatedExperience.splice(index, 1);
    setFormData(prev => ({ ...prev, experience: updatedExperience }));
  };
  
  const handleEducationChange = (index, field, value) => {
    const updatedEducation = [...formData.education];
    updatedEducation[index] = { ...updatedEducation[index], [field]: value };
    setFormData(prev => ({ ...prev, education: updatedEducation }));
  };
  
  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, { 
        degree: '',
        institution: '',
        year: '',
        description: ''
      }]
    }));
  };
  
  const removeEducation = (index) => {
    const updatedEducation = [...formData.education];
    updatedEducation.splice(index, 1);
    setFormData(prev => ({ ...prev, education: updatedEducation }));
  };
  
  // Add handlers for certifications
  const handleCertificationChange = (index, value) => {
    setFormData(prev => {
      const updatedCertifications = [...prev.certifications];
      updatedCertifications[index] = value;
      return {
        ...prev,
        certifications: updatedCertifications
      };
    });
  };
  
  const addCertification = () => {
    setFormData(prev => ({
      ...prev,
      certifications: [...prev.certifications, '']
    }));
  };
  
  const removeCertification = (index) => {
    const updatedCertifications = [...formData.certifications];
    updatedCertifications.splice(index, 1);
    setFormData(prev => ({ ...prev, certifications: updatedCertifications }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Save to localStorage
    localStorage.setItem('about_page_data', JSON.stringify(formData));
    
    // Show success message
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <div className="py-6 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Edit About Page</h1>
          <Link 
            href="/dashboard"
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Back to Dashboard
          </Link>
        </div>
        
        {showSuccess && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">
                  About page content has been saved successfully!
                </p>
              </div>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Profile Section */}
          <div className="bg-white shadow overflow-hidden rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Profile Section</h2>
              
              <div className="mb-4">
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  id="bio"
                  rows={3}
                  className="shadow-sm block w-full focus:ring-blue-500 focus:border-blue-500 sm:text-sm border border-gray-300 rounded-md text-gray-900"
                  value={formData.profileSection.bio}
                  onChange={(e) => handleChange('profileSection', 'bio', e.target.value)}
                />
              </div>
            </div>
          </div>
          
          {/* Professional Summary */}
          <div className="bg-white shadow overflow-hidden rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Professional Summary</h2>
              
              <div className="mb-4">
                <textarea
                  id="professionalSummary"
                  rows={5}
                  className="shadow-sm block w-full focus:ring-blue-500 focus:border-blue-500 sm:text-sm border border-gray-300 rounded-md text-gray-900"
                  value={formData.professionalSummary}
                  onChange={(e) => setFormData(prev => ({ ...prev, professionalSummary: e.target.value }))}
                />
              </div>
            </div>
          </div>
          
          {/* Skills Section */}
          <div className="bg-white shadow overflow-hidden rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">Skills</h2>
                <button
                  type="button"
                  onClick={addSkill}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Add Skill Category
                </button>
              </div>
              
              {formData.skills.map((skill, index) => (
                <div key={index} className="mb-4 bg-gray-50 p-4 rounded-md relative">
                  <button
                    type="button"
                    onClick={() => removeSkill(index)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <input
                      type="text"
                      className="shadow-sm block w-full focus:ring-blue-500 focus:border-blue-500 sm:text-sm border border-gray-300 rounded-md text-gray-900"
                      value={skill.category}
                      onChange={(e) => handleSkillChange(index, 'category', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Skills (comma-separated)
                    </label>
                    <input
                      type="text"
                      className="shadow-sm block w-full focus:ring-blue-500 focus:border-blue-500 sm:text-sm border border-gray-300 rounded-md text-gray-900"
                      value={skill.items.join(', ')}
                      onChange={(e) => handleSkillChange(index, 'items', e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Experience Section */}
          <div className="bg-white shadow overflow-hidden rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">Experience</h2>
                <button
                  type="button"
                  onClick={addExperience}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Add Experience
                </button>
              </div>
              
              {formData.experience.map((exp, index) => (
                <div key={index} className="mb-6 bg-gray-50 p-4 rounded-md relative">
                  <button
                    type="button"
                    onClick={() => removeExperience(index)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  <div className="grid grid-cols-1 gap-y-3 gap-x-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        className="shadow-sm block w-full focus:ring-blue-500 focus:border-blue-500 sm:text-sm border border-gray-300 rounded-md text-gray-900"
                        value={exp.title}
                        onChange={(e) => handleExperienceChange(index, 'title', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company
                      </label>
                      <input
                        type="text"
                        className="shadow-sm block w-full focus:ring-blue-500 focus:border-blue-500 sm:text-sm border border-gray-300 rounded-md text-gray-900"
                        value={exp.company}
                        onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        className="shadow-sm block w-full focus:ring-blue-500 focus:border-blue-500 sm:text-sm border border-gray-300 rounded-md text-gray-900"
                        value={exp.location}
                        onChange={(e) => handleExperienceChange(index, 'location', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Period
                      </label>
                      <input
                        type="text"
                        className="shadow-sm block w-full focus:ring-blue-500 focus:border-blue-500 sm:text-sm border border-gray-300 rounded-md text-gray-900"
                        value={exp.period}
                        onChange={(e) => handleExperienceChange(index, 'period', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description (one point per line)
                    </label>
                    <textarea
                      rows={5}
                      className="shadow-sm block w-full focus:ring-blue-500 focus:border-blue-500 sm:text-sm border border-gray-300 rounded-md text-gray-900"
                      value={exp.description.join('\n')}
                      onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Education Section */}
          <div className="bg-white shadow overflow-hidden rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">Education</h2>
                <button
                  type="button"
                  onClick={addEducation}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Add Education
                </button>
              </div>
              
              {formData.education.map((edu, index) => (
                <div key={index} className="mb-4 bg-gray-50 p-4 rounded-md relative">
                  <button
                    type="button"
                    onClick={() => removeEducation(index)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  <div className="grid grid-cols-1 gap-y-3 gap-x-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Degree
                      </label>
                      <input
                        type="text"
                        className="shadow-sm block w-full focus:ring-blue-500 focus:border-blue-500 sm:text-sm border border-gray-300 rounded-md text-gray-900"
                        value={edu.degree}
                        onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Institution
                      </label>
                      <input
                        type="text"
                        className="shadow-sm block w-full focus:ring-blue-500 focus:border-blue-500 sm:text-sm border border-gray-300 rounded-md text-gray-900"
                        value={edu.institution}
                        onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Year
                      </label>
                      <input
                        type="text"
                        className="shadow-sm block w-full focus:ring-blue-500 focus:border-blue-500 sm:text-sm border border-gray-300 rounded-md text-gray-900"
                        value={edu.year}
                        onChange={(e) => handleEducationChange(index, 'year', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      className="shadow-sm block w-full focus:ring-blue-500 focus:border-blue-500 sm:text-sm border border-gray-300 rounded-md text-gray-900"
                      value={edu.description}
                      onChange={(e) => handleEducationChange(index, 'description', e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Certifications Section */}
          <div className="bg-white shadow overflow-hidden rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">Certifications</h2>
                <button
                  type="button"
                  onClick={addCertification}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Add Certification
                </button>
              </div>
              
              {formData.certifications.map((cert, index) => (
                <div key={index} className="mb-4 bg-gray-50 p-4 rounded-md relative">
                  <button
                    type="button"
                    onClick={() => removeCertification(index)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Certification
                    </label>
                    <input
                      type="text"
                      className="shadow-sm block w-full focus:ring-blue-500 focus:border-blue-500 sm:text-sm border border-gray-300 rounded-md text-gray-900"
                      value={cert}
                      onChange={(e) => handleCertificationChange(index, e.target.value)}
                      placeholder="e.g., Google: Data Analytics Professional Certificate"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => router.push('/about')}
              className="mr-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Preview
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 