import React from 'react';
import { Shield, AlertTriangle, XCircle } from 'lucide-react';

interface TruthScoreProps {
  score: number;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
}

const TruthScore: React.FC<TruthScoreProps> = ({ 
  score, 
  size = 'medium',
  showLabel = false 
}) => {
  let color = '';
  let icon = null;
  let label = '';

  if (score >= 80) {
    color = 'from-green-500 to-green-400';
    icon = <Shield size={size === 'small' ? 12 : 16} />;
    label = 'Verified';
  } else if (score >= 50) {
    color = 'from-yellow-500 to-yellow-400';
    icon = <AlertTriangle size={size === 'small' ? 12 : 16} />;
    label = 'Partially Verified';
  } else {
    color = 'from-red-500 to-red-400';
    icon = <XCircle size={size === 'small' ? 12 : 16} />;
    label = 'Unverified';
  }

  const sizeClasses = {
    small: 'text-xs px-2 py-0.5',
    medium: 'text-sm px-3 py-1',
    large: 'text-base px-4 py-1.5'
  };

  return (
    <div 
      className={`
        bg-gradient-to-r ${color} text-white font-bold 
        ${sizeClasses[size]} rounded-full 
        flex items-center shadow-lg
        hover:shadow-xl transition-all duration-300
        hover:scale-105 cursor-help
      `}
      title={`Truth Score: ${score}% - ${label}`}
    >
      {icon}
      <span className="ml-1">{score}%</span>
      {showLabel && <span className="ml-1 hidden sm:inline">· {label}</span>}
    </div>
  );
};

export default TruthScore;