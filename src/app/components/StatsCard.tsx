'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

interface StatsCardProps {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  description?: string;
  color?: string;
  icon?: React.ReactNode;
}

export default function StatsCard({ 
  title, 
  value, 
  prefix = '', 
  suffix = '', 
  description = '',
  color = 'bg-blue-600',
  icon
}: StatsCardProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [currentValue, setCurrentValue] = useState(0);
  
  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      const duration = 1500;
      const step = Math.max(1, Math.floor(end / (duration / 16)));
      
      const timer = setInterval(() => {
        start += step;
        if (start > end) {
          clearInterval(timer);
          setCurrentValue(end);
        } else {
          setCurrentValue(start);
        }
      }, 16);
      
      return () => clearInterval(timer);
    }
  }, [isInView, value]);
  
  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
      transition={{ duration: 0.5 }}
      className={`${color} rounded-lg shadow-lg p-6 text-white transition-all duration-300 hover:shadow-xl`}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium opacity-90">{title}</h3>
          <p className="text-3xl font-bold mt-2">
            {prefix}{currentValue.toLocaleString()}{suffix}
          </p>
          {description && (
            <p className="mt-2 text-sm opacity-80">{description}</p>
          )}
        </div>
        {icon && (
          <div className="text-3xl opacity-90">{icon}</div>
        )}
      </div>
    </motion.div>
  );
} 