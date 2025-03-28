'use client';

import { useState, useEffect } from 'react';
import { init, send } from 'emailjs-com';

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
  const [errorMessage, setErrorMessage] = useState('');
  const [contactInfo, setContactInfo] = useState({
    email: 'sheahead22@gmail.com',
    phone: '+1 (555) 123-4567',
    linkedin: 'https://www.linkedin.com/in/Brainwave1999'
  });
  const [errors, setErrors] = useState({
    email: ''
  });

  // Initialize EmailJS on component mount
  useEffect(() => {
    // Check if EmailJS user ID is available
    const userId = process.env.NEXT_PUBLIC_EMAILJS_USER_ID;
    if (userId) {
      // Initialize EmailJS with the user ID
      init(userId);
      console.log('EmailJS initialized');
    } else {
      console.warn('EmailJS user ID not found. Email functionality will not work.');
    }
  }, []);

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

  const validateEmail = (email: string) => {
    const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email.toLowerCase());
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear errors when user types
    if (name === 'email' && errors.email) {
      setErrors(prev => ({ ...prev, email: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email
    if (!validateEmail(formState.email)) {
      setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
      return;
    }

    setIsSubmitting(true);
    setIsSuccess(false);
    setIsError(false);
    setErrorMessage('');

    try {
      // EmailJS configuration
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
      
      // Check if EmailJS configuration is available
      if (!serviceId || !templateId) {
        console.error('EmailJS service or template ID is missing. Please check your environment variables.');
        throw new Error('Email service configuration is missing');
      }
      
      // Prepare template parameters
      const templateParams = {
        from_name: formState.name,
        from_email: formState.email,
        to_email: contactInfo.email,
        subject: formState.subject,
        message: formState.message
      };

      // Log the email attempt for debugging
      console.log('Attempting to send email with EmailJS');
      console.log('Using service ID:', serviceId);
      console.log('Using template ID:', templateId);
      
      // Send email using EmailJS (using named import)
      const response = await send(
        serviceId, 
        templateId, 
        templateParams
      );
      
      console.log('Email sent successfully:', response);
      
      // Reset form
      setFormState({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      setIsSuccess(true);
    } catch (error: any) {
      // More detailed error logging
      console.error('Email sending error:', error);
      
      if (error.text) {
        console.error('EmailJS error text:', error.text);
      }
      
      if (error.name) {
        console.error('Error name:', error.name);
      }
      
      if (error.message) {
        console.error('Error message:', error.message);
      }
      
      setIsError(true);
      
      // Set a more specific error message for the user
      if (error.message) {
        if (error.message.includes('configuration is missing')) {
          setErrorMessage('The email service is not properly configured. Please contact the site administrator.');
        } else if (error.message.includes('Network Error')) {
          setErrorMessage('Could not connect to the email service. Please check your internet connection and try again.');
        } else {
          setErrorMessage(`Error: ${error.message}`);
        }
      } else if (error.text) {
        setErrorMessage(`Error: ${error.text}`);
      } else {
        setErrorMessage('Something went wrong while sending your message. Please try again later.');
      }
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
                      className={`py-3 px-4 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md bg-white text-gray-900 ${errors.email ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                      placeholder="Your email address"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
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
                
                {/* Show error message if email sending failed */}
                {isError && (
                  <div className="mt-3 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    <p>{errorMessage || 'Sorry, we couldn\'t send your message. Please try again later or contact directly via email.'}</p>
                    <p className="text-sm mt-1">You can also email directly to: {contactInfo.email}</p>
                  </div>
                )}
                
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`mt-6 w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white ${
                      isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      'Send Message'
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 