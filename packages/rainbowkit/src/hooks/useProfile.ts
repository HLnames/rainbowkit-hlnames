import type { Address } from 'viem';
import { useBalance } from 'wagmi';
import { useMainnetEnsAvatar } from './useMainnetEnsAvatar';
import { useMainnetEnsName } from './useMainnetEnsName';
import { useGetPrimaryName } from './useGetPrimaryName';

interface UseProfileParameters {
  address?: Address;
  includeBalance?: boolean;
}

export function useProfile({ address, includeBalance }: UseProfileParameters) {
  const ensName = useMainnetEnsName(address);
  const { primaryName: hyperLiquidName } = useGetPrimaryName();
  const ensAvatar = useMainnetEnsAvatar(ensName);
  const { data: balance } = useBalance({
    address: includeBalance ? address : undefined,
  });
  // prioritizes hyperliquid name, keeps ens name
  const primaryName = hyperLiquidName === '' ? ensName : hyperLiquidName;

  return { ensName: primaryName, ensAvatar, balance };
}
