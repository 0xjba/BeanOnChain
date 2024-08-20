import React, { createContext, useState, useEffect } from 'react';
import Web3 from 'web3';

let web3Instance = null;

export const connectWallet = async () => {
  if (window.ethereum) {
    web3Instance = new Web3(window.ethereum);
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      return { web3: web3Instance, account: accounts[0] };
    } catch (error) {
      console.error('User denied account access');
      return null;
    }
  } else {
    console.log('Please install MetaMask!');
    return null;
  }
};

export const getWeb3 = () => {
  return web3Instance;
};

export const getContract = async (address, abi) => {
  const web3 = getWeb3();
  if (web3) {
    const accounts = await web3.eth.getAccounts();
    const contract = new web3.eth.Contract(abi, address, {
      from: accounts[0],
    });
    return contract;
  }
  return null;
};

export const getAccount = async () => {
  const web3 = getWeb3();
  if (web3) {
    const accounts = await web3.eth.getAccounts();
    return accounts[0];
  }
  return null;
};

// WalletContext Logic
export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [connectedAccount, setConnectedAccount] = useState(null);

  const handleConnectWallet = async () => {
    const connection = await connectWallet();
    if (connection) {
      setConnectedAccount(connection.account);
      // Remove the alert to prevent the popup
      console.log(`Connected account: ${connection.account}`);
      // Optionally, update the UI with the connected account information
    }
  };

  useEffect(() => {
    const checkConnectedAccount = async () => {
      const account = await getAccount();
      if (account) {
        setConnectedAccount(account);
      }
    };

    checkConnectedAccount();
  }, []);

  return (
    <WalletContext.Provider value={{ connectedAccount, handleConnectWallet }}>
      {children}
    </WalletContext.Provider>
  );
};