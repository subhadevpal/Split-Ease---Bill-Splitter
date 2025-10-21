import React from 'react';
import type { Expense } from '../types';

interface MyExpensesProps {
  expenses: Expense[];
  onExpenseClick: (expense: Expense) => void;
}

const MyExpenses: React.FC<MyExpensesProps> = ({ expenses, onExpenseClick }) => {
  // The user is hardcoded as 'user-1' with the name 'You' in the hook.
  const myExpenses = expenses.filter(expense => expense.paidById === 'user-1');

  return (
    <div className="bg-card rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-text-primary mb-4">Expenses You've Paid</h2>
      <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
        {myExpenses.length > 0 ? (
          myExpenses.map(expense => (
            <button
              key={expense.id}
              onClick={() => onExpenseClick(expense)}
              className="w-full flex justify-between items-center p-3 bg-gray-50 hover:bg-indigo-50 transition-colors duration-200 rounded-lg text-left focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label={`View details for ${expense.description}`}
            >
              <div>
                <p className="font-medium text-text-primary truncate" title={expense.description}>{expense.description}</p>
                <p className="text-sm text-text-secondary">{new Date(expense.date).toLocaleDateString()}</p>
              </div>
              <p className="font-bold text-green-600 flex-shrink-0 ml-2">${expense.amount.toFixed(2)}</p>
            </button>
          ))
        ) : (
          <p className="text-center text-text-secondary py-4">You haven't paid for any expenses yet.</p>
        )}
      </div>
      <style>{`
        /* Custom scrollbar for webkit browsers */
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }
        .overflow-y-auto::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 3px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
};

export default MyExpenses;
