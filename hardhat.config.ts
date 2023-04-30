import 'dotenv/config';
import '@nomicfoundation/hardhat-toolbox';
import '@nomicfoundation/hardhat-chai-matchers';
import 'hardhat-gas-reporter';
import { removeConsoleLog } from 'hardhat-preprocessor';
import 'hardhat-deploy';
import { HardhatUserConfig, MultiSolcUserConfig, NetworksUserConfig } from 'hardhat/types';
import * as env from './utils/env';
import 'tsconfig-paths/register';
const networks: NetworksUserConfig =
  env.isHardhatCompile() || env.isHardhatClean() || env.isTesting()
    ? {}
    : {
        hardhat: {
          forking: {
            enabled: process.env.FORK ? true : false,
            url: env.getNodeUrl('ethereum'),
            blockNumber: 15729528,
          },
        },
        goerli: {
          url: env.getNodeUrl('goerli'),
          accounts: env.getAccounts('goerli'),
        },
        ethereum: {
          url: env.getNodeUrl('ethereum'),
          accounts: env.getAccounts('ethereum'),
        },
        mumbai: {
          url: env.getNodeUrl('mumbai'),
          accounts: env.getAccounts('mumbai'),
          gasPrice: 35000000000,
        },
        rinkeby: {
          url: env.getNodeUrl('rinkeby'),
          accounts: env.getAccounts('rinkeby'),
        },
      };

const config: HardhatUserConfig = {
  defaultNetwork: 'hardhat',
  namedAccounts: {
    deployer: {
      default: 0,
    },
    testSigner: {
      default: 1,
    },
  },
  mocha: {
    timeout: process.env.MOCHA_TIMEOUT || 300000,
  },
  networks,
  solidity: {
    compilers: [
      {
        version: '0.8.7',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  gasReporter: {
    currency: 'USD',
    coinmarketcap: '4d8e3620-9afc-48ad-bd27-df4cc291283a',
    showMethodSig: true,
    onlyCalledMethods: true,
    gasPriceApi: 'https://api.etherscan.io/api?module=proxy&action=eth_gasPrice',
  },
  preprocess: {
    eachLine: removeConsoleLog((hre) => hre.network.name !== 'hardhat'),
  },
  etherscan: {
    apiKey: {
      polygonMumbai: 'E382S9ZZKR2HZWEZIVNHTS5NH5JKJPPZC3', //env.getEtherscanAPIKeys(['mumbai']),
      rinkeby: 'P513WVQ4T8A3A4QPXMSI1N9VVGKUJ2ZFTT', //env.getEtherscanAPIKeys(['rinkeby']),
    },
  },
  typechain: {
    outDir: 'typechained',
    target: 'ethers-v5',
  },
  paths: {
    sources: './solidity',
  },
};

if (env.isTesting()) {
  (config.solidity as MultiSolcUserConfig).compilers = (config.solidity as MultiSolcUserConfig).compilers.map((compiler) => {
    return {
      ...compiler,
      outputSelection: {
        '*': {
          '*': ['storageLayout'],
        },
      },
    };
  });
}

export default config;
