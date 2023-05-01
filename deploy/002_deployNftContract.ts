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

  const deploy = await hre.deployments.deploy('Ticket', {
    contract: 'solidity/contracts/Ticket.sol:Ticket',
    from: deployer,
    args: ['Name', 'TEST', 'URI', 46],
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
deployFunction.tags = ['Ticket'];
export default deployFunction;
