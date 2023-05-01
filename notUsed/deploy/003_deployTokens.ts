// import { HardhatRuntimeEnvironment } from 'hardhat/types';
// import { DeployFunction } from 'hardhat-deploy/types';
// import { shouldVerifyContract } from '../utils/deploy';

// const deployFunction: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
//   const { deployer } = await hre.getNamedAccounts();

//   const deploy = await hre.deployments.deploy('Erc20Token', {
//     contract: 'solidity/contracts/Erc20Token.sol:Erc20Token',
//     from: deployer,
//     args: ['Token', 'TS'],
//     log: true,
//   });

//   if (await shouldVerifyContract(deploy)) {
//     await hre.run('verify:verify', {
//       address: deploy.address,
//       //constructorArguments: [INITIAL_GREET[chainId]],
//     });
//   }
// };
// deployFunction.dependencies = [];
// deployFunction.tags = ['Erc20Token'];
// export default deployFunction;
