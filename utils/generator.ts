import * as fs from 'fs';
import { nftJsonMetadata } from '../types';
const metadataPath = 'C:/Users/Rafael/Downloads/Kalie Badie - Pixel Art Bundle';
export function metadataGenerator(path: fs.PathLike, metadata: nftJsonMetadata) {
  let id = 0;
  fs.readdir(path, (err, files) => {
    files.forEach((fileName) => {
      const metadata: nftJsonMetadata = {
        name: fileName,
        description: 'Cryptobadies test project',
        image: 'url',
      };
      fs.writeFile(`${id}`, JSON.stringify(metadata), (err) => console.log(err));
      id++;
      //console.log(fileName);
    });
  });
}
const imagePath = 'C:/Users/Rafael/ceercle/cryptobadies-smart-contracts/nftImages/Kali (V-1).png';
export function imageGenerator(metadataPath: fs.PathLike, imagePath: fs.PathLike) {
  fs.readdir(metadataPath, (err, files) => {
    files.forEach((fileName) => {
      fs.copyFile(imagePath, `C:/Users/Rafael/ceercle/cryptobadies-smart-contracts/nftImages/${fileName}`, (err) => console.log(err));
      //console.log(fileName);
    });
  });
}
imageGenerator(metadataPath, imagePath);
