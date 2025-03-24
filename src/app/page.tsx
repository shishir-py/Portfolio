import Link from 'next/link';
import Image from 'next/image';
import dbConnect from '../lib/mongodb';
import mongoose from 'mongoose';
import { Metadata } from 'next';

// Default profile data as fallback
const defaultProfile = {
  name: 'Tara Prasad Pandey',
  title: 'Data Analyst',
  bio: 'Results-driven Data Analyst specializing in automation, machine learning models, and data visualization with advanced skills in Python, SQL, and Power BI.',
  imageUrl: '/images/profile/admin-profile.jpg'
};

// Helper function to serialize MongoDB documents
function serializeDocument(doc: any) {
  if (!doc) return null;
  
  return Object.fromEntries(
    Object.entries(doc).map(([key, value]) => {
      // Convert ObjectId to string
      if (key === '_id') {
        return [key, value.toString()];
      }
      // Handle nested objects (if any)
      if (value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
        return [key, serializeDocument(value)];
      }
      // Handle arrays (if any)
      if (Array.isArray(value)) {
        return [key, value.map(item => 
          typeof item === 'object' && item !== null ? serializeDocument(item) : item
        )];
      }
      // Regular values
      return [key, value];
    })
  );
}

// Fetch profile data
async function getProfileData() {
  try {
    await dbConnect();
    const profile = await mongoose.connection.collection('profile').findOne({});
    return profile ? serializeDocument(profile) : defaultProfile;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return defaultProfile;
  }
}

// Fetch featured projects
async function getFeaturedProjects() {
  try {
    await dbConnect();
    
    // Check if collection exists and has documents
    const collections = await mongoose.connection.db.listCollections().toArray();
    const projectsCollectionExists = collections.some(c => c.name === 'projects');
    
    if (!projectsCollectionExists) {
      console.log('Projects collection does not exist yet, returning empty array');
      return [];
    }
    
    const projects = await mongoose.connection.collection('projects')
      .find({ 
        $or: [
          { featured: true },
          { addToHome: true }
        ],
        published: true // Only show published projects
      })
      .sort({ createdAt: -1 })
      .limit(3)
      .toArray();
    
    console.log('Found projects for homepage:', projects.length);
    
    // Return empty array if no featured projects
    return projects.length > 0 ? projects.map(project => serializeDocument(project)) : [];
  } catch (error) {
    console.error('Error fetching featured projects:', error);
    return [];
  }
}

