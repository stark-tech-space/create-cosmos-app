import BigNumber from 'bignumber.js';
import { Asset, AssetList } from '@chain-registry/types';
import { asset_list, assets } from '@chain-registry/osmosis';
import {
  getAssetByDenom,
  getDenomByCoinGeckoId,
  // getSymbolByChainDenom,
  getSymbolByDenom,
  getExponentByDenom as _getExponentByDenom,
  // convertCoinGeckoPricesToDenomPriceMap,
  mapCoinGeckoPricesToDenoms,
  // getChainDenomBySymbol,
  getDenomBySymbol,
  // convertBaseUnitsToDollarValue,
  convertBaseUnitToDollarValue,
  // convertDollarValueToDenomUnits,
  convertDollarValueToBaseUnit,
  // convertBaseUnitsToDisplayUnits,
  convertBaseUnitToDisplayUnit,
  convertBaseUnitToDisplayUnitByDenom,
} from '@chain-registry/utils';
import { Pool } from 'osmo-query/dist/codegen/osmosis/gamm/pool-models/balancer/balancerPool';
import { Coin } from 'osmo-query/dist/codegen/cosmos/base/v1beta1/coin';
import {
  calcPoolLiquidity as _calcPoolLiquidity,
  getPoolByGammName as _getPoolByGammName,
  convertGammTokenToDollarValue as _convertGammTokenToDollarValue,
  convertDollarValueToCoins as _convertDollarValueToCoins,
  convertDollarValueToShares as _convertDollarValueToShares,
  prettyPool as _prettyPool,
  calcCoinsNeededForValue as _calcCoinsNeededForValue,
  getCoinBalance as _getCoinBalance,
  calcMaxCoinsForPool as _calcMaxCoinsForPool,
  calcShareOutAmount as _calcShareOutAmount,
} from '@osmonauts/math';

import {
  CoinGeckoToken,
  CoinDenom,
  Exponent,
  CoinSymbol,
  PriceHash,
  CoinGeckoUSDResponse,
  CoinValue,
  PoolPretty,
  CoinBalance,
  PoolAssetPretty,
} from './types';
import { Fee } from '@/hooks';

export const osmosisAssets: Asset[] = [
  ...assets.assets,
  ...asset_list.assets.filter((item) => item.display != 'usdc'),
].filter(({ type_asset }) => type_asset !== 'ics20');

export const osmosisAssetsList: AssetList[] = [
  {
    assets: osmosisAssets,
    chain_name: 'osmosis',
  },
];
// console.log(asset_list, assets, osmosisAssetsList);
export const getOsmoAssetByDenom = (denom: CoinDenom): Asset => {
  return getAssetByDenom(osmosisAssetsList, denom) as Asset;
};

export const getDenomForCoinGeckoId = (
  coinGeckoId: CoinGeckoToken
): CoinDenom => {
  return getDenomByCoinGeckoId(osmosisAssetsList, coinGeckoId) as CoinDenom;
};

export const getSymbolForDenom = (denom: CoinDenom): CoinSymbol => {
  return getSymbolByDenom(osmosisAssetsList, denom) as CoinSymbol;
};

export const getExponentByDenom = (denom: CoinDenom): Exponent => {
  return _getExponentByDenom(osmosisAssetsList, denom) as Exponent;
};

export const convertGeckoPricesToDenomPriceHash = (
  prices: CoinGeckoUSDResponse
): PriceHash => {
  return mapCoinGeckoPricesToDenoms(osmosisAssetsList, prices);
};

export const calcPoolLiquidity = (pool: Pool, prices: PriceHash): string => {
  // @ts-ignore
  return _calcPoolLiquidity(osmosisAssets, pool, prices);
};

export const getPoolByGammName = (pools: Pool[], gammId: string): Pool => {
  return _getPoolByGammName(pools, gammId);
};

export const convertGammTokenToDollarValue = (
  coin: Coin,
  pool: Pool,
  prices: PriceHash
): string => {
  // @ts-ignore
  return _convertGammTokenToDollarValue(osmosisAssets, coin, pool, prices);
};

export const convertDollarValueToCoins = (
  value: string | number,
  pool: Pool,
  prices: PriceHash
): CoinValue[] => {
  // @ts-ignore
  return _convertDollarValueToCoins(osmosisAssets, value, pool, prices);
};

export const convertDollarValueToShares = (
  value: string | number,
  pool: Pool,
  prices: PriceHash
) => {
  // @ts-ignore
  return _convertDollarValueToShares(osmosisAssets, value, pool, prices);
};

export const prettyPool = (
  pool: Pool,
  { includeDetails = false } = {}
): PoolPretty => {
  // @ts-ignore
  return _prettyPool(osmosisAssets, pool, { includeDetails });
};

export const getOsmoDenomForSymbol = (token: CoinSymbol): CoinDenom => {
  return getDenomBySymbol(osmosisAssetsList, token) as CoinDenom;
};

export const noDecimals = (num: number | string) => {
  return new BigNumber(num).decimalPlaces(0, BigNumber.ROUND_DOWN).toString();
};

export const baseUnitsToDollarValue = (
  prices: PriceHash,
  symbol: string,
  amount: string | number
) => {
  return convertBaseUnitToDollarValue(
    osmosisAssetsList,
    prices,
    symbol,
    amount
  );
};

export const dollarValueToDenomUnits = (
  prices: PriceHash,
  symbol: string,
  value: string | number
) => {
  return convertDollarValueToBaseUnit(osmosisAssetsList, prices, symbol, value);
};

export const baseUnitsToDisplayUnits = (
  symbol: string,
  amount: string | number
) => {
  return convertBaseUnitToDisplayUnit(osmosisAssetsList, symbol, amount);
};

export const calcCoinsNeededForValue = (
  prices: PriceHash,
  poolInfo: PoolPretty,
  value: string | number
) => {
  // @ts-ignore
  return _calcCoinsNeededForValue(osmosisAssets, prices, poolInfo, value);
};

export const getCoinBalance = (
  prices: PriceHash,
  balances: Coin[],
  prettyAsset: PoolAssetPretty
): CoinBalance => {
  // @ts-ignore
  return _getCoinBalance(osmosisAssets, prices, balances, prettyAsset);
};

export const calcMaxCoinsForPool = (
  prices: PriceHash,
  poolInfo: PoolPretty,
  balances: Coin[]
) => {
  // @ts-ignore
  return _calcMaxCoinsForPool(osmosisAssets, prices, poolInfo, balances);
};

export const calcShareOutAmount = (
  poolInfo: Pool,
  coinsNeeded: Coin[]
): string => {
  return _calcShareOutAmount(poolInfo, coinsNeeded);
};

export const filterPools = (pools: Pool[], prices: PriceHash) => {
  return pools
    .filter(({ $typeUrl }) => !$typeUrl?.includes('stableswap'))
    .filter(({ poolAssets }) =>
      poolAssets.every(
        ({ token }) =>
          prices[token.denom] &&
          !token.denom.startsWith('gamm/pool') &&
          osmosisAssets.find(({ base }) => base === token.denom)
      )
    );
};

interface ExtendPoolProps {
  pool: Pool;
  fees: Fee[];
  balances: Coin[];
  lockedCoins: Coin[];
  prices: PriceHash;
}

export const extendPool = ({
  pool,
  fees,
  balances,
  lockedCoins,
  prices,
}: ExtendPoolProps) => {
  const liquidity = new BigNumber(calcPoolLiquidity(pool, prices))
    .decimalPlaces(0)
    .toNumber();

  // console.log('fees', fees);

  const feeData = fees.find((fee) => fee.pool_id === pool.id.toString());
  const volume24H = Math.round(Number(feeData?.volume_24h || 0));
  const volume7d = Math.round(Number(feeData?.volume_7d || 0));
  const fees7D = Math.round(Number(feeData?.fees_spent_7d || 0));

  const poolDenom = pool.totalShares?.denom;

  const balanceCoin = balances.find(({ denom }) => denom === poolDenom);
  const myLiquidity = balanceCoin
    ? convertGammTokenToDollarValue(balanceCoin, pool, prices)
    : 0;

  const lockedCoin = lockedCoins.find(({ denom }) => denom === poolDenom);
  const bonded = lockedCoin
    ? convertGammTokenToDollarValue(lockedCoin, pool, prices)
    : 0;

  return {
    ...pool,
    liquidity,
    volume24H,
    fees7D,
    volume7d,
    myLiquidity,
    bonded,
    denom: poolDenom,
  };
};

export type ExtendedPool = ReturnType<typeof extendPool>;

export const descByLiquidity = (pool1: ExtendedPool, pool2: ExtendedPool) => {
  return new BigNumber(pool1.liquidity).lt(pool2.liquidity) ? 1 : -1;
};

export const descByMyLiquidity = (pool1: ExtendedPool, pool2: ExtendedPool) => {
  return new BigNumber(pool1.myLiquidity).lt(pool2.myLiquidity) ? 1 : -1;
};

type Item = {
  denom: string;
  [key: string]: any;
};

export const getPoolsByDenom = (allPools: ExtendedPool[], items: Item[]) => {
  return items
    .filter(({ denom }) => allPools.find(({ denom: d }) => d === denom))
    .map(({ denom }) => {
      return allPools.find(({ denom: d }) => d === denom) as ExtendedPool;
    });
};
