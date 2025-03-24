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
    
    const fetchProject = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/projects/slug/${slug}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setProject(null);
          }
          throw new Error('Failed to fetch project');
        }
        
        const data = await response.json();
        setProject(data);
      } catch (error) {
        console.error('Error fetching project:', error);
        setProject(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProject();
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
              <Image 
                src={project.imageUrl}
                alt={project.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 1200px"
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
              {project.details || project.detailedDescription ? (
                <div>
                  {(project.details || project.detailedDescription).split('\n').map((paragraph, index) => (
                    paragraph ? <p key={index} className="mb-4 text-gray-700">{paragraph}</p> : <br key={index} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-700">Detailed information about this project is coming soon!</p>
              )}
            </div>

            {/* Demo and GitHub links if available */}
            {(project.demoUrl || project.githubUrl) && (
              <div className="mt-8 flex flex-wrap gap-4">
                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    View Live Demo
                  </a>
                )}
                
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    View on GitHub
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 