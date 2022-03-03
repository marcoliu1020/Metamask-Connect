// https://docs.metamask.io/guide/ethereum-provider.html#using-the-provider

import { ethers } from "ethers";
import { useState } from "react";
import "./Wallet.css";

const Wallet = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [userAccount, setUserAccount] = useState(null);
  const [userBalance, setUserBalance] = useState(null);

  const connectWalletHandler = () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      console.log("MetaMask Here!");

      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((accounts) => {
          accountsChangeHandler(accounts);
        })
        .catch((error) => {
          setErrorMessage(error.message);
        });
    } else {
      console.log("Need to install MetaMask");
      setErrorMessage("Please install MetaMask browser extension to interact");
    }
  };

  const accountsChangeHandler = (accounts) => {
    setUserAccount(accounts[0]);
    getAccountBalance(accounts[0]);
  };

  const getAccountBalance = (account) => {
    window.ethereum
      .request({ method: "eth_getBalance", params: [account, "latest"] })
      .then((balance) => {
        setUserBalance(ethers.utils.formatEther(balance));
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  };

  const chainChangedHandler = () => {
    // reload the page to avoid any errors with chain change mid use of application
    window.location.reload();
  };

  // events
  window.ethereum.on("accountsChanged", accountsChangeHandler);
  window.ethereum.on("chainChanged", chainChangedHandler);

  // useEffect(() => {

  //   if (userAccount) {
  //     getAccountBalance();
  //   }
  // }, [userAccount]);

  return (
    <div className="Wallet">
      <div className="error-display">
        <h1>{errorMessage}</h1>
      </div>

      <div className="address-display">
        <h3>Address: {userAccount}</h3>
      </div>

      <div className="balance-display">
        <h3>Balance: {userBalance}</h3>
      </div>

      <button onClick={connectWalletHandler}>Connect Wallet</button>
    </div>
  );
};

export default Wallet;
