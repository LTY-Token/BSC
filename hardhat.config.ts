import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-etherscan';
import '@nomiclabs/hardhat-waffle';
import '@typechain/hardhat';
import 'hardhat-deploy';
import { HardhatUserConfig, task } from 'hardhat/config';
import 'solidity-coverage';
import { BSCSCAN_API_KEY, TEST_PRIVATE_KEY } from './env';

function typedNamedAccounts<T>(namedAccounts: { [key in string]: T }) {
  return namedAccounts;
}

const config: HardhatUserConfig = {
  solidity: {
    version: '0.6.12',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    private: {
      url: 'http://52.12.224.224:8545',
      chainId: 1337,
      accounts: [TEST_PRIVATE_KEY],
    },
    bsctestnet: {
      url: 'https://data-seed-prebsc-1-s1.binance.org:8545',
      chainId: 97,
      accounts: [TEST_PRIVATE_KEY],
    }
  },
  etherscan: {
    apiKey: BSCSCAN_API_KEY,
  },
  namedAccounts: typedNamedAccounts({
    deployer: {
      private: 0,
      bsctestnet: 0,
    },
    pancakeswapRouter: {
      private: '0xDbba2DF274ED3fD1350f5D18F85148Fb01fAbbfC',
      bsctestnet: '0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3',
    },
    usdc: {
      private: '0xFF7F978a9e591C2a870aEc1fD0876f7FF8f3036e',
      bsctestnet: '0xcac913Ab86ef470781b5300ADC6720540838fac2',
    },
  }),
  typechain: {
    externalArtifacts: [
      './pancakeswap_build/**/*.json',
    ],
  },
};

export default config;

task('deploy-test-environment', 'Setup test environment for testing purposes', async (args, { ethers }) => {
  const { deployPancakeswap } = await import('./shared/utils');
  const [signer] = await ethers.getSigners();
  const { factory, router, wbnb } = await deployPancakeswap(signer);
  console.log('Factory:', factory.address);
  console.log('Router:', router.address);
  console.log('WBNB:', wbnb.address);
  const mockUsdc = await (await ethers.getContractFactory('MockUSDC')).deploy();
  console.log('Mock USDC:', mockUsdc.address);
});
