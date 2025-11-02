import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSweets } from '../context/SweetsContext';
import SweetCard from '../components/sweets/SweetCard';

const HomePage = () => {
  const { user } = useAuth();
  const { sweets, isLoading, error, getSweets, searchSweets } = useSweets();

  // State for search filters
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // Load all sweets on component mount
  useEffect(() => {
    getSweets();
  }, [getSweets]); // getSweets is wrapped in useCallback

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    searchSweets({ name, category, minPrice, maxPrice });
  };

  // Handle reset
  const handleReset = () => {
    setName('');
    setCategory('');
    setMinPrice('');
    setMaxPrice('');
    getSweets(); // Fetch all sweets again
  };

  return (
    <div>
      <h2>Welcome to the Sweet Shop, {user.email}!</h2>

      {/* --- Search Bar --- */}
      <form className="search-bar" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search by name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Search by category..."
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          min="0"
          step="0.01"
        />
        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          min="0"
          step="0.01"
        />
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button type="submit" className="btn btn-primary">Search</button>
          <button type="button" className="btn btn-danger" onClick={handleReset}>Reset</button>
        </div>
      </form>

      {/* --- Sweets Grid --- */}
      {isLoading && <p>Loading sweets...</p>}
      {error && <p style={{ color: 'var(--color-danger)' }}>{error}</p>}
      
      {!isLoading && !error && (
        <div className="sweets-grid">
          {sweets.length > 0 ? (
            sweets.map((sweet) => (
              <SweetCard key={sweet._id} sweet={sweet} />
            ))
          ) : (
            <p>No sweets found matching your search.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default HomePage;