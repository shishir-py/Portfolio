'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import ProjectForm from '../../components/ProjectForm';

// Mock data - in a real app, this would come from a database
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
  }
];

export default function ProjectsManagement() {
  const [projects, setProjects] = useState(initialProjects);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [actionStatus, setActionStatus] = useState({ message: '', type: '' });
  const [projectImages, setProjectImages] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Load projects from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedProjects = localStorage.getItem('projects_data');
      if (savedProjects) {
        setProjects(JSON.parse(savedProjects));
      } else {
        // Initialize with default projects if nothing in localStorage
        localStorage.setItem('projects_data', JSON.stringify(initialProjects));
      }
      
      // Load project images
      const savedImages = localStorage.getItem('project_images');
      if (savedImages) {
        try {
          const parsedImages = JSON.parse(savedImages);
          setProjectImages(parsedImages);
        } catch (error) {
          console.error('Error parsing project images from localStorage:', error);
        }
      }
    }
  }, []);
  
  // Save projects to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined' && projects) {
      localStorage.setItem('projects_data', JSON.stringify(projects));
    }
  }, [projects]);
  
  // Get image source based on imageUrl
  const getImageSource = useCallback((imageUrl) => {
    // If we have a data URL stored in localStorage, use that
    if (projectImages[imageUrl]) {
      return projectImages[imageUrl];
    }
    // Otherwise, use the original URL (which might be a file path)
    return imageUrl;
  }, [projectImages]);
  
  const handleAddNew = () => {
    setCurrentProject(null);
    setIsFormOpen(true);
  };
  
  const handleEdit = (project) => {
    setCurrentProject(project);
    setIsFormOpen(true);
  };
  
  const handleDelete = (project) => {
    setProjectToDelete(project);
    setIsDeleting(true);
  };
  
  const confirmDelete = () => {
    const updatedProjects = projects.filter(p => p.id !== projectToDelete.id);
    setProjects(updatedProjects);
    setIsDeleting(false);
    setProjectToDelete(null);
    
    // Save updated projects to localStorage
    const saveProjectsToLocalStorage = (updatedProjects) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('projects_data', JSON.stringify(updatedProjects));
      }
    };
    saveProjectsToLocalStorage(updatedProjects);
    
    // Show success message
    setSuccessMessage('Project deleted successfully');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };
  
  const handleSubmitProject = (projectData, isEditing) => {
    let updatedProjects;
    
    if (isEditing) {
      // Update existing project
      updatedProjects = projects.map(project => 
        project.id === projectData.id ? projectData : project
      );
    } else {
      // Add new project with generated ID
      const newProject = {
        ...projectData,
        id: Date.now(), // use timestamp as simple ID
      };
      updatedProjects = [...projects, newProject];
    }
    
    setProjects(updatedProjects);
    setIsFormOpen(false);
    
    // Save updated projects to localStorage
    const saveProjectsToLocalStorage = (updatedProjects) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('projects_data', JSON.stringify(updatedProjects));
      }
    };
    saveProjectsToLocalStorage(updatedProjects);
    
    // Save project image if it was uploaded
    if (projectData.imageFile && projectData.imagePreviewUrl) {
      const updatedImages = {...projectImages};
      updatedImages[projectData.imageUrl] = projectData.imagePreviewUrl;
      setProjectImages(updatedImages);
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('project_images', JSON.stringify(updatedImages));
      }
    }
    
    // Show success message
    setSuccessMessage(isEditing ? 'Project updated successfully' : 'Project added successfully');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };
  
  const handleFormCancel = () => {
    setIsFormOpen(false);
  };
  
  if (isFormOpen) {
    return (
      <div className="py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProjectForm 
            project={currentProject} 
            onSubmit={handleSubmitProject} 
            onCancel={handleFormCancel} 
          />
        </div>
      </div>
    );
  }
  
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Projects</h1>
          <button
            onClick={handleAddNew}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add New Project
          </button>
        </div>
        
        {showSuccess && (
          <div className={`mt-4 p-4 ${actionStatus.type === 'success' ? 'bg-green-50 border-l-4 border-green-500' : 'bg-red-50 border-l-4 border-red-500'} rounded-md`}>
            <div className="flex">
              <div className="flex-shrink-0">
                {actionStatus.type === 'success' ? (
                  <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <p className={`text-sm ${actionStatus.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>
                  {successMessage}
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-6 bg-white rounded-lg shadow overflow-hidden">
          {projects.length === 0 ? (
            <div className="p-8 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No projects</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating a new project.
              </p>
              <div className="mt-6">
                <button
                  onClick={handleAddNew}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Add Project
                </button>
              </div>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {projects.map((project) => (
                <li key={project.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-16 h-16 bg-blue-100 rounded overflow-hidden mr-4 flex-shrink-0">
                        {project.imageUrl ? (
                          <img 
                            src={getImageSource(project.imageUrl)} 
                            alt={project.title}
                            className="w-full h-full object-cover"
                            key={`${project.id}-${project.imageUrl}`} // Add project ID to force re-render
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-blue-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div>
                        <h2 className="text-xl font-medium text-gray-900">{project.title}</h2>
                        <p className="text-sm text-gray-500 mt-1">
                          {project.description.length > 100 
                            ? `${project.description.substring(0, 100)}...` 
                            : project.description}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {project.tags.map(tag => (
                            <span 
                              key={tag} 
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Link 
                        href={`/projects/${project.slug}`}
                        className="text-gray-400 hover:text-gray-500"
                        target="_blank"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                          <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                        </svg>
                      </Link>
                      <button
                        onClick={() => handleEdit(project)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(project)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {isDeleting && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Delete Project
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete "{projectToDelete?.title}"? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={confirmDelete}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsDeleting(false);
                    setProjectToDelete(null);
                  }}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 