// Fetch latest blog posts
async function getLatestBlogPosts() {
  try {
    await dbConnect();
    
    // Check if collection exists and has documents
    const collections = await mongoose.connection.db.listCollections().toArray();
    const blogsCollectionExists = collections.some(c => c.name === 'blogposts');
    
    if (!blogsCollectionExists) {
      console.log('Blogs collection does not exist yet, returning empty array');
      return [];
    }
    
    const posts = await mongoose.connection.collection('blogposts')
      .find({ 
        $or: [
          { featured: true },
          { addToHome: true }
        ],
        published: true 
      })
      .sort({ createdAt: -1 })
      .limit(3)
      .toArray();
    
    console.log('Found blogs for homepage:', posts.length);
    
    // Return empty array if no featured posts
    return posts.length > 0 ? posts.map(post => serializeDocument(post)) : [];
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

export const metadata: Metadata = {
  title: 'Data Analyst Portfolio | Home',
  description: 'Professional portfolio showcasing data analytics expertise, machine learning projects, and data visualization work',
};

export default async function Home() {
  const profile = await getProfileData();
  const featuredProjects = await getFeaturedProjects();
  const latestPosts = await getLatestBlogPosts();
  
  return (
    <div>
      {/* Hero section */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:max-w-2xl md:flex-1 md:pr-8">
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Hello, I'm</span>
                <span className="block text-blue-600 mt-1">{profile.name}</span>
              </h1>
              <p className="mt-3 text-base text-gray-700 sm:mt-5 sm:text-xl md:mt-5 md:text-2xl font-light">
                {profile.title}
              </p>
              <p className="mt-3 text-base text-gray-700 sm:mt-5 sm:text-lg">
                {profile.bio}
              </p>
              <div className="mt-8 sm:mt-10 flex space-x-4">
                <Link 
                  href="/projects" 
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  View Projects
                </Link>
                <Link 
                  href="/contact" 
                  className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Contact Me
                </Link>
              </div>
            </div>
            <div className="mt-10 md:mt-0 md:flex-shrink-0">
              <div className="relative h-64 w-64 mx-auto rounded-full overflow-hidden shadow-xl border-4 border-white md:h-80 md:w-80">
                {profile.imageUrl ? (
                  <Image
                    src={profile.imageUrl} 
                    alt={profile.name} 
                    fill 
                    sizes="(max-width: 768px) 100vw, 300px"
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-blue-600">
                    <span className="text-4xl font-bold text-white">
                      {profile.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects section */}
      {featuredProjects.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Featured Projects
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
                Check out some of my recent work
              </p>
            </div>
            
            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {featuredProjects.map((project) => (
                <div key={project._id} className="flex flex-col rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105 duration-300">
                  <div className="flex-shrink-0 h-48 relative">
                    {project.imageUrl ? (
                      <Image 
                        src={project.imageUrl} 
                        alt={project.title} 
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className={`h-full w-full ${project.imageColor || 'bg-blue-700'} flex items-center justify-center`}>
                        <span className="text-2xl font-bold text-white">
                          {project.title.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                    <div className="flex-1">
                      <div className="flex flex-wrap gap-2 mb-2">
                        {project.tags && project.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <Link href={`/projects/${project.slug}`}>
                        <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                          {project.title}
                        </h3>
                      </Link>
                      
                      <p className="mt-3 text-base text-gray-500">
                        {project.description}
                      </p>
                    </div>
                    
                    <div className="mt-6 flex items-center justify-between">
                      <Link 
                        href={`/projects/${project.slug}`} 
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        View Project →
                      </Link>
                      
                      {project.demoUrl && (
                        <a 
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-4 text-sm text-gray-600 hover:text-gray-900"
                        >
                          Live Demo
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <Link 
                href="/projects"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                View All Projects
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Latest Blog Posts section */}
      {latestPosts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Latest Blog Posts
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
                Insights and thoughts on data analytics
              </p>
            </div>
            
            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {latestPosts.map((post) => (
                <article key={post._id} className="flex flex-col rounded-lg shadow-lg overflow-hidden">
                  <div className="flex-shrink-0 h-48 relative">
                    {post.imageUrl ? (
                      <Image
                        src={post.imageUrl}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className={`${post.imageColor || 'bg-indigo-700'} h-48 w-full flex items-center justify-center text-white text-2xl font-bold`}>
                        {post.title.charAt(0)}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                    <div className="flex-1">
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <span>{post.category || 'Data Analysis'}</span>
                        <span className="mx-1">•</span>
                        <span>{new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}</span>
                      </div>
                      
                      <Link href={`/blog/${post.slug}`}>
                        <h3 className="text-xl font-semibold text-gray-900 hover:text-indigo-600 transition-colors">
                          {post.title}
                        </h3>
                      </Link>
                      
                      <p className="mt-3 text-base text-gray-500">
                        {post.excerpt}
                      </p>
                    </div>
                    
                    <div className="mt-6">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-indigo-600 hover:text-indigo-800 font-medium"
                      >
                        Read more →
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <Link 
                href="/blog"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Read All Posts
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Contact CTA section */}
      <section className="bg-blue-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Let's Work Together
            </h2>
            <p className="mt-4 text-xl text-blue-100">
              Have a project in mind? I'd love to hear about it.
            </p>
            <div className="mt-8">
              <Link 
                href="/contact" 
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-700 focus:ring-white"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
