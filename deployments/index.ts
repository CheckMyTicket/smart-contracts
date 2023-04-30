import * as mumbaiDeploy from './mumbai/Cryptobadies.json'
import * as rinkebyDeploy from './rinkeby/Cryptobadies.json'
import * as rinkebyFactoryDeploy from './rinkeby/Cb721Factory.json'
import * as goerliDeploy from './goerli/Cryptobadies.json'
import * as goerliErc20Deploy from './goerli/Erc20Token.json'
import * as ethereumDeploy from './ethereum/Cryptobadies.json'


const cbGoerli = {
    address: goerliDeploy.address,
    abi: goerliDeploy.abi
} 

const cbMumbai = {
    address: mumbaiDeploy.address,
    abi: mumbaiDeploy.abi
} 

const cbRinkeby = {
    address: rinkebyDeploy.address,
    abi: rinkebyDeploy.abi
} 

const cbEthereum = {
    address: ethereumDeploy.address,
    abi: ethereumDeploy.abi
} 

const erc20Token = {
    abi: goerliErc20Deploy.abi
}

// const cbFactoryRinkeby = {
//     address: rinkebyFactoryDeploy.address,
//     abi: rinkebyFactoryDeploy.abi
// } 
export enum contractType {
    Factory = 'factory',
    NFT721 = 721,
    ERC20 = 'erc20'
}
export function getContractData(network:string, type?:contractType){
    if(network === 'rinkeby' && !type){
        return cbRinkeby
    } else if (network === 'mumbai' && !type){
        return cbMumbai
    } else if (network === 'goerli' && !type){
        return cbGoerli
    } else if (network === 'ethereum' && !type){
        return cbEthereum
    }else {
        throw 'No network selected to get contract data'
    }
}