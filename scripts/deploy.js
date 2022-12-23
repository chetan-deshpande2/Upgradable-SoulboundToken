
const hre = require("hardhat");

async function main() {

  const SoulBoundToken = await hre.ethers.getContractFactory("Test")
  const soulToken = await SoulBoundToken.deploy("Test","TST","V1")

  await soulToken.deployed();

  console.log(
    `Token Contract Address ${soulToken.address}`
  );

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
