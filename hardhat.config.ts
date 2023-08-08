import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  networks: {
    cannon: {
      url: `http://127.0.0.1:8545`,
      accounts: [process.env.PRIVATE_KEY as string],
    },
  },
};

export default config;
