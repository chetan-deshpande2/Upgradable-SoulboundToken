const { ethers, run, upgrades } = require('hardhat');

async function main() {
  const CertificationV1 = await ethers.getContractFactory(
    'CertificateUpgradable'
  );

  const certificate = await upgrades.deployProxy(
    CertificationV1,
    ['Test', 'TST', 1],
    {
      kind: 'uups',
    }
  );
  await certificate.deployed();

  console.log(`Certificate Contract Deployed At ${certificate.address}`);

  const verifyContract = await run('verify:verify', {
    address: certificate.address,
  });

  console.log(`Verified Contract Address ${certificate.address}`);
}

main();
