import React from 'react';
import { useSweets } from '../../context/SweetsContext';
import './SweetCard.css';

const SweetCard = ({ sweet }) => {
  const { purchaseSweet } = useSweets();
  const isSoldOut = sweet.quantity === 0;

  const handlePurchase = () => {
    purchaseSweet(sweet._id);
  };

  return (
    <div className="sweet-card">
      {isSoldOut && <div className="sold-out-badge">Sold Out</div>}
      
      <div className="card-image">
        {/* Placeholder for an image. You can add <img src={...} /> here later */}
        <span className="card-image-placeholder">{sweet.name.substring(0, 2)}</span>
      </div>
      
      <div className="card-content">
        <h3 className="card-title">{sweet.name}</h3>
        <p className="card-category">{sweet.category}</p>
        
        <div className="card-footer">
          <p className="card-price">₹{sweet.price.toFixed(2)}</p>
          <p className="card-quantity">
            {isSoldOut ? 'Out of stock' : `${sweet.quantity} in stock`}
          </p>
        </div>

        <button
          className="btn btn-primary btn-full-width"
          onClick={handlePurchase}
          disabled={isSoldOut}
        >
          Purchase
        </button>
      </div>
    </div>
  );
};

export default SweetCard;