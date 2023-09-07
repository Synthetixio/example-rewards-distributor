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
  const { address: CoreProxyAddress } = await importCoreProxy(network.name);

  const rewardAmount = 1234567890123456789012345678901234567890n;
  const [signer] = await ethers.getSigners();

  const collateralFactory = await ethers.getContractFactory("CollateralMock");
  const Collateral = await collateralFactory.connect(signer).deploy();

  await (
    await Collateral.initialize("Fake Collateral Token", "FAKE", 18)
  ).wait();

  const rewards = await ethers.getContractFactory("ExampleRewardsDistributor");

  const RewardsDistributor = await rewards
    .connect(signer)
    .deploy(
      CoreProxyAddress,
      Collateral.getAddress(),
      "Example Rewards Distributor V3"
    );

  // Mint collateral tokens to RewardsDistributor
  await Collateral.mint(RewardsDistributor.getAddress(), rewardAmount);

  console.log(
    `Rewards Distributor deployed`,
    await RewardsDistributor.getAddress()
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
