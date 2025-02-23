import { useQuery } from '@tanstack/react-query';
import { createPublicClient, http, type Chain } from 'viem';

import { HyperliquidNamesABI } from './HyperliquidNamesABI';
import { useAccount } from 'wagmi';

const HyperliquidNameAddressMainnet =
  '0x1d9d87eBc14e71490bB87f1C39F65BDB979f3cb7';

const hyperliquidMainnet = {
  id: 998,
  name: 'Hyperliquid Testnet',
  nativeCurrency: {
    name: 'HYPE',
    symbol: 'HYPE',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.hyperliquid.xyz/evm'],
    },
    public: {
      http: ['https://rpc.hyperliquid.xyz/evm'],
    },
  },
  testnet: true,
} as const satisfies Chain;

const publicClientMainnet = createPublicClient({
  chain: hyperliquidMainnet,
  transport: http(),
});

/** Gets the PrimaryName for the address */
export const useGetPrimaryName = () => {
  const { address } = useAccount();

  const getPrimaryName = async () => {
    try {
      if (!address) return '';
      const primaryName = await publicClientMainnet.readContract({
        abi: HyperliquidNamesABI,
        address: HyperliquidNameAddressMainnet,
        functionName: 'primaryName',
        args: [address],
      });
      return primaryName || '';
    } catch (_error) {
      return '';
    }
  };

  const {
    data: primaryName,
    isLoading: isPrimaryNameLoading,
    error: primaryNameError,
    refetch: refetchPrimaryName,
  } = useQuery({
    queryKey: ['primaryName', address ? address : ''],
    queryFn: getPrimaryName,
    enabled: !!address,
    initialData: '',
  });

  return {
    primaryName,
    isPrimaryNameLoading,
    primaryNameError,
    refetchPrimaryName,
  };
};
