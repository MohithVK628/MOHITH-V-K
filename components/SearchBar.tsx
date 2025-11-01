
import React from 'react';
import { SearchIcon } from './IconComponents';

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="relative mb-6">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search by year, film, or person..."
        className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
      />
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <SearchIcon />
      </div>
    </div>
  );
};

export default SearchBar;
