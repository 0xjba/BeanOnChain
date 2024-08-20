import { WalletContext, getContract } from './web3';
import Web3 from 'web3';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from './Config';
import React, { useContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';
import "./ProfileModal.css";

function Navbar({ onWalletConnect }) {
  const { connectedAccount, handleConnectWallet } = useContext(WalletContext);
  const navigate = useNavigate();
  const [walletConnected, setWalletConnected] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showCreatePageModal, setShowCreatePageModal] = useState(false);
  const [showDonationsModal, setShowDonationsModal] = useState(false);
  const [pageData, setPageData] = useState(null);
  const [donations, setDonations] = useState([]);
  const profileButtonRef = useRef(null);

  useEffect(() => {
    if (connectedAccount) {
      setWalletConnected(true);
      if (onWalletConnect) {
        onWalletConnect(true);
      }
    } else {
      setWalletConnected(false);
      if (onWalletConnect) {
        onWalletConnect(false);
      }
    }
  }, [connectedAccount]);

  const navigateToHome = () => {
    navigate('/', { replace: true });
  };

  const navigateToExplore = () => {
    navigate('/buy-coffee', { replace: true });
  };

  const toggleProfileModal = async () => {
    if (connectedAccount) {
      try {
        const data = await fetchPageData();
        setPageData(data);
        setShowProfileModal(!showProfileModal);
      } catch (error) {
        if (error.message.includes("You do not have a page")) {
          setShowCreatePageModal(true);
        } else {
          console.error("Error fetching page data:", error);
        }
      }
    } else {
      handleConnectWallet();
    }
  };

  const toggleDonationsModal = async () => {
    if (connectedAccount) {
      const fetchedDonations = await handleSeeDonations();
      setDonations(fetchedDonations);
      setShowDonationsModal(!showDonationsModal);
    }
  };

  const fetchPageData = async () => {
    const contract = await getContract(CONTRACT_ADDRESS, CONTRACT_ABI);
    const result = await contract.methods.getMyPage().call();
    console.log("Fetched Page Data:", result);
    return {
      username: result[0],
      description: result[1],
      totalAmount: result[2],
      totalCoffees: result[3].toString(),
    };
  };

  const handleSeeDonations = async () => {
    const contract = await getContract(CONTRACT_ADDRESS, CONTRACT_ABI);
    try {
      const donations = await contract.methods.getMyCoffeeDonations().call();
      return donations;
    } catch (error) {
      console.error("Error fetching donations:", error);
      return [];
    }
  };

  const handleCreatePage = async (username, description) => {
    try {
      const contract = await getContract(CONTRACT_ADDRESS, CONTRACT_ABI);
      await contract.methods.createPage(username, description).send({ from: connectedAccount });
      alert("Page created successfully!");
      setShowCreatePageModal(false);
      toggleProfileModal(); // Open the profile modal after creating the page
    } catch (error) {
      console.error("Error creating page:", error);
      alert("Failed to create page.");
    }
  };

  return (
    <>
      <nav className={`navbar ${showDonationsModal || showCreatePageModal ? 'blurred-background' : ''}`}>
        <div className="navbar-left">
          <img 
            src="/logo.png" 
            alt="Logo" 
            className="navbar-logo" 
            onClick={navigateToHome} 
            style={{ cursor: 'pointer' }} 
          />
        </div>
        <div className="navbar-center">
          <a href="#" onClick={navigateToExplore}>Explore</a>
        </div>
        <div className="navbar-right">
          <a href="#" ref={profileButtonRef} onClick={toggleProfileModal}>
            {connectedAccount ? `${connectedAccount.slice(0, 6)}...${connectedAccount.slice(-4)}` : 'Connect Wallet'}
          </a>
          {showProfileModal && pageData && (
            <div className="profile-modal-content">
              <div className="profile-avatar-container">
                <img className="profile-avatar" src="/Avatar.svg" alt="Avatar" />
              </div>
              <h2 className="profile-username">{pageData.username}</h2>
              <p className="profile-description">{pageData.description}</p>
              <div className="profile-divider"></div>
              <p><strong>Total Amount:</strong> {Web3.utils.fromWei(pageData.totalAmount, "ether")} ETH</p>
              <p><strong>Total Coffees:</strong> {pageData.totalCoffees}</p>
              <div className="profile-modal-footer">
                <button onClick={toggleDonationsModal}>Donations</button>
                <button onClick={toggleProfileModal}>Close</button>
              </div>
            </div>
          )}
          {showCreatePageModal && (
            <div
              className="create-page-modal-content"
              style={{
                top: `${profileButtonRef.current.offsetTop + profileButtonRef.current.offsetHeight}px`,
              }}
            >
              <h2>Create Your Page</h2>
              <input type="text" placeholder="Username" id="new-username" />
              <input type="text" placeholder="Description" id="new-description" />
              <div className="create-page-modal-footer">
                <button onClick={() => handleCreatePage(
                  document.getElementById("new-username").value,
                  document.getElementById("new-description").value
                )}>Create Page</button>
                <button onClick={() => setShowCreatePageModal(false)}>Close</button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {showDonationsModal && (
        <div className="donations-modal-content">
          {donations.length === 0 ? (
            <p>No donations found.</p>
          ) : (
            donations.map((donation, index) => (
              <div className="donation-item" key={index}>
                <p><strong>From:</strong> {donation.donor}</p>
                <p><strong>Amount:</strong> {Web3.utils.fromWei(donation.amount.toString(), "ether")} ETH</p>
                <p><strong>Message:</strong> {donation.message}</p>
                <p><strong>Date:</strong> {new Date(Number(donation.timestamp) * 1000).toLocaleString()}</p>
              </div>
            ))
          )}
          <div className="donations-modal-footer">
            <button onClick={toggleDonationsModal}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;