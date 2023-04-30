import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { shouldVerifyContract } from '../utils/deploy';

// export const INITIAL_GREET: { [chainId: string]: string } = {
//   '1': 'Halo!',
//   '137': 'Halo to polygon network!',
//   '31337': 'Hello',
//   '80001': 'Hello to mumbai network!',
// };

const deployFunction: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();

  const deploy = await hre.deployments.deploy('Cryptobadies', {
    contract: 'solidity/contracts/Cryptobadies.sol:Cryptobadies',
    from: deployer,
    args: [
      'Kali Program',
      'KP',
      'https://cryptobadies.mypinata.cloud/ipfs/QmVGEpERyVRvYdP5wV7fwQXjsfxm6Wa7ofMJ8fxUD3iSFQ/',
      46,
      '0x20A76e3497baFFa5209784FCB4C4F30EA91D73A1',
    ],
    log: true,
  });

  if (await shouldVerifyContract(deploy)) {
    await hre.run('verify:verify', {
      address: deploy.address,
      //constructorArguments: [INITIAL_GREET[chainId]],
    });
  }
};
deployFunction.dependencies = [];
deployFunction.tags = ['Cryptobadies'];
export default deployFunction;
