import React, { useState, useEffect } from 'react';
import './Modal.css';

const SweetFormModal = ({ isOpen, onClose, onSave, editingSweet }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);

  // This effect pre-fills the form when we are editing
  useEffect(() => {
    if (editingSweet) {
      setName(editingSweet.name);
      setCategory(editingSweet.category);
      setPrice(editingSweet.price);
      setQuantity(editingSweet.quantity);
    } else {
      // Reset form when opening for "Add New"
      setName('');
      setCategory('');
      setPrice(0);
      setQuantity(0);
    }
  }, [editingSweet, isOpen]); // Re-run when the sweet or open state changes

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const sweetData = { name, category, price: Number(price), quantity: Number(quantity) };
    
    // If we are editing, we pass the ID back.
    // If we are creating, we pass null for the ID.
    onSave(editingSweet ? editingSweet._id : null, sweetData);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <form onSubmit={handleSubmit}>
          <h2>{editingSweet ? 'Edit Sweet' : 'Add New Sweet'}</h2>
          
          <div className="form-group">
            <label htmlFor="name">Sweet Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <input
              id="category"
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="price">Price</label>
            <input
              id="price"
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="quantity">Quantity</label>
            <input
              id="quantity"
              type="number"
              min="0"
              step="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </div>
          
          <div className="modal-actions">
            <button type="button" className="btn btn-danger" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SweetFormModal;