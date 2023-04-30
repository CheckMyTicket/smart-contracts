import { run, ethers } from 'hardhat';

async function main() {
  run('compile');
  const Erc20 = await ethers.getContractFactory('Erc20Token');
  for (let i = 1; i < 6; i++) {
    const erc20 = await Erc20.deploy(`token${i}`, `TT${i}`);
    console.log('Tokens deployed to:', erc20.address);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
