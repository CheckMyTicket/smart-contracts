import { ethers } from 'hardhat';
import * as env from 'utils/env';
//import { address, abi } from  `../deployments/${network}/Cryptobadies.json`   //`deployments/mumbai/Cryptobadies.json`;
import { getContractData } from 'deployments';

async function main(network: string) {
  const [privateKey] = env.getAccounts(network) as string[];
  const nodeUri = env.getNodeUrl(network);
  const { address, abi } = getContractData(network);

  const signerWallet = new ethers.Wallet(privateKey);
  const provider = new ethers.providers.JsonRpcProvider(nodeUri);
  const signer = signerWallet.connect(provider);
  const cryptobadiesContract = new ethers.Contract(address, abi, provider);

  console.log(`Sending Tx on ${network} network`);
  let mintNftTx = await cryptobadiesContract.connect(signer).safeMint(signerWallet.address);
  console.log('Tx sent:', mintNftTx);
  console.log('Waiting Tx');
  mintNftTx = await mintNftTx.wait();
  console.log('Tx receipt', mintNftTx);
}

main('rinkeby') // Set network here
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
