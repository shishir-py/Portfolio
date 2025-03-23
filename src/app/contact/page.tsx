'use client';

import { useState, useEffect } from 'react';

export default function Contact() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    email: 'sheahead22@gmail.com',
    phone: '+1 (555) 123-4567',
    linkedin: 'https://www.linkedin.com/in/Brainwave1999'
  });

  // Load profile data from localStorage if available
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedProfile = localStorage.getItem('profile_data');
      if (savedProfile) {
        const profileData = JSON.parse(savedProfile);
        setContactInfo({
          email: profileData.email || contactInfo.email,
          phone: profileData.phone || contactInfo.phone,
          linkedin: profileData.linkedin || contactInfo.linkedin
        });
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsSuccess(false);
    setIsError(false);

    try {
      // In a real application, you would send this data to your backend
      // This is a simulation of an API call
      console.log('Sending email to:', contactInfo.email);
      console.log('Form data:', formState);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Reset form
      setFormState({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      setIsSuccess(true);
    } catch (error) {
      setIsError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-lg mx-auto">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg p-10 text-center border-t-4 border-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-600 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="mt-4 text-2xl font-medium text-gray-900">Thank you for your message!</h2>
              <p className="mt-2 text-gray-600">Your message has been sent to {contactInfo.email}</p>
              <p className="mt-2 text-gray-600">I'll get back to you as soon as possible.</p>
              <button
                onClick={() => setIsSuccess(false)}
                className="mt-6 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Send Another Message
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg mx-auto md:max-w-none md:grid md:grid-cols-2 md:gap-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Get In Touch</h2>
            <p className="mt-3 text-lg text-gray-600 bg-white p-5 border-l-4 border-blue-600 font-medium leading-relaxed">
              I'm always interested in discussing new projects, consulting opportunities, or just talking about data analytics. Feel free to reach out!
            </p>
            <div className="mt-9">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="ml-3 text-base text-gray-500">
                  <p>{contactInfo.email}</p>
                </div>
              </div>
              <div className="mt-6 flex items-center">
                <div className="flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div className="ml-3 text-base text-gray-500">
                  <p id="contact-phone">{contactInfo.phone}</p>
                </div>
              </div>
              <div className="mt-6 flex items-center">
                <div className="flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <div className="ml-3 text-base text-gray-500">
                  <p>{contactInfo.linkedin}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-12 sm:mt-16 md:mt-0">
            <form onSubmit={handleSubmit} className="bg-white shadow overflow-hidden sm:rounded-lg p-6 border-t-4 border-blue-600">
              <div className="grid grid-cols-1 gap-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      required
                      value={formState.name}
                      onChange={handleChange}
                      className="py-3 px-4 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md bg-white text-gray-900"
                      placeholder="Your name"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <div className="mt-1">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      required
                      value={formState.email}
                      onChange={handleChange}
                      className="py-3 px-4 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md bg-white text-gray-900"
                      placeholder="Your email address"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                    Subject
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="subject"
                      id="subject"
                      required
                      value={formState.subject}
                      onChange={handleChange}
                      className="py-3 px-4 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md bg-white text-gray-900"
                      placeholder="Message subject"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                    Message
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      required
                      value={formState.message}
                      onChange={handleChange}
                      className="py-3 px-4 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border border-gray-300 rounded-md bg-white text-gray-900"
                      placeholder="Your message"
                    />
                  </div>
                </div>
                
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Sending...' : 'Submit'}
                  </button>
                </div>
              </div>
              
              {isError && (
                <div className="mt-4 text-red-600 text-sm font-medium bg-red-50 p-3 rounded-md">
                  There was an error sending your message. Please try again or email directly to {contactInfo.email}.
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 