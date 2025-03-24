'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface Step {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

interface DataPipelineProps {
  steps: Step[];
  title?: string;
  description?: string;
  className?: string;
}

export default function DataPipeline({
  steps,
  title = "Data Analysis Pipeline",
  description = "A visual representation of my data analysis workflow",
  className = '',
}: DataPipelineProps) {
  const [activeStep, setActiveStep] = useState<string | null>(null);

  const handleStepClick = (stepId: string) => {
    setActiveStep(activeStep === stepId ? null : stepId);
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-8">{description}</p>
      
      <div className="flex flex-col md:flex-row items-start justify-between relative">
        {/* Connecting line */}
        <div className="hidden md:block absolute top-12 left-16 right-16 h-1 bg-gray-200 z-0"></div>
        
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            className="flex flex-col items-center mb-8 md:mb-0 cursor-pointer z-10"
            whileHover={{ y: -5 }}
            onClick={() => handleStepClick(step.id)}
          >
            <motion.div 
              className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 ${step.color} text-white relative`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-2xl">{step.icon}</span>
              <div className="absolute -top-2 -right-2 bg-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-white font-bold text-xs">
                {index + 1}
              </div>
            </motion.div>
            <h4 className="text-center font-semibold text-gray-800">{step.title}</h4>
            
            {activeStep === step.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 text-sm text-gray-600 text-center max-w-xs"
              >
                {step.description}
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
} 