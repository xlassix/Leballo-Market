require("@nomiclabs/hardhat-waffle");
require('dotenv').config({path:".env.local"})
const project_id = process.env.project_id
const private_key = process.env.private_key

module.exports = {
  networks:{
    hardhat:{
      chainId:1337
    },
    mumbai:{
      url:`https://polygon-mumbai.infura.io/v3/${project_id}`,
      accounts: [private_key]
    },
    mainnet: {
      url:`https://polygon-mainnet.infura.io/v3/${project_id}`,
      accounts: [private_key]
    },
  },
  solidity: "0.8.4",
};
