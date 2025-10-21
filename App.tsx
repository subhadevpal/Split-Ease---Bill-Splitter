import React, { useState } from 'react';
import Header from './components/Header';
import Summary from './components/Summary';
import ExpenseList from './components/ExpenseList';
import AddExpenseForm from './components/AddExpenseForm';
import Modal from './components/common/Modal';
import { useBillSplitter } from './hooks/useBillSplitter';
import type { Friend, Expense } from './types';
import ExpenseDetail from './components/ExpenseDetail';
import SettleUp from './components/SettleUp';
import MyExpenses from './components/MyExpenses';

const FriendManager: React.FC<{friends: Friend[], addFriend: (name: string) => void}> = ({ friends, addFriend }) => {
    const [name, setName] = useState('');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            addFriend(name.trim());
            setName('');
        }
    }

    return (
        <div className="bg-card rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-text-primary mb-4">Friends</h2>
            <form onSubmit={handleSubmit} className="flex space-x-2 mb-4">
                <input 
                    type="text" 
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Add a new friend"
                    className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                />
                <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-hover transition-colors">Add</button>
            </form>
            <div className="flex flex-wrap gap-2">
                {friends.map(friend => (
                    <span key={friend.id} className="bg-indigo-100 text-primary text-sm font-medium px-3 py-1 rounded-full">{friend.name}</span>
                ))}
            </div>
        </div>
    );
};


function App() {
  const { friends, expenses, balances, addFriend, addExpense, settlements, settleUp } = useBillSplitter();
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

  const handleExpenseClick = (expense: Expense) => {
    setSelectedExpense(expense);
  };

  return (
    <div className="min-h-screen bg-background text-text-primary">
      <Header />
      <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <Summary balances={balances} friends={friends} settlements={settlements} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <ExpenseList expenses={expenses} friends={friends} onExpenseClick={handleExpenseClick} />
            </div>
            <div className="space-y-8">
                <FriendManager friends={friends} addFriend={addFriend} />
                <SettleUp settlements={settlements} friends={friends} onSettle={settleUp} />
                <MyExpenses expenses={expenses} onExpenseClick={handleExpenseClick} />
            </div>
        </div>
      </main>

      <button
        onClick={() => setIsAddExpenseModalOpen(true)}
        className="fixed bottom-8 right-8 bg-primary text-white rounded-full p-4 shadow-lg hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-transform hover:scale-110"
        aria-label="Add new expense"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>

      <Modal isOpen={isAddExpenseModalOpen} onClose={() => setIsAddExpenseModalOpen(false)} title="Add New Expense">
        <AddExpenseForm 
            friends={friends}
            onAddExpense={addExpense}
            onClose={() => setIsAddExpenseModalOpen(false)}
        />
      </Modal>

      {selectedExpense && (
         <Modal isOpen={!!selectedExpense} onClose={() => setSelectedExpense(null)} title="Expense Details">
            <ExpenseDetail expense={selectedExpense} friends={friends} />
         </Modal>
      )}
    </div>
  );
}

export default App;