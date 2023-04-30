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
  let ethersToWei = ethers.utils.parseUnits('0.27', 'ether');
  let setPricetx = await cryptobadiesContract.connect(signer).setPrice(ethersToWei);
  console.log('Tx sent:', setPricetx);
  console.log('Waiting Tx');
  setPricetx = await setPricetx.wait();
  console.log('Tx receipt', setPricetx);
}

main('ethereum') // Set network here
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
