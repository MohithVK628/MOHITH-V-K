
import React, { useState, useMemo } from 'react';
import { Chatbot } from './components/Chatbot';
import Timeline from './components/Timeline';
import SearchBar from './components/SearchBar';
import { MILESTONES } from './constants';
import { Milestone } from './types';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [askAboutMilestone, setAskAboutMilestone] = useState('');

  const filteredMilestones = useMemo(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    if (!lowercasedFilter) {
      return MILESTONES;
    }
    return MILESTONES.filter(
      (milestone) =>
        milestone.year.toString().includes(lowercasedFilter) ||
        milestone.title.toLowerCase().includes(lowercasedFilter) ||
        milestone.description.en.toLowerCase().includes(lowercasedFilter) ||
        milestone.description.kn.toLowerCase().includes(lowercasedFilter)
    );
  }, [searchTerm]);

  const handleMilestoneClick = (milestone: Milestone) => {
    setAskAboutMilestone(`Tell me more about the movie "${milestone.title}" from ${milestone.year}.`);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
            <div className="inline-block p-2 border-2 border-yellow-500 rounded-lg">
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-yellow-400 tracking-wider">
                    Kannada Cinema Milestones
                </h1>
            </div>
            <p className="mt-2 text-gray-400">An Interactive Journey Through Sandalwood's History</p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 h-full">
            <div className="sticky top-6">
                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                <div className="h-[75vh] overflow-y-auto pr-2">
                    <Timeline milestones={filteredMilestones} onMilestoneClick={handleMilestoneClick} />
                </div>
            </div>
          </div>

          <div className="lg:col-span-3 h-[85vh]">
            <Chatbot askAboutMilestone={askAboutMilestone} setAskAboutMilestone={setAskAboutMilestone} />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
