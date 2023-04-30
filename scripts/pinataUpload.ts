import * as pinataSDK from '@pinata/sdk';
import 'dotenv/config';
import * as fs from 'fs';
import { nftJsonMetadata } from '../types';
const metadataPath = 'C:/Users/Rafael/ceercle/cryptobadies-smart-contracts/scripts/nftsMetadata';
const imagePath = 'C:/Users/Rafael/ceercle/cryptobadies-smart-contracts/nftImages';
const testImage = 'C:/Users/Rafael/ceercle/cryptobadies-smart-contracts/scripts/gameImages';
console.log(process.env.API_KEY);
if (!process.env.API_KEY) {
  throw new Error('No api key');
}
if (!process.env.API_SECRET) {
  throw new Error('No api secret');
}

const pinata = pinataSDK.default(process.env.API_KEY, process.env.API_SECRET);

async function uploadFromFile() {
  let id = 0;
  fs.readdir(imagePath, async (err, files) => {
    const lastElement = files.splice(-1, 1)[0];
    files.splice(0, 0, lastElement);
    console.log('Array of filenames', files);
    for await (let fileName of files) {
      const readableStreamForFile = fs.createReadStream(`${imagePath}/${fileName}`);
      const pinataResponse = await pinata.pinFileToIPFS(readableStreamForFile);
      const metadata: nftJsonMetadata = {
        title: '😈🔥Cr1pt0 B4d13$ - Kali Program🔥😈',
        name: fileName.replace('.png', ''),
        description: 'This NFT will give you access to our programs and all the nice events and surprises we are developing for you.',
        image: `https://gateway.pinata.cloud/ipfs/${pinataResponse.IpfsHash}`,
      };
      console.log('metadata', metadata);
      fs.appendFile(`./scripts/nftsMetadata/${id}`, JSON.stringify(metadata), (err) => console.log(err?.message));
      id++;
    }
  });
}
uploadFromFile();
// async function uploadFromDirectory() {
//   try {
//     const pinataResponse = await pinata.pinFromFS('C:/Users/Rafael/ceercle/cryptobadies-smart-contracts/scripts/nftsMetadata');
//     console.log('Metadata of images:', pinataResponse);
//   } catch (error) {
//     console.log(error);
//   }
// }
// uploadFromDirectory();
