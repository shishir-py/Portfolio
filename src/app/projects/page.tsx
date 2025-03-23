'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Initial fallback data
const initialProjects = [
  {
    id: 1,
    title: 'Sales Forecasting Model',
    description: 'Developed an ARIMA time series model that improved sales forecasting accuracy by 27%, enabling better inventory management.',
    imageUrl: '/images/projects/sales-forecast.jpg',
    tags: ['Python', 'Pandas', 'Scikit-learn', 'Matplotlib', 'MongoDB'],
    slug: 'sales-forecasting-model'
  },
  {
    id: 2,
    title: 'Customer Segmentation',
    description: 'Applied K-means clustering to segment customers based on purchasing behavior, resulting in a 15% increase in marketing campaign effectiveness.',
    imageUrl: '/images/projects/customer-segmentation.jpg',
    tags: ['Python', 'NumPy', 'Pandas', 'Scikit-learn', 'Seaborn'],
    slug: 'customer-segmentation'
  },
  {
    id: 3,
    title: 'Financial Dashboard',
    description: 'Created an interactive Power BI dashboard to visualize key financial metrics, enabling executives to make data-driven decisions quickly.',
    imageUrl: '/images/projects/financial-dashboard.jpg',
    tags: ['Power BI', 'SQL', 'DAX', 'Financial Analysis'],
    slug: 'financial-dashboard'
  },
  {
    id: 4,
    title: 'Churn Prediction Model',
    description: 'Machine learning model to predict customer churn for a subscription business.',
    imageUrl: '/images/projects/churn-prediction.jpg',
    tags: ['Machine Learning', 'Classification', 'Python', 'scikit-learn'],
    slug: 'churn-prediction'
  },
  {
    id: 5,
    title: 'Market Basket Analysis',
    description: 'Association rule mining to identify product affinities and optimize store layouts.',
    imageUrl: '/images/projects/market-basket.jpg',
    tags: ['Association Rules', 'Apriori', 'R', 'Retail'],
    slug: 'market-basket'
  },
  {
    id: 6,
    title: 'Social Media Sentiment Analysis',
    description: 'NLP techniques to analyze sentiment from social media data for brand monitoring.',
    imageUrl: '/images/projects/sentiment-analysis.jpg',
    tags: ['NLP', 'Sentiment Analysis', 'Python', 'NLTK', 'Marketing'],
    slug: 'sentiment-analysis'
  }
];

export default function Projects() {
  const [projects, setProjects] = useState(initialProjects);
  const [projectImages, setProjectImages] = useState<Record<string, string>>({});
  const [updateTrigger, setUpdateTrigger] = useState(0);
  
  // Check for changes every 2 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      setUpdateTrigger(prev => prev + 1);
    }, 2000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Load projects from localStorage on component mount or when triggered
  useEffect(() => {
    // Load project data from localStorage
    if (typeof window !== 'undefined') {
      const savedProjects = localStorage.getItem('projects_data');
      if (savedProjects) {
        setProjects(JSON.parse(savedProjects));
      } else {
        // No saved projects found, save the initial ones
        localStorage.setItem('projects_data', JSON.stringify(initialProjects));
        setProjects(initialProjects);
      }
      
      // Load any project images from localStorage
      const savedProjectImages = localStorage.getItem('project_images');
      if (savedProjectImages) {
        setProjectImages(JSON.parse(savedProjectImages));
      }
      
      // Check for light/dark mode preference
      const savedMode = localStorage.getItem('color_mode');
      if (savedMode) {
        // Implement mode change logic here
      }
    }
  }, [updateTrigger]);

  // Tool icons mapping
  const toolIcons = {
    'MongoDB': '/images/icons/mongodb.svg',
    'NumPy': '/images/icons/numpy.svg',
    'LinkedIn': '/images/icons/linkedin.svg',
    'Python': '/images/icons/python.svg',
    'Pandas': '/images/icons/pandas.svg'
  };
  
  // Get image source based on imageUrl
  const getImageSource = (imageUrl: string) => {
    // If we have a data URL stored in localStorage, use that
    if (projectImages[imageUrl]) {
      return projectImages[imageUrl];
    }
    // Otherwise, use the original URL (which might be a file path)
    return imageUrl;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Data Analysis Projects
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4 bg-white p-5 border-l-4 border-blue-600 font-medium leading-relaxed">
            A collection of my data analytics projects showcasing skills in machine learning, statistical analysis, and data visualization.
          </p>
        </div>

        {projects.length === 0 ? (
          <div className="mt-12 text-center p-12 bg-white rounded-lg shadow">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No projects available</h3>
            <p className="mt-2 text-gray-500">
              Projects will appear here once they're added through the admin dashboard.
            </p>
          </div>
        ) : (
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <div key={`${project.id}-${updateTrigger}`} className="flex flex-col rounded-lg shadow-lg overflow-hidden border-t-4 border-blue-600">
                <div className="flex-shrink-0 h-48 bg-blue-600 relative">
                  {project.imageUrl ? (
                    <div className="w-full h-full">
                      <img
                        src={getImageSource(project.imageUrl)}
                        alt={project.title}
                        className="w-full h-full object-cover"
                        key={`img-${project.id}-${updateTrigger}`}
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-white opacity-75" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                  <div className="flex-1">
                    <Link href={`/projects/${project.slug}`} className="block">
                      <p className="text-xl font-semibold text-gray-900 hover:text-blue-700 transition-colors">{project.title}</p>
                    </Link>
                    <p className="mt-3 text-base text-gray-500">{project.description}</p>
                  </div>
                  <div className="mt-4">
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {toolIcons[tag] && (
                            <span className="mr-1 relative w-4 h-4 inline-block">
                              <Image
                                src={toolIcons[tag]}
                                alt={tag}
                                width={16}
                                height={16}
                                className="inline-block"
                              />
                            </span>
                          )}
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-6">
                    <Link 
                      href={`/projects/${project.slug}`} 
                      className="text-blue-700 hover:text-blue-900 font-medium flex items-center"
                    >
                      View Details
                      <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 