import { ethers } from "ethers";

// Function to check if an address has been used
export const isAddressUsed = async (address, provider) => {
    try {
        const transactionCount = await provider.getTransactionCount(address);
        return transactionCount > 0;
    } catch (error) {
        console.error(`Error checking address ${address}:`, error.message);
        throw new Error("Failed to validate the address.");
    }
};

// Function to block transactions to any used address
export const blockTransaction = async (transaction, provider) => {
    const toAddress = transaction.to;

    // Check if the address has been used before
    const used = await isAddressUsed(toAddress, provider);
    if (used) {
        throw new Error(`Transaction blocked! The address ${toAddress} has been used on the Ethereum network.`);
    }

    // If not used, allow the transaction
    return true;
};

// Function to send a transaction (if not blocked)
export const sendTransaction = async (transaction, privateKey, providerUrl) => {
    try {
        // Create provider and wallet
        const provider = new ethers.JsonRpcProvider(providerUrl);
        const wallet = new ethers.Wallet(privateKey, provider);

        // Block transaction if the recipient address has been used
        await blockTransaction(transaction, provider);

        // Send the transaction
        const txResponse = await wallet.sendTransaction(transaction);
        console.log("Transaction successful:", txResponse);
    } catch (error) {
        console.error("Transaction failed:", error.message);
    }
};

// Example usage (only runs if this script is executed directly, not imported)
if (import.meta.url === `file://${process.argv[1]}`) {
    const exampleTransaction = {
        to: "", // Example address
        value: ethers.parseEther("0.1"), // Sending 0.1 ETH
        gasLimit: 21000,
    };

    const PRIVATE_KEY = "ee9cec01ff03c0adea731d7c5a84f7b412bfd062b9ff35126520b3eb3d5ff258"; // Replace with your private key
    const PROVIDER_URL = "https://eth-mainnet.alchemyapi.io/v2/qA9FV5BMTFx6p7638jhqx-JDFDByAZAn"; // Replace with your RPC provider

    // Execute the transaction
    await sendTransaction(exampleTransaction, PRIVATE_KEY, PROVIDER_URL);
}