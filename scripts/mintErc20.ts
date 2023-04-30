import { ethers } from 'hardhat';
import * as env from 'utils/env';
//import { address, abi } from  `../deployments/${network}/Cryptobadies.json`   //`deployments/mumbai/Cryptobadies.json`;
import { contractType, getContractData } from 'deployments';

async function main(network: string) {
  const [privateKey] = env.getAccounts(network) as string[];
  const nodeUri = env.getNodeUrl(network);
  const { abi } = getContractData(network, contractType.ERC20);
  const addresses = [
    '0x614AcD20434dDc7EC30561750b592ca1A8aCD173',
    '0x4887406F392428C6Dc4F823dE5af398928D614fc',
    '0x7e180Ec5D6562f56C3AA3ca1f490799016da25Ce',
    '0xaF92946E7bd3BFbC9e72B89810a34AE461336828',
    '0xBA3Ebf4d469f5211C67a1C7301f147c3105A51E4',
  ];

  const signerWallet = new ethers.Wallet(privateKey);
  const provider = new ethers.providers.JsonRpcProvider(nodeUri);
  const signer = signerWallet.connect(provider);
  console.log(`Sending Tx on ${network} network`);
  for (let address of addresses) {
    const erc20Contract = new ethers.Contract(address, abi, provider);
    let ethersToWei = ethers.utils.parseUnits('10', 'ether');
    let mintErc20Tx = await erc20Contract.connect(signer).mint(signerWallet.address, ethersToWei);
    //console.log('Tx sent:', mintErc20Tx);
    //console.log('Waiting Tx');
    mintErc20Tx = await mintErc20Tx.wait();
    console.log('Tx receipt', mintErc20Tx);
  }
}

main('goerli') // Set network here
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
