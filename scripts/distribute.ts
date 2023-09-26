import { ethers, network } from "hardhat";
import type { CoreProxy } from "@synthetixio/v3-contracts/build/mainnet/CoreProxy";

export type CoreProxyType = CoreProxy;

export async function importCoreProxy(chainName: string) {
  switch (chainName) {
    case "mainnet":
      return import("@synthetixio/v3-contracts/build/mainnet/CoreProxy");
    case "goerli":
      return import("@synthetixio/v3-contracts/build/goerli/CoreProxy");
    case "optimism-mainnet":
      return import(
        "@synthetixio/v3-contracts/build/optimism-mainnet/CoreProxy"
      );
    case "optimism-goerli":
      return import(
        "@synthetixio/v3-contracts/build/optimism-goerli/CoreProxy"
      );
    default:
      throw new Error(`Unsupported chain ${chainName}`);
  }
}

async function main() {
  const { address, abi } = await importCoreProxy(network.name);
  const [signer, deployer] = await ethers.getSigners();

  // Connect to the rewards distributor
  // Get abi from local artifacts
  const rewardsABI =
    require("../artifacts/contracts/ExampleRewardsDistributor.sol/ExampleRewardsDistributor.json").abi;

  const rewardsAddress = process.env.REGISTERED_DISTRIBUTOR as string;

  const RewardsDistributor = new ethers.Contract(
    rewardsAddress,
    rewardsABI,
    signer
  );

  // Distribute rewards to Spartan Council SNX vault
  await RewardsDistributor.distributeRewards(
    1n,
    "0x2E5ED97596a8368EB9E44B1f3F25B2E813845303", // SNX Collateral Address
    1234567890123456789012345678901234567890n,
    1695734865,
    0
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
