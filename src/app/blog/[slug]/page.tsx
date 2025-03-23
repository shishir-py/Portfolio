'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, notFound } from 'next/navigation';

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    
    // Load blog posts from localStorage
    if (typeof window !== 'undefined') {
      const savedPosts = localStorage.getItem('blog_posts');
      let postsArray = [];
      
      if (savedPosts) {
        postsArray = JSON.parse(savedPosts);
      } else {
        // Fallback to initial posts if none in localStorage
        postsArray = [
          {
            id: 1,
            title: 'Data Visualization Best Practices',
            slug: 'data-visualization-best-practices',
            excerpt: 'Learn how to create effective data visualizations that communicate insights clearly and efficiently.',
            content: `Data visualization is a critical skill for any data analyst or data scientist. When done correctly, visualizations can reveal patterns, trends, and insights that might be hidden in raw data.

Here are some key best practices for creating effective data visualizations:

1. **Know your audience**: Consider who will be viewing your visualization and what their needs are. Executives might need high-level summaries, while analysts might need detailed views.

2. **Choose the right chart type**: Different data types call for different visualization methods. Time series data works well with line charts, while comparisons between categories are better suited for bar charts.

3. **Minimize chart junk**: Remove unnecessary elements like gridlines, borders, and decorative elements that don't add informational value.

4. **Use color strategically**: Color should be used purposefully to highlight important data points or to represent different categories. Avoid using too many colors, which can be distracting.

5. **Label clearly**: Make sure your charts have clear titles, axis labels, and legends. Your audience should understand what they're looking at without additional explanation.

6. **Provide context**: Include relevant benchmarks, trends, or comparisons to help your audience understand the significance of the data.

7. **Be honest with the data**: Don't manipulate scales or cherry-pick data points to support a predetermined narrative.

By following these best practices, you can create visualizations that effectively communicate your data's story and drive better decision-making.`,
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
            content: `Predictive analytics is revolutionizing the retail industry by enabling businesses to anticipate customer needs, optimize inventory, and personalize marketing efforts. By leveraging historical data and applying machine learning algorithms, retailers can make data-driven decisions that improve efficiency and increase revenue.

## Key Applications of Predictive Analytics in Retail

### Customer Behavior Prediction

Retailers can analyze past purchasing patterns to predict future buying behavior. This includes:

- **Purchase Propensity Models**: Identifying which customers are likely to buy specific products
- **Churn Prediction**: Determining which customers are at risk of leaving
- **Lifetime Value Estimation**: Calculating the long-term value of customer relationships

### Inventory Optimization

Accurate demand forecasting allows retailers to maintain optimal inventory levels:

- **Seasonal Trend Analysis**: Adjusting stock levels based on seasonal patterns
- **Replenishment Planning**: Automatically triggering reorders at the right time
- **Stock-out Prevention**: Reducing lost sales due to unavailable products

### Price Optimization

Dynamic pricing strategies can maximize profit margins:

- **Competitive Price Analysis**: Adjusting prices based on competitor monitoring
- **Elasticity Modeling**: Understanding how price changes affect demand
- **Promotion Impact Assessment**: Measuring the effectiveness of discounts and promotions

## Implementation Challenges

While powerful, implementing predictive analytics in retail comes with challenges:

1. **Data Integration**: Combining data from multiple sources (in-store purchases, online transactions, customer service interactions)
2. **Data Quality**: Ensuring accurate and consistent data inputs
3. **Model Maintenance**: Regularly updating and recalibrating predictive models
4. **Organizational Adoption**: Building a data-driven culture throughout the organization

## Getting Started

Retailers looking to implement predictive analytics should:

1. Start with clearly defined business objectives
2. Invest in data collection and storage infrastructure
3. Build a team with the right analytical skills
4. Begin with simpler use cases and gradually increase complexity
5. Measure results and continuously improve models

By embracing predictive analytics, retailers can gain a significant competitive advantage in an increasingly challenging market landscape.`,
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
            content: `The field of data science is evolving rapidly, driven by technological advancements and increasing business demands. As we look toward the future, several key trends are emerging that will shape how organizations extract value from their data.

## Automated Machine Learning (AutoML)

AutoML platforms are democratizing machine learning by automating the process of building and deploying models. This allows domain experts without extensive programming skills to leverage the power of ML for business problems.

Key developments include:
- Automated feature engineering and selection
- Hyperparameter optimization
- Model selection and evaluation
- Deployment and monitoring capabilities

## Explainable AI (XAI)

As machine learning models become more complex, the need for transparency and interpretability grows. Explainable AI techniques help users understand why a model made a particular prediction, which is crucial for:

- Regulatory compliance
- Building user trust
- Identifying and correcting biases
- Improving model performance

## Edge Analytics

Processing data at the edge (close to where it's generated) rather than in centralized data centers is becoming increasingly important, especially for:

- IoT applications
- Real-time decision making
- Reducing bandwidth usage
- Privacy-sensitive applications

## Augmented Analytics

The combination of natural language processing and automated insights is creating more intuitive analytics tools that can:

- Generate natural language explanations of data patterns
- Suggest relevant visualizations
- Answer questions posed in everyday language
- Proactively identify insights and anomalies

## Data Ethics and Governance

As data science becomes more powerful, ethical considerations are moving to the forefront:

- Privacy protection mechanisms
- Bias detection and mitigation
- Transparent data collection practices
- Ethical frameworks for AI applications

## Quantum Computing for Data Science

Though still in early stages, quantum computing promises to revolutionize certain data science applications:

- Complex optimization problems
- Simulation of quantum systems
- Factoring large numbers (with implications for cryptography)
- Quantum machine learning algorithms

## The Evolving Role of Data Scientists

As tools become more automated, the role of data scientists is evolving to focus more on:

- Problem formulation
- Business context and domain knowledge
- Communication and storytelling
- Ethical implementations of data science

Organizations that stay ahead of these trends will be best positioned to harness the full potential of data science in the coming decade.`,
            author: 'Tara Pandey',
            category: 'Trends',
            date: 'March 10, 2024',
            image: '/images/blog/future-data-science.jpg',
            readTime: '6 min'
          }
        ];
      }
      
      const currentPost = postsArray.find(p => p.slug === slug);
      
      if (currentPost) {
        setPost(currentPost);
      }
      
      setIsLoading(false);
    }
  }, [slug]);

  // Show 404 if post not found
  if (!isLoading && !post) {
    notFound();
  }

  if (isLoading || !post) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-100 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/blog"
          className="inline-flex items-center mb-6 text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Blog
        </Link>
        
        <article className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Hero Image */}
          <div className="relative h-64 sm:h-96 w-full">
            {post.image ? (
              <img 
                src={post.image} 
                alt={post.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className={`h-full w-full bg-gradient-to-r ${post.imageColor || 'from-blue-400 to-blue-600'} flex items-center justify-center`}>
                <h1 className="text-3xl font-bold text-white text-center px-4">{post.title}</h1>
              </div>
            )}
          </div>
          
          {/* Post Content */}
          <div className="p-6 sm:p-10">
            <div className="flex flex-wrap items-center text-sm text-gray-500 mb-5 space-x-4">
              <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">{post.category}</span>
              <span>{post.date}</span>
              <span>•</span>
              <span>{post.readTime}</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">{post.title}</h1>
            
            <div className="flex items-center mb-8">
              <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center mr-3">
                <span className="text-sm font-bold text-white">
                  {post.author.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <span className="text-gray-700 font-medium">{post.author}</span>
            </div>
            
            <div className="prose prose-blue max-w-none">
              {post.content ? (
                <div>
                  {(() => {
                    const result = [];
                    let currentList = null;
                    let currentListItems = [];
                    
                    post.content.split('\n').forEach((paragraph, index) => {
                      // Skip empty lines but add them as breaks if not in a list
                      if (!paragraph.trim()) {
                        if (currentList) {
                          // End the current list
                          result.push(
                            <ul key={`list-${result.length}`} className="list-disc ml-6 my-4">
                              {currentListItems}
                            </ul>
                          );
                          currentList = null;
                          currentListItems = [];
                        } else {
                          result.push(<br key={`br-${index}`} />);
                        }
                        return;
                      }
                      
                      // Handle Markdown headings (## Heading)
                      if (paragraph.startsWith('##')) {
                        if (currentList) {
                          // End the current list before adding a heading
                          result.push(
                            <ul key={`list-${result.length}`} className="list-disc ml-6 my-4">
                              {currentListItems}
                            </ul>
                          );
                          currentList = null;
                          currentListItems = [];
                        }
                        
                        result.push(
                          <h2 key={`h2-${index}`} className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                            {paragraph.replace('##', '').trim()}
                          </h2>
                        );
                        return;
                      }
                      
                      // Handle Markdown subheadings (### Subheading)
                      if (paragraph.startsWith('###')) {
                        if (currentList) {
                          // End the current list before adding a subheading
                          result.push(
                            <ul key={`list-${result.length}`} className="list-disc ml-6 my-4">
                              {currentListItems}
                            </ul>
                          );
                          currentList = null;
                          currentListItems = [];
                        }
                        
                        result.push(
                          <h3 key={`h3-${index}`} className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                            {paragraph.replace('###', '').trim()}
                          </h3>
                        );
                        return;
                      }
                      
                      // Handle bullet points
                      if (paragraph.startsWith('-')) {
                        if (!currentList) {
                          currentList = 'ul';
                          currentListItems = [];
                        }
                        
                        // Process bold text in list items too
                        const processedText = paragraph.substring(1).trim().replace(
                          /\*\*(.*?)\*\*/g, 
                          (match, content) => `<strong>${content}</strong>`
                        );
                        
                        currentListItems.push(
                          <li 
                            key={`li-${index}`} 
                            className="mb-1"
                            dangerouslySetInnerHTML={{ __html: processedText }}
                          />
                        );
                        return;
                      }
                      
                      // Handle numbered lists
                      if (/^\d+\./.test(paragraph)) {
                        if (currentList) {
                          // End the current list before starting a numbered item
                          result.push(
                            <ul key={`list-${result.length}`} className="list-disc ml-6 my-4">
                              {currentListItems}
                            </ul>
                          );
                          currentList = null;
                          currentListItems = [];
                        }
                        
                        // Process bold text in numbered items
                        const processedText = paragraph.replace(/^\d+\./, '').trim().replace(
                          /\*\*(.*?)\*\*/g, 
                          (match, content) => `<strong>${content}</strong>`
                        );
                        
                        result.push(
                          <div key={`num-${index}`} className="flex mb-2">
                            <span className="font-bold mr-2">{paragraph.match(/^\d+\./)[0]}</span>
                            <span dangerouslySetInnerHTML={{ __html: processedText }} />
                          </div>
                        );
                        return;
                      }
                      
                      // Regular paragraphs
                      if (currentList) {
                        // End the current list before adding a paragraph
                        result.push(
                          <ul key={`list-${result.length}`} className="list-disc ml-6 my-4">
                            {currentListItems}
                          </ul>
                        );
                        currentList = null;
                        currentListItems = [];
                      }
                      
                      // Process bold text in paragraphs
                      const processedText = paragraph.replace(
                        /\*\*(.*?)\*\*/g, 
                        (match, content) => `<strong>${content}</strong>`
                      );
                      
                      result.push(
                        <p 
                          key={`p-${index}`} 
                          className="mb-4 text-gray-700" 
                          dangerouslySetInnerHTML={{ __html: processedText }}
                        />
                      );
                    });
                    
                    // Don't forget to add the last list if there is one
                    if (currentList) {
                      result.push(
                        <ul key={`list-${result.length}`} className="list-disc ml-6 my-4">
                          {currentListItems}
                        </ul>
                      );
                    }
                    
                    return result;
                  })()}
                </div>
              ) : (
                <div>
                  <p className="mb-4">{post.excerpt}</p>
                  <p className="mb-4">This blog post is currently under development. Check back later for the full content!</p>
                </div>
              )}
            </div>
            
            <div className="mt-10 pt-6 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="mb-4 sm:mb-0">
                  <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Share this post</h2>
                  <div className="flex space-x-4 mt-2">
                    <a href="#" className="text-gray-400 hover:text-blue-500">
                      <span className="sr-only">Twitter</span>
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </a>
                    <a href="#" className="text-gray-400 hover:text-blue-500">
                      <span className="sr-only">LinkedIn</span>
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    </a>
                    <a href="#" className="text-gray-400 hover:text-blue-500">
                      <span className="sr-only">Facebook</span>
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                      </svg>
                    </a>
                  </div>
                </div>
                <Link
                  href="/blog"
                  className="inline-flex items-center px-4 py-2 border border-blue-600 text-blue-600 bg-white rounded-md font-medium hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                  More Articles
                </Link>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
} 