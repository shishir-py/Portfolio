'use client';

import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

interface DataChartProps {
  type: 'bar' | 'line' | 'pie' | 'doughnut' | 'radar' | 'polarArea';
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor?: string | string[];
      borderColor?: string | string[];
      borderWidth?: number;
      tension?: number;
      fill?: boolean;
      pointBackgroundColor?: string;
      pointBorderColor?: string;
      pointRadius?: number;
      pointHoverRadius?: number;
      borderRadius?: number;
    }[];
  };
  height?: number;
  width?: number;
  options?: any;
}

export default function DataChart({ 
  type, 
  data, 
  height = 400, 
  width = 400,
  options = {}
}: DataChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  // Process options to handle callback functions
  const processOptions = (options: any) => {
    const processedOptions = { ...options };
    
    // Handle tooltip callbacks
    if (options.plugins?.tooltip?.callbacks?.label) {
      // For doughnut/pie charts
      if (type === 'doughnut' || type === 'pie') {
        processedOptions.plugins = {
          ...processedOptions.plugins,
          tooltip: {
            ...processedOptions.plugins.tooltip,
            callbacks: {
              label: (context: any) => {
                const total = context.dataset.data.reduce((acc: number, data: number) => acc + data, 0);
                const value = context.raw;
                const percentage = Math.round((value / total) * 100);
                return context.label + ': ' + percentage + '%';
              }
            }
          }
        };
      } 
      // For other chart types
      else {
        processedOptions.plugins = {
          ...processedOptions.plugins,
          tooltip: {
            ...processedOptions.plugins.tooltip,
            callbacks: {
              label: (context: any) => {
                return context.dataset.label + ': ' + context.raw + '%';
              }
            }
          }
        };
      }
    }
    
    // Handle scales y-axis callback
    if (options.scales?.y?.ticks?.callback) {
      processedOptions.scales = {
        ...processedOptions.scales,
        y: {
          ...processedOptions.scales?.y,
          ticks: {
            ...processedOptions.scales?.y?.ticks,
            callback: (value: number) => {
              return value + '%';
            }
          }
        }
      };
    }
    
    return processedOptions;
  };

  useEffect(() => {
    if (!chartRef.current) return;
    
    // Destroy previous chart instance if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Create new chart with processed options
    const ctx = chartRef.current.getContext('2d');
    if (ctx) {
      const processedOptions = processOptions(options);
      
      chartInstance.current = new Chart(ctx, {
        type,
        data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          ...processedOptions
        }
      });
    }

    // Cleanup on unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [type, data, options]);

  return (
    <div style={{ height, width: '100%' }}>
      <canvas ref={chartRef} />
    </div>
  );
} 