import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import BuyCoffeePage from './BuyCoffeePage';
import { WalletProvider } from './web3';

function App() {
  return (
    <div className="global-background">
      <WalletProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/buy-coffee" element={<BuyCoffeePage />} />
          </Routes>
        </Router>
      </WalletProvider>
    </div>
  );
}

export default App;