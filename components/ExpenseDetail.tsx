import React from 'react';
import type { Expense, Friend } from '../types';

interface ExpenseDetailProps {
  expense: Expense;
  friends: Friend[];
}

const ExpenseDetail: React.FC<ExpenseDetailProps> = ({ expense, friends }) => {
  const friendMap = new Map(friends.map(f => [f.id, f.name]));
  const paidByName = friendMap.get(expense.paidById) || 'Unknown';
  const share = expense.amount / expense.splitWithIds.length;
  const date = new Date(expense.date);
  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-3xl font-bold text-text-primary">{expense.description}</h3>
        <p className="text-lg text-text-secondary">{formattedDate}</p>
      </div>
      
      <div className="p-4 bg-background rounded-lg">
        <p className="text-sm font-medium text-text-secondary">Total Amount</p>
        <p className="text-4xl font-bold text-primary">${expense.amount.toFixed(2)}</p>
        <p className="text-sm text-text-secondary mt-1">Paid by <span className="font-semibold">{paidByName}</span></p>
      </div>
      
      <div>
        <h4 className="font-bold text-text-primary mb-2">Split Breakdown</h4>
        <ul className="space-y-2">
          {expense.splitWithIds.map(friendId => (
            <li key={friendId} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
              <span className="font-medium text-text-primary">{friendMap.get(friendId) || 'Unknown'}</span>
              <span className="font-semibold text-text-secondary">${share.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ExpenseDetail;
