import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { getContract, getAccount } from './web3';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from './Config';
import Web3 from 'web3';
import './BuyCoffeePage.css'; // Updated CSS file

function BuyCoffeePage() {
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedPage, setSelectedPage] = useState(null);
  const [donationAmount, setDonationAmount] = useState('');
  const [message, setMessage] = useState(''); // Added for handling message input
  const [walletConnected, setWalletConnected] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState('idle'); // Added state for transaction status

  useEffect(() => {
    const checkWalletConnection = async () => {
      const account = await getAccount();
      if (account) {
        setWalletConnected(true);
      } else {
        setWalletConnected(false);
      }
    };

    checkWalletConnection();
  }, []);

  const loadPages = async (startIndex, endIndex) => {
    if (!walletConnected) {
      return; // Don't attempt to load pages if the wallet is not connected
    }

    setLoading(true);
    const contract = await getContract(CONTRACT_ADDRESS, CONTRACT_ABI);
    try {
      const result = await contract.methods.getPaginatedPages(startIndex, endIndex).call();
      
      const paginatedPages = result[0];
      const hasMore = result[1];

      const pageArray = Object.keys(paginatedPages).map(key => ({
        owner: paginatedPages[key].owner,
        username: paginatedPages[key].username,
        description: paginatedPages[key].description
      }));

      setPages(pageArray);
      setHasMore(hasMore);
    } catch (error) {
      console.error('Error loading pages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (walletConnected) {
      const startIndex = (currentPage - 1) * 6;
      const endIndex = startIndex + 6;
      loadPages(startIndex, endIndex);
    }
  }, [currentPage, walletConnected]);

  const handleNextPage = () => {
    if (hasMore) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleBuyCoffee = (page) => {
    setSelectedPage(page);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPage(null);
    setDonationAmount('');
    setMessage(''); // Reset message when closing the modal
    setTransactionStatus('idle'); // Reset the transaction status when closing the modal
  };

  const handleConfirmDonation = async () => {
    if (!selectedPage || !donationAmount || !message) return;

    let userAddress;
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      userAddress = accounts[0];
    } catch (error) {
      console.error('Failed to get user address:', error);
      return;
    }

    if (!userAddress) {
      return;
    }

    const contract = await getContract(CONTRACT_ADDRESS, CONTRACT_ABI);
    try {
      const donationAmountWei = Web3.utils.toWei(donationAmount, 'ether');
      
      setTransactionStatus('loading'); // Set to loading while the transaction is in process

      await contract.methods.buyCoffee(selectedPage.username, message)
        .send({ from: userAddress, value: donationAmountWei });

      setTransactionStatus('success'); // Set to success after the transaction is complete
    } catch (error) {
      console.error('Error buying coffee:', error);
      setTransactionStatus('error'); // Set to error if the transaction fails
    }
  };

  return (
    <div>
      <Navbar onWalletConnect={setWalletConnected} />
      <div className="buycoffee-container">
        {!walletConnected ? (
          <p>Please connect your wallet to explore the pages.</p>
        ) : (
          <>
            <div className="buycoffee-grid">
              {pages.length > 0 ? (
                pages.map((page, index) => (
                  <div key={index} className="buycoffee-item">
                    <img src="/avatar.png" alt="Avatar" />
                    <p>{page.username}</p>
                    <button className="buycoffee-button" onClick={() => handleBuyCoffee(page)}>
                      Buy Coffee
                    </button>
                  </div>
                ))
              ) : (
                <p>No Buy More Coffee Pages available</p>
              )}
            </div>
            <div className="d-flex justify-content-end">
              <button className="buycoffee-button me-2" onClick={handlePreviousPage} disabled={currentPage === 1}>
                &lt; Previous
              </button>
              <button className="buycoffee-button" onClick={handleNextPage} disabled={!hasMore}>
                Next &gt;
              </button>
            </div>
          </>
        )}

        {showModal && selectedPage && (
          <div className="buycoffee-modal-overlay">
            <div className="buycoffee-modal">
              <div className="buycoffee-modal-header">
                Buy Coffee for {selectedPage.username}
              </div>
              <div className="buycoffee-modal-body">
                {transactionStatus === 'loading' && <p>Processing...</p>}
                {transactionStatus === 'success' && <p>Coffee Sent Successfully!</p>}
                {transactionStatus === 'error' && <p>Error occurred while sending coffee.</p>}
                {transactionStatus === 'idle' && (
                  <>
                    <p><strong>Username:</strong> {selectedPage.username}</p>
                    <p><strong>Description:</strong> {selectedPage.description}</p>
                    <label>
                      Donation Amount (in Ether)
                      <input 
                        type="number" 
                        step="0.01"
                        placeholder="Enter amount in Ether" 
                        value={donationAmount}
                        onChange={(e) => setDonationAmount(e.target.value)}
                        required
                      />
                    </label>
                    <label>
                      Message (Max 100 characters)
                      <input 
                        type="text" 
                        maxLength="100"
                        placeholder="Enter your message" 
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                      />
                    </label>
                  </>
                )}
              </div>
              <div className="buycoffee-modal-footer">
                <button className="buycoffee-button" onClick={handleCloseModal}>
                  Close
                </button>
                {transactionStatus === 'idle' && (
                  <button className="buycoffee-button" onClick={handleConfirmDonation}>
                    Confirm Donation
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BuyCoffeePage;