'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, notFound } from 'next/navigation';

export default function ProjectDetail() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toolIcons, setToolIcons] = useState({});
  
  useEffect(() => {
    // Tool icons mapping
    setToolIcons({
      'Python': '/images/icons/python.svg',
      'MongoDB': '/images/icons/mongodb.svg',
      'Pandas': '/images/icons/pandas.svg',
      'NumPy': '/images/icons/numpy.svg',
      'LinkedIn': '/images/icons/linkedin.svg',
      'Scikit-learn': '/images/icons/scikit-learn.svg',
      'Matplotlib': '/images/icons/matplotlib.svg',
    });
    
    if (!slug) return;
    
    // Load projects from localStorage
    if (typeof window !== 'undefined') {
      const savedProjects = localStorage.getItem('projects_data');
      let projectsArray = [];
      
      if (savedProjects) {
        projectsArray = JSON.parse(savedProjects);
      } else {
        // Fallback to initial projects if none in localStorage
        projectsArray = [
          {
            id: 1,
            title: 'Sales Forecasting Model',
            description: 'Developed an ARIMA time series model that improved sales forecasting accuracy by 27%, enabling better inventory management.',
            imageUrl: '/images/projects/sales-forecast.jpg',
            tags: ['Python', 'Pandas', 'Scikit-learn', 'Matplotlib', 'MongoDB'],
            slug: 'sales-forecasting-model',
            details: 'This sales forecasting model was developed using ARIMA (AutoRegressive Integrated Moving Average) time series analysis to predict future sales based on historical data. The model achieved a 27% improvement in forecasting accuracy compared to previous methods.\n\nKey Features:\n- Data cleaning and preprocessing pipeline\n- Seasonal decomposition of time series data\n- Parameter optimization for ARIMA model\n- Visualization of forecasts vs. actual sales\n- Integration with inventory management systems'
          },
          {
            id: 2,
            title: 'Customer Segmentation',
            description: 'Applied K-means clustering to segment customers based on purchasing behavior, resulting in a 15% increase in marketing campaign effectiveness.',
            imageUrl: '/images/projects/customer-segmentation.jpg',
            tags: ['Python', 'NumPy', 'Pandas', 'Scikit-learn', 'Seaborn'],
            slug: 'customer-segmentation',
            details: 'This customer segmentation project used K-means clustering to group customers based on their purchasing behavior, demographics, and engagement metrics. The resulting segments were used to tailor marketing campaigns, resulting in a 15% increase in effectiveness.\n\nKey Features:\n- Data preprocessing and feature engineering\n- Principal Component Analysis for dimensionality reduction\n- K-means clustering with optimal k selection\n- Segment profiling and visualization\n- Integration with marketing automation tools'
          },
          {
            id: 3,
            title: 'Financial Dashboard',
            description: 'Created an interactive Power BI dashboard to visualize key financial metrics, enabling executives to make data-driven decisions quickly.',
            imageUrl: '/images/projects/financial-dashboard.jpg',
            tags: ['Power BI', 'SQL', 'DAX', 'Financial Analysis'],
            slug: 'financial-dashboard',
            details: 'This interactive financial dashboard was developed in Power BI to provide executives with real-time access to key financial metrics. The dashboard includes visualizations for revenue, expenses, profit margins, and cash flow, with drill-down capabilities for deeper analysis.\n\nKey Features:\n- ETL processes for data integration\n- Custom DAX measures for complex calculations\n- Interactive filters and slicers\n- Automated refresh scheduling\n- Mobile-optimized views for on-the-go access'
          }
        ];
      }
      
      const currentProject = projectsArray.find(p => p.slug === slug);
      
      if (currentProject) {
        setProject(currentProject);
      }
      
      setIsLoading(false);
    }
  }, [slug]);

  // Show 404 if project not found
  if (!isLoading && !project) {
    notFound();
  }

  if (isLoading || !project) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-100 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/projects"
          className="inline-flex items-center mb-6 text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Projects
        </Link>
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Project Hero Image */}
          <div className="relative h-64 sm:h-96 w-full">
            {project.imageUrl ? (
              <img 
                src={project.imageUrl}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
                <h1 className="text-3xl font-bold text-white text-center px-4">{project.title}</h1>
              </div>
            )}
          </div>
          
          {/* Project Content */}
          <div className="p-6 sm:p-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">{project.title}</h1>
            
            <div className="flex flex-wrap gap-2 mb-8">
              {project.tags && project.tags.map((tag) => (
                <span key={tag} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {toolIcons[tag] && (
                    <span className="mr-1.5 relative w-4 h-4 inline-block">
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
            
            <div className="prose prose-blue max-w-none">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Project Overview</h2>
              <p className="text-gray-700 mb-6">{project.description}</p>
              
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Project Details</h2>
              {project.details ? (
                <div>
                  {project.details.split('\n').map((paragraph, index) => (
                    paragraph ? <p key={index} className="mb-4 text-gray-700">{paragraph}</p> : <br key={index} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-700">Detailed information about this project is coming soon!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 