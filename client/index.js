import { ethers } from "./ethers-5.6.esm.min.js";
import { abi, contractAddress } from "./constants.js";
const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fundButton");
const balanceButton = document.getElementById("balanceButton");
const withdrawButton = document.getElementById("withdrawButton");
balanceButton.onclick = getBalance;
connectButton.onclick = connect;
fundButton.onclick = fund;
withdrawButton.onclick = withdraw;
async function connect() {
  if (typeof window.ethereum !== "undefined") {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    connectButton.innerHTML = "Connected";
  } else {
    fundButton.innerHTML = "Please install metamask";
  }
}
async function fund() {
  const ethAmount = document.getElementById("ethAmount").value;
  // const ethAmount = "77";
  console.log(`Funding with ${ethAmount}..`);
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    // console.log(signer);
    const contract = new ethers.Contract(contractAddress, abi, signer);
    // console.log(contract);
    try {
      // console.log("try");
      const transactionResponse = await contract.fund({
        value: ethers.utils.parseEther(ethAmount),
      });
      // console.log(transactionResponse);
      await listenForTransactionMin(transactionResponse, provider);
      console.log("Done!");
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log("Please metamask");
  }
}

async function getBalance() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const Balance = await provider.getBalance(contractAddress);
    console.log(ethers.utils.formatEther(Balance));
  }
}
async function withdraw() {
  console.log(`Withdrawing....`);
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    // await provider.send('eth_requestAccounts', [])
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const transactionResponse = await contract.withdraw();
      await listenForTransactionMin(transactionResponse, provider);
      // await transactionResponse.wait(1)
    } catch (error) {
      console.log(error);
    }
  } else {
    withdrawButton.innerHTML = "Please install MetaMask";
  }
}
function listenForTransactionMin(transactionResponse, provider) {
  return new Promise((resolve, reject) => {
    try {
      provider.once(transactionResponse.hash, (transactionReceipt) => {
        console.log(
          `Completed with ${transactionReceipt.confirmations} confirmations`
        );
        resolve();
      });
    } catch (error) {
      reject(error);
    }
  });
}
