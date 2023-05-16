import { fetchBalance, getAccount } from "@wagmi/core";

import { web3modal } from "./web3config";

const connectModalButton = document.querySelector(
  '[data-bs-target="#connectModal"]'
) as HTMLAnchorElement | null;
connectModalButton?.addEventListener("click", () => {
  web3modal.openModal();
});

const tokenList = document.getElementById("tokenList") as HTMLDivElement | null;

type Token = {
  symbol: string;
  longName: string;
  address: `0x${string}` | undefined;
  quantity: number | string;
  /** @example 'assets/arbitrum.png' */
  image?: string;
};

function addNewTokenToList({
  symbol,
  longName,
  address,
  quantity,
  image,
}: Token) {
  let newItem = document.createElement("div");

  newItem.innerHTML = `
    <div class="d-flex align-items-center mb-3">
      <img src="${image}" alt="" width="40" style="padding-left: 10px;">
      <div class="d-flex align-items-center flex-column">
        <div class="d-flex flex-row crypto-items">
          <span class="span-crypto-name">${symbol}</span>
          <span class="span-crypto-name2">${longName}</span>
        </div>
        <div class="d-flex flex-column">
          <a class="crypto-a textDecoration" href="${
            address ? `https://arbiscan.io/token/${address}` : "#"
          }" target="_blank" rel="noreferrer">${formatEtherAddressToShort(
    address
  )}</a>
          <span class="card-smallText_selectToken">Arbed Uniswap List and 2 more lists</span>
        </div>
      </div>
      <span class="span-cost">${formatEtherQuantityShort(
        quantity
      )} ${symbol}</span>
    </div>
  `;
  newItem = newItem.children[0] as HTMLDivElement;

  tokenList?.appendChild(newItem);
}

function formatEtherQuantityShort(quantity: string | number): string {
  const precision = 4;
  const quantityAsNumber = Number(quantity);

  if (Math.abs(quantityAsNumber) < 1) {
    return removeTrailingZeroesFromNumberString(
      quantityAsNumber.toPrecision(precision)
    );
  }

  return removeTrailingZeroesFromNumberString(
    quantityAsNumber.toFixed(precision)
  );
}
function removeTrailingZeroesFromNumberString(str: string) {
  return String(Number(str));
}

/** Formats a long address as `0x111...c302` */
function formatEtherAddressToShort(address: `0x${string}` | undefined) {
  if (!address) return "...";
  const firstPart = address.slice(0, 5);
  const secondPart = address.slice(-4);
  return `${firstPart}...${secondPart}`;
}

const tokens: Token[] = [
  {
    symbol: "USDT",
    longName: "Tether USD",
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    quantity: 0,
    image: getEthplorerTokenImageLink("tether"),
  },
  {
    symbol: "DAI",
    longName: "Dai Stablecoin",
    address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    quantity: 0,
    image: getEthplorerTokenImageLink("mcd-dai"),
  },
  {
    symbol: "USDC",
    longName: "USD Coin",
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    quantity: 0,
    image: getEthplorerTokenImageLink("usdc"),
  },
  {
    symbol: "ETH",
    longName: "Ethereum",
    address: undefined,
    quantity: 0,
    image: getEthplorerTokenImageLink("eth"),
  },
  {
    symbol: "WETH",
    longName: "Wrapped Ether",
    address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    quantity: 0,
    image: getEtherscanTokenImageLink("weth_28"),
  },
  {
    symbol: "ARB",
    longName: "Arbitrum",
    address: "0xB50721BCf8d664c30412Cfbc6cf7a15145234ad1",
    quantity: 0,
    image: getEtherscanTokenImageLink("arbitrumone2_32"),
  },
];

const account = getAccount();

const tokensWithBalances = await Promise.all(
  tokens.map(async (token) => {
    if (!account.address) {
      console.info("Not connected to Web3 Wallet");
      return token;
    }

    try {
      const fetched = await fetchBalance({
        address: account.address,
        token: token.address,
      });

      return {
        ...token,
        quantity: fetched.formatted,
      };
    } catch (error) {
      console.warn(`Could not get balance for ${token.symbol}`, error);
      return token;
    }
  })
);

tokensWithBalances.forEach(addNewTokenToList);

function getEtherscanTokenImageLink<T extends string>(name: T) {
  return `https://etherscan.io/token/images/${name}.png` as const;
}

function getEthplorerTokenImageLink<T extends string>(name: T) {
  return `https://ethplorer.io/images/${name}.png` as const;
}
