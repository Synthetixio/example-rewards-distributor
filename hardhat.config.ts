import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  networks: {
    "optimism-goerli": {
      url: process.env.RPC_URL as string,
      accounts: [
        process.env.PRIVATE_KEY as string,
        process.env.PRIVATE_KEY_DEPLOYER as string,
      ],
      gasPrice: 1000000000,
    },
  },
};

export default config;
