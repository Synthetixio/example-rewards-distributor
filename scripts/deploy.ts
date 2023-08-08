import { ethers } from "hardhat";

async function main() {
  const rewardAmount = ethers.parseEther("1000");
  const signers = await ethers.getSigners();
  console.log("Signers: ", signers);

  const collateral = await ethers.deployContract("CollateralMock");
  await collateral.waitForDeployment();

  console.log(`Collateral deployed`, collateral);

  await collateral.initialize("Fake Reward", "FAKE", 6);

  const rewards = await ethers.deployContract("ExampleRewardsDistributor");
  await rewards.waitForDeployment();

  // Initalize rewards with the core proxy
  await rewards.initialize(
    process.env.CORE_PROXY_ADDRESS as string,
    collateral.getAddress(),
    "Example Rewards"
  );

  console.log(`Rewards deployed`, rewards);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
