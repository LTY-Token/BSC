import { BigNumber, BigNumberish, Signer } from 'ethers';
import { ethers } from 'hardhat';
import { ILedgity, MockUSDC, PancakeFactory__factory, PancakeRouter, PancakeRouter__factory, WBNB__factory } from '../typechain';
import PancakeFactoryArtifact from '../pancakeswap_build/contracts/PancakeFactory.json';
import PancakeRouterArtifact from '../pancakeswap_build/contracts/PancakeRouter.json';
import WBNBArtifact from '../pancakeswap_build/contracts/WBNB.json';

export async function getBlockTimestamp() {
  return (await ethers.provider.getBlock('latest')).timestamp;
}

export async function evmIncreaseTime(offset: number) {
  await ethers.provider.send('evm_mine', [await getBlockTimestamp() + offset]);
}

const snapshots: string[] = [];
/**
 * Runs `fn` once, saves EVM state and restores it before each tests.
 * USE ONLY ONCE PER `describe` BLOCK.
 */
export function snapshottedBeforeEach(fn: () => Promise<void>) {
  before(async () => {
    snapshots.push(await ethers.provider.send('evm_snapshot', []));
    await fn();
  });

  beforeEach(async () => {
    snapshots.push(await ethers.provider.send('evm_snapshot', []));
  });

  afterEach(async () => {
    if (!await ethers.provider.send('evm_revert', [snapshots.pop()])) {
      throw new Error('evm_revert failed');
    }
  });

  after(async () => {
    if (!await ethers.provider.send('evm_revert', [snapshots.pop()])) {
      throw new Error('evm_revert failed');
    }
  });
}

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
export const NON_ZERO_ADDRESS = '0x0000000000000000000000000000000000000001';
export const LEDGITY_DECIMALS = BigNumber.from('18');
export function toTokens(amount: BigNumberish, decimals: BigNumberish = LEDGITY_DECIMALS) {
  return BigNumber.from(amount).mul(BigNumber.from('10').pow(decimals));
}

export async function addLiquidityUtil(tokenAmountWithoutDecimals: BigNumberish, usdcAmountWithoutDecimals: BigNumberish, token: ILedgity, usdcToken: MockUSDC, router: PancakeRouter, from: string) {
  const tokenAmount = toTokens(tokenAmountWithoutDecimals);
  const usdcAmount = toTokens(usdcAmountWithoutDecimals, await usdcToken.decimals());
  await token.approve(router.address, tokenAmount, { from });
  await usdcToken.mint(from, usdcAmount);
  await usdcToken.approve(router.address, usdcAmount, { from });
  await router.addLiquidity(token.address, usdcToken.address, tokenAmount, usdcAmount, 0, 0, ZERO_ADDRESS, await getBlockTimestamp() + 3600, { from });
}

export async function deployPancakeswap(signer: Signer) {
  const PancakeFactory = new ethers.ContractFactory(PancakeFactoryArtifact.abi, PancakeFactoryArtifact.bytecode, signer) as PancakeFactory__factory;
  const PancakeRouter = new ethers.ContractFactory(PancakeRouterArtifact.abi, PancakeRouterArtifact.bytecode, signer) as PancakeRouter__factory;
  const WBNB = new ethers.ContractFactory(WBNBArtifact.abi, WBNBArtifact.bytecode, signer) as WBNB__factory;
  const factory = await PancakeFactory.deploy(ZERO_ADDRESS);
  const wbnb = await WBNB.deploy();
  const router = await PancakeRouter.deploy(factory.address, wbnb.address);
  return { factory, router, wbnb };
}
