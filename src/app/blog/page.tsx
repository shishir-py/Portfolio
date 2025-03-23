'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function Blog() {
  const [posts, setPosts] = useState([]);
  
  // Default posts if none are found in localStorage
  const defaultPosts = [
    {
      id: 1,
      title: 'Data Visualization Best Practices',
      slug: 'data-visualization-best-practices',
      excerpt: 'Learn how to create effective data visualizations that communicate insights clearly and efficiently.',
      author: 'Tara Pandey',
      category: 'Data Visualization',
      date: 'May 15, 2024',
      image: '/images/blog/data-visualization.jpg',
      readTime: '5 min'
    },
    {
      id: 2,
      title: 'Predictive Analytics in Retail',
      slug: 'predictive-analytics-retail',
      excerpt: 'Discover how machine learning models can predict customer behavior and optimize retail operations.',
      author: 'Tara Pandey',
      category: 'Machine Learning',
      date: 'April 22, 2024',
      image: '/images/blog/predictive-analytics.jpg',
      readTime: '7 min'
    },
    {
      id: 3,
      title: 'The Future of Data Science',
      slug: 'future-of-data-science',
      excerpt: 'Exploring emerging trends in data science and how they will shape business intelligence in the coming years.',
      author: 'Tara Pandey',
      category: 'Trends',
      date: 'March 10, 2024',
      image: '/images/blog/future-data-science.jpg',
      readTime: '6 min'
    },
    {
      id: 4,
      title: 'Introduction to Time Series Analysis',
      slug: 'time-series-analysis-intro',
      excerpt: 'A beginner-friendly guide to understanding and implementing time series analysis in Python.',
      author: 'John Doe',
      category: 'Tutorial',
      date: 'Dec 10, 2022',
      image: '/images/blog/future-data-science.jpg',
      imageColor: 'from-purple-400 to-pink-500',
      readTime: '10 min read'
    },
    {
      id: 5,
      title: 'Building Interactive Dashboards with Tableau',
      slug: 'interactive-dashboards-tableau',
      excerpt: 'Step-by-step guide to creating interactive and insightful dashboards using Tableau.',
      author: 'John Doe',
      category: 'Tutorial',
      date: 'Nov 5, 2022',
      image: '/images/blog/predictive-analytics.jpg',
      imageColor: 'from-blue-400 to-cyan-500',
      readTime: '7 min read'
    },
    {
      id: 6,
      title: 'SQL for Data Analysts: Beyond the Basics',
      slug: 'sql-for-data-analysts',
      excerpt: 'Advanced SQL techniques that every data analyst should know to level up their data querying skills.',
      author: 'John Doe',
      category: 'Tutorial',
      date: 'Oct 22, 2022',
      image: '/images/blog/data-visualization.jpg',
      imageColor: 'from-emerald-500 to-teal-600',
      readTime: '9 min read'
    }
  ];

  // Load posts from localStorage or use default
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPosts = localStorage.getItem('blog_posts');
      if (savedPosts) {
        setPosts(JSON.parse(savedPosts));
      } else {
        // No saved posts found, save the default ones
        localStorage.setItem('blog_posts', JSON.stringify(defaultPosts));
        setPosts(defaultPosts);
      }
    }
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            <span className="text-blue-600">Blog</span> & Insights
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Thoughts, insights, and perspectives on data analysis, machine learning, and automation.
          </p>
        </div>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {posts.map(post => (
            <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 duration-300">
              <div className="h-48 relative">
                {post.image ? (
                  <Image 
                    src={post.image} 
                    alt={post.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className={`h-full w-full bg-gradient-to-r ${post.imageColor || 'from-blue-400 to-blue-600'} flex items-center justify-center`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wide text-blue-600">{post.category}</span>
                  <span className="text-xs text-gray-500">{post.date}</span>
                </div>
                
                <h2 className="text-xl font-bold text-gray-900 mb-3 h-14 line-clamp-2">
                  {post.title}
                </h2>
                
                <p className="text-gray-600 mb-5 h-20 line-clamp-3">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                      <span className="text-xs font-bold text-white">
                        {post.author.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <span className="ml-2 text-sm text-gray-700">{post.author}</span>
                  </div>
                  
                  <span className="text-xs text-gray-500">{post.readTime}</span>
                </div>
                
                <Link 
                  href={`/blog/${post.slug}`} 
                  className="mt-4 inline-block px-6 py-2 border border-blue-600 text-blue-600 font-medium text-sm leading-tight rounded hover:bg-blue-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors w-full text-center"
                >
                  Read More
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}