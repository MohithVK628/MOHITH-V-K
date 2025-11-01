import React from 'react';
import { Milestone } from '../types';
import { FilmIcon } from './IconComponents';

interface TimelineProps {
  milestones: Milestone[];
  onMilestoneClick: (milestone: Milestone) => void;
}

const Timeline: React.FC<TimelineProps> = ({ milestones, onMilestoneClick }) => {
  if (milestones.length === 0) {
    return (
        <div className="text-center py-10 text-gray-400">
            <p>No milestones found.</p>
        </div>
    );
  }

  return (
    <div className="relative border-l-2 border-yellow-500/30 ml-6 pr-4">
      {milestones.map((milestone, index) => (
        <div key={index} className="mb-10 ml-8 cursor-pointer group" onClick={() => onMilestoneClick(milestone)}>
          <span className="absolute flex items-center justify-center w-8 h-8 bg-gray-800 rounded-full -left-4 ring-4 ring-black group-hover:bg-yellow-500 transition-colors">
            <FilmIcon />
          </span>
          <div className="p-4 bg-gray-900 border border-gray-800 rounded-lg shadow-md group-hover:border-yellow-500/50 transition-colors">
            <div className="flex items-baseline mb-1">
              <time className="block text-xl font-bold leading-none text-yellow-400">{milestone.year}</time>
              <h3 className="ml-4 text-lg font-semibold text-white">{milestone.title}</h3>
            </div>
            <p className="text-sm text-gray-400">{milestone.description.en}</p>
            <p className="text-sm text-gray-400 mt-1">{milestone.description.kn}</p>
            <div className="mt-4 overflow-hidden rounded-lg">
                <img
                    src={milestone.imageUrl}
                    alt={milestone.title}
                    loading="lazy"
                    onError={(e) => {
                        const target = e.currentTarget;
                        target.onerror = null; // Prevent infinite loops
                        // Fallback to a self-contained SVG icon to avoid another network request
                        target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z' /%3E%3C/svg%3E";
                        target.style.objectFit = 'scale-down';
                        target.style.padding = '2rem';
                    }}
                    className="w-full h-48 object-cover bg-gray-800 transition-all duration-500 ease-in-out group-hover:scale-110 group-hover:brightness-105"
                />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Timeline;