'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

interface SkillMeterProps {
  skill: string;
  percentage: number;
  color?: string;
}

export default function SkillMeter({ 
  skill, 
  percentage, 
  color = 'bg-blue-600' 
}: SkillMeterProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [progressValue, setProgressValue] = useState(0);
  
  useEffect(() => {
    if (isInView) {
      setProgressValue(percentage);
    }
  }, [isInView, percentage]);
  
  return (
    <div ref={ref} className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="font-medium text-gray-800">{skill}</span>
        <span className="text-gray-500">{percentage}%</span>
      </div>
      
      <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
        <motion.div 
          className={`h-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${progressValue}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  );
} 