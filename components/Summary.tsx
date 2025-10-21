import React from 'react';
import type { Balance, Friend, Settlement } from '../types';

interface SummaryProps {
    balances: Balance[];
    friends: Friend[];
    settlements: Settlement[];
}

const Summary: React.FC<SummaryProps> = ({ balances, friends, settlements }) => {
    const youBalance = balances.find(b => b.friendId === 'user-1');
    const youBalanceAmount = youBalance?.amount || 0;

    const totalYouOwe = settlements
        .filter(s => s.fromId === 'user-1')
        .reduce((sum, s) => sum + s.amount, 0);
        
    const totalYouAreOwed = settlements
        .filter(s => s.toId === 'user-1')
        .reduce((sum, s) => sum + s.amount, 0);

    return (
        <div className="p-6 bg-card rounded-2xl shadow-lg mb-8">
            <h2 className="text-2xl font-bold text-text-primary mb-4">Your Balance Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="bg-red-50 p-4 rounded-xl">
                    <p className="text-sm font-medium text-red-600">You Owe</p>
                    <p className="text-2xl font-bold text-red-700">${totalYouOwe.toFixed(2)}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-xl">
                    <p className="text-sm font-medium text-green-600">You are Owed</p>
                    <p className="text-2xl font-bold text-green-700">${totalYouAreOwed.toFixed(2)}</p>
                </div>
                 <div className="bg-blue-50 p-4 rounded-xl">
                    <p className="text-sm font-medium text-blue-600">Net Balance</p>
                    <p className={`text-2xl font-bold ${youBalanceAmount >= 0 ? 'text-blue-700' : 'text-red-700'}`}>
                        {youBalanceAmount < 0 ? '-' : ''}${Math.abs(youBalanceAmount).toFixed(2)}
                    </p>
                </div>
            </div>
        </div>
    );
};


export default Summary;