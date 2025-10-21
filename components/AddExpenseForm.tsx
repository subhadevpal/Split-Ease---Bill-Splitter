
import React, { useState, useCallback } from 'react';
import type { Friend } from '../types';
import { getAmountFromImage } from '../services/geminiService';
import Spinner from './common/Spinner';

interface AddExpenseFormProps {
  friends: Friend[];
  onAddExpense: (expense: { description: string; amount: number; paidById: string; splitWithIds: string[] }) => void;
  onClose: () => void;
}

const AddExpenseForm: React.FC<AddExpenseFormProps> = ({ friends, onAddExpense, onClose }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number | string>('');
  const [paidById, setPaidById] = useState<string>(friends[0]?.id || '');
  const [splitWithIds, setSplitWithIds] = useState<string[]>(friends.map(f => f.id));
  const [isReadingImage, setIsReadingImage] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsReadingImage(true);
    setError('');
    
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      try {
        const base64String = (reader.result as string).split(',')[1];
        const extractedAmount = await getAmountFromImage(base64String, file.type);
        if (extractedAmount > 0) {
          setAmount(extractedAmount);
        } else {
          setError('Could not read amount from image. Please enter it manually.');
        }
      } catch (err) {
        setError('An error occurred while processing the image.');
        console.error(err);
      } finally {
        setIsReadingImage(false);
      }
    };
    reader.onerror = () => {
        setError('Failed to read the file.');
        setIsReadingImage(false);
    }
  };

  const handleSplitWithChange = (friendId: string) => {
    setSplitWithIds(prev =>
      prev.includes(friendId)
        ? prev.filter(id => id !== friendId)
        : [...prev, friendId]
    );
  };

  const handleSelectAll = () => {
    if (splitWithIds.length === friends.length) {
        setSplitWithIds([]);
    } else {
        setSplitWithIds(friends.map(f => f.id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || +amount <= 0 || !paidById || splitWithIds.length === 0) {
      setError('Please fill all fields correctly.');
      return;
    }
    onAddExpense({
      description,
      amount: +amount,
      paidById,
      splitWithIds,
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <p className="text-red-500 bg-red-100 p-3 rounded-md">{error}</p>}
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-text-primary mb-1">Description</label>
        <input
          type="text"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g., Dinner, Movie tickets"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
          required
        />
      </div>

      <div className="flex items-end space-x-4">
        <div className="flex-grow">
          <label htmlFor="amount" className="block text-sm font-medium text-text-primary mb-1">Amount ($)</label>
          <div className="relative">
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
              required
              min="0.01"
              step="0.01"
              disabled={isReadingImage}
            />
            {isReadingImage && <div className="absolute right-3 top-1/2 -translate-y-1/2"><Spinner size="sm"/></div>}
          </div>
        </div>
        <div className="relative">
             <label htmlFor="receipt-upload" className="cursor-pointer bg-secondary text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors inline-flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
                <span>Scan Receipt</span>
             </label>
             <input id="receipt-upload" type="file" accept="image/*" className="hidden" onChange={handleFileChange} disabled={isReadingImage} />
        </div>
      </div>
      
      <div>
        <label htmlFor="paidBy" className="block text-sm font-medium text-text-primary mb-1">Paid by</label>
        <select
          id="paidBy"
          value={paidById}
          onChange={(e) => setPaidById(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
        >
          {friends.map(friend => (
            <option key={friend.id} value={friend.id}>{friend.name}</option>
          ))}
        </select>
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-text-primary">Split with</label>
            <button type="button" onClick={handleSelectAll} className="text-sm font-medium text-primary hover:text-primary-hover">
                {splitWithIds.length === friends.length ? 'Deselect All' : 'Select All'}
            </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {friends.map(friend => (
            <label key={friend.id} className={`flex items-center space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${splitWithIds.includes(friend.id) ? 'border-primary bg-indigo-50' : 'border-gray-200'}`}>
              <input
                type="checkbox"
                checked={splitWithIds.includes(friend.id)}
                onChange={() => handleSplitWithChange(friend.id)}
                className="h-5 w-5 rounded text-primary focus:ring-primary"
              />
              <span className="font-medium text-text-primary">{friend.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button type="submit" className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-hover transition-colors disabled:opacity-50" disabled={isReadingImage}>
          Add Expense
        </button>
      </div>
    </form>
  );
};

export default AddExpenseForm;
