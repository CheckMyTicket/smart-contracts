// import { HardhatRuntimeEnvironment } from 'hardhat/types';
// import { DeployFunction } from 'hardhat-deploy/types';
// import { shouldVerifyContract } from '../../utils/deploy';

// const deployFunction: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
//   const { deployer } = await hre.getNamedAccounts();

//   const deploy = await hre.deployments.deploy('Cb721Factory', {
//     contract: 'solidity/contracts/Cb721Factory.sol:Cb721Factory',
//     from: deployer,
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
// deployFunction.tags = ['Cb721Factory'];
// export default deployFunction;
