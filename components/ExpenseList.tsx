import React from 'react';
import type { Expense, Friend } from '../types';

interface ExpenseListProps {
  expenses: Expense[];
  friends: Friend[];
  onExpenseClick: (expense: Expense) => void;
}

const ExpenseListItem: React.FC<{ expense: Expense; friendMap: Map<string, string>, onClick: () => void }> = ({ expense, friendMap, onClick }) => {
    const paidByName = friendMap.get(expense.paidById) || 'Unknown';
    const date = new Date(expense.date);
    
    return (
        <button
            onClick={onClick}
            className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors duration-200 rounded-lg text-left focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label={`View details for ${expense.description}`}
        >
            <div className="flex items-center space-x-4">
                <div className="flex flex-col items-center justify-center bg-background text-primary w-14 h-14 rounded-lg">
                    <span className="font-bold text-sm">{date.toLocaleString('en-US', { month: 'short' }).toUpperCase()}</span>
                    <span className="text-2xl font-bold">{date.getDate()}</span>
                </div>
                <div>
                    <p className="font-semibold text-text-primary">{expense.description}</p>
                    <p className="text-sm text-text-secondary">
                        {paidByName} paid ${expense.amount.toFixed(2)}
                    </p>
                </div>
            </div>
            <div className="text-right">
                <p className="font-bold text-lg text-green-600">${expense.amount.toFixed(2)}</p>
            </div>
        </button>
    );
};

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, friends, onExpenseClick }) => {
  const friendMap = new Map(friends.map(f => [f.id, f.name]));
  
  return (
    <div className="bg-card rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-text-primary mb-4">Recent Expenses</h2>
      <div className="space-y-3">
        {expenses.length > 0 ? (
          expenses.map(expense => (
            <ExpenseListItem key={expense.id} expense={expense} friendMap={friendMap} onClick={() => onExpenseClick(expense)} />
          ))
        ) : (
          <p className="text-center text-text-secondary py-8">No expenses yet. Add one to get started!</p>
        )}
      </div>
    </div>
  );
};

export default ExpenseList;
