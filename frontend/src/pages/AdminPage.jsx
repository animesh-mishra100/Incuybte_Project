import React, { useEffect, useState } from 'react';
import { useSweets } from '../context/SweetsContext';
import SweetFormModal from '../components/admin/SweetFormModal';
// We'll add this small restock modal in the next step
// import RestockModal from '../components/admin/RestockModal';

const AdminPage = () => {
  const { sweets, getSweets, createSweet, updateSweet, deleteSweet, restockSweet } = useSweets();
  
  // State for the Add/Edit modal
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingSweet, setEditingSweet] = useState(null);

  // State for the Restock modal (simplified for now)
  const [restockId, setRestockId] = useState(null);

  useEffect(() => {
    getSweets();
  }, [getSweets]);

  // --- Modal Handlers ---
  
  const handleOpenAddModal = () => {
    setEditingSweet(null); // Make sure it's null (for "Add" mode)
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (sweet) => {
    setEditingSweet(sweet); // Set the sweet to edit
    setIsFormModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsFormModalOpen(false);
    setEditingSweet(null);
  };

  // --- Action Handlers ---

  const handleSaveSweet = (id, sweetData) => {
    if (id) {
      // It's an update
      updateSweet(id, sweetData);
    } else {
      // It's a create
      createSweet(sweetData);
    }
    handleCloseModal();
  };

  const handleDeleteSweet = (id) => {
    if (window.confirm('Are you sure you want to delete this sweet?')) {
      deleteSweet(id);
    }
  };

  const handleRestock = (id) => {
    const amount = window.prompt('Enter restock amount:');
    if (amount && !isNaN(amount) && amount > 0) {
      restockSweet(id, Number(amount));
    } else if (amount) {
      alert('Please enter a valid number.');
    }
  };

  return (
    <div>
      <div className="admin-header">
        <h2>Admin Panel: Manage Sweets</h2>
        <button className="btn btn-primary" onClick={handleOpenAddModal}>
          Add New Sweet
        </button>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sweets.map((sweet) => (
            <tr key={sweet._id}>
              <td>{sweet.name}</td>
              <td>{sweet.category}</td>
              <td>₹{sweet.price.toFixed(2)}</td>
              <td>{sweet.quantity}</td>
              <td className="admin-table-actions">
                <button
                  className="btn btn-primary"
                  onClick={() => handleOpenEditModal(sweet)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-secondary" // We'll add this class
                  onClick={() => handleRestock(sweet._id)}
                >
                  Restock
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDeleteSweet(sweet._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* The Add/Edit Modal */}
      <SweetFormModal
        isOpen={isFormModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveSweet}
        editingSweet={editingSweet}
      />
    </div>
  );
};

export default AdminPage;