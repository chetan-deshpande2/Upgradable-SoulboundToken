require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-etherscan");
require("hardhat-gas-reporter");
require("dotenv").config();
require("solidity-coverage");

const { PRIVATE_KEY, POLYGON_API_KEY, POLYGON_RPC_URL } = process.env;


task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});



module.exports = {
  solidity: {
    version: "0.8.16",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  plugins: ["solidity-coverage"],

  networks: {
    hardhat: {},

    matic: {
      url: POLYGON_RPC_URL,
      accounts: [PRIVATE_KEY],
      
    },
  },
  etherscan: {
    apiKey: POLYGON_API_KEY,
  },
};