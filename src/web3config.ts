import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/html'
import { configureChains, createConfig } from '@wagmi/core'
import { arbitrum } from '@wagmi/core/chains'

const chains = [arbitrum]
const projectId = '98452b5a49ffeef80b291ec3bddd752b'

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })])
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, version: 1, chains }),
  publicClient
})
const ethereumClient = new EthereumClient(wagmiConfig, chains)

const walletIds = {
  metamask: 'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96',
  // binance: '7ba1202d012a1402c8c56331471b183d2aaafb99a667dfdaf2ac4a123ea604ed',
  // coinbase: 'fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa', //* Coinbase is already implemented via a provider bundled with Wagmi (which is better than the default one), so the default one will seem like a duplicate on mobiles.
  // trust: '4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0',
};

export const web3modal = new Web3Modal({ projectId, explorerRecommendedWalletIds: Object.values(walletIds) }, ethereumClient)
