require("@nomicfoundation/hardhat-toolbox")
require("dotenv").config()
// require("./tasks/block_number")
require("hardhat-gas-reporter")
require("solidity-coverage")
require("hardhat-deploy")
require("@nomiclabs/hardhat-ethers")
// require("@nomiclabs/hardhat-etherscan")
// /** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    defaultNetwork: "hardhat",
    networks: {
        sepolia: {
            url: process.env.RPC_URL,
            accounts: [process.env.PRIVATE_KEY],
            chainId: 11155111,
            blockConfirmations: 6,
        },
        localhost: {
            url: "http://127.0.0.1:8545/",
            // accounts: no need to give account bcoz hardhat takes care of that
            chainId: 31337,
        },
    },
    solidity: {
        compilers: [{ version: "0.8.24" }, { version: "0.6.6" }],
    },
    etherscan: {
        apiKey: process.env.ETHERSCAN_API_KEY,
    },
    gasReporter: {
        enabled: true,
        outputFile: "gas-report.txt",
        noColors: true,
        currency: "INR",
        coinmarketcap: "898eb133-864b-426f-a55a-dbaa9e475e2e",
    },
    namedAccounts: {
        deployer: {
            default: 0, // here this will by default take the first account as deployer
            1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
        },
        users: {
            default: 0,
        },
    },
}

// task can be defined here or can be defined outside and then imported here (dono hi tarika shi hai)
// task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
//     const accounts = await hre.ethers.getSigners()
//     for (const account of accounts) {
//         console.log(account.address)
//     }
// })
