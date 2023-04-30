import { ethers } from 'hardhat';
import * as env from 'utils/env';
import { TransactionResponse } from '@ethersproject/abstract-provider';
//import { address, abi } from  `../deployments/${network}/Cryptobadies.json`   //`deployments/mumbai/Cryptobadies.json`;
import { getContractData, contractType } from 'deployments';
import { readArgFromEvent } from 'test/utils/event-utils';

async function main(network: string) {
  const [privateKey] = env.getAccounts(network) as string[];
  const nodeUri = env.getNodeUrl(network);
  const { address, abi } = getContractData(network, contractType.Factory);
  //console.log(1, abi);
  const signerWallet = new ethers.Wallet(privateKey);
  const provider = new ethers.providers.JsonRpcProvider(nodeUri);
  const signer = signerWallet.connect(provider);
  const cbFactoryContract = new ethers.Contract(address, abi, provider);
  const ownerAddress = await cbFactoryContract.connect(signer).owner();
  console.log(`Owner address: ${ownerAddress}`);
  console.log(`Sending Tx on ${network} network`);
  let DeployCollection: TransactionResponse = await cbFactoryContract
    .connect(signer)
    .newCollection('Cb2', 'Cb2', 'https://gateway.pinata.cloud/ipfs/QmYmu2yVPDyd6fDZ2GQnwE9s1g6BGL2K5XBzSpeHCoA2by/', 46);
  console.log('Tx sent...');
  console.log('Waiting Tx');
  // Get arguments from Event DeployCollection
  const deployCollectionEvent = await readArgFromEvent(DeployCollection, 'DeployCollection', 'nftAddress');
  console.log('Cryptobadies collection address:', deployCollectionEvent);
  //   const DeployCollectionReceipt: TransactionReceipt = await DeployCollection.wait();
  //   console.log('Tx receipt', DeployCollectionReceipt);
}

main('rinkeby') // Set network here
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
