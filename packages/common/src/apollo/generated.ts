import type * as Apollo from "@apollo/client";
import { gql } from "@apollo/client";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** Custom scalar to handle the parsing of arbitrary JSON object data. */
  JSONObject: any;
};

/** The aggregate market balance data for all balances in a wallet. */
export type BalanceAggregate = {
  __typename?: "BalanceAggregate";
  /** The aggregate percentage of change. */
  percentChange: Scalars["Float"];
  /** The aggregate USD value of all balance holdings. */
  value: Scalars["Float"];
  /** The aggregate change in USD value. */
  valueChange: Scalars["Float"];
};

/**
 * Top-level type for providing wallet balance information.
 * Should provide details about native and non-native token balances with aggregation details.
 */
export type Balances = Node & {
  __typename?: "Balances";
  /** The numerical value representing the aggregated market value of all fungible assets in the wallet. */
  aggregate: BalanceAggregate;
  /** Globally unique identifier for a wallet's balances data. */
  id: Scalars["ID"];
  /** Token account balance and market data for the blockchain's native currency. */
  native: TokenBalance;
  /** The Relay connection of token account balances and market data for non-native token types owned by the wallet. */
  tokens?: Maybe<TokenBalanceConnection>;
};

/** Scope enum for cache control. */
export enum CacheControlScope {
  Private = "PRIVATE",
  Public = "PUBLIC",
}

/** Chain ID enum variants for the supported blockchains in the API. */
export enum ChainId {
  Ethereum = "ETHEREUM",
  Solana = "SOLANA",
}

/** `Nft` collection sub-type definition. */
export type Collection = Node & {
  __typename?: "Collection";
  /** The mint or contract address of the collection, presenting an NFT's parental entity. */
  address: Scalars["String"];
  /** Globally unique identifier for an NFT collection object. */
  id: Scalars["ID"];
  /** The image link for the collection or parental contract entity. */
  image?: Maybe<Scalars["String"]>;
  /** The name of the collection or parental contract entity. */
  name?: Maybe<Scalars["String"]>;
  /** Flag to indicate whether or not it has been verified by the relevant ecosystem standards. */
  verified: Scalars["Boolean"];
};

/** Represents a friend reference for the parent `User`. */
export type Friend = Node & {
  __typename?: "Friend";
  /** The image link for a friend's user avatar. */
  avatar: Scalars["String"];
  /** Globally unique identifier for a friend of a user. */
  id: Scalars["ID"];
  /** The Backpack username of the friend. */
  username: Scalars["String"];
};

/** Friend request data for a user. */
export type FriendRequest = Node & {
  __typename?: "FriendRequest";
  /** Globally unique identifier for a single friend request entity. */
  id: Scalars["ID"];
  /** The type of friend request to indicate whether it was sent or received by the user. */
  type: FriendRequestType;
  /** The recipient or sending Backpack user ID of the request. */
  userId: Scalars["String"];
};

/** Enum for associating a friend request with the direction of how it was sent. */
export enum FriendRequestType {
  Received = "RECEIVED",
  Sent = "SENT",
}

/** Wrapper type for all user friendship data. */
export type Friendship = {
  __typename?: "Friendship";
  /** A list of Backpack friends of the user. */
  friends?: Maybe<Array<Friend>>;
  /** A list of pending Backpack friend requests related to the user. */
  requests?: Maybe<Array<FriendRequest>>;
};

/** NFT listing data pulling from marketplaces. */
export type Listing = Node & {
  __typename?: "Listing";
  /** The display amount of the current listing price. */
  amount: Scalars["String"];
  /** Globally unique identifier for an NFT marketplace listing. */
  id: Scalars["ID"];
  /** The marketplace or platform that the NFT is currently listing on. */
  source: Scalars["String"];
  /** A link to the NFT's listing on the marketplace. */
  url: Scalars["String"];
};

/** Coingecko and computed market and price data for a token. */
export type MarketData = Node & {
  __typename?: "MarketData";
  /** Globally unqiue identifier for the token's market data. */
  id: Scalars["ID"];
  /** A timestamp of the last date of when the market data was updated. */
  lastUpdatedAt: Scalars["Int"];
  /** The image link to the logo of the token's market listing. */
  logo: Scalars["String"];
  /** The percentage of change since the latest market data update. */
  percentChange: Scalars["Float"];
  /** The current USD price of the token according to the market data. */
  price: Scalars["Float"];
  /** The numerical amount change in USD since the latest market data update. */
  usdChange: Scalars["Float"];
  /** The value of the wallet's currently holdings of the token in USD. */
  value: Scalars["Float"];
  /** The value change in USD of the wallet's holdings of the token is USD. */
  valueChange: Scalars["Float"];
};

/** Root level mutation type. */
export type Mutation = {
  __typename?: "Mutation";
  /** Authenticate a user and set the JWT in their cookies. */
  authenticate: Scalars["String"];
  /** Deauthenticate the current user and clear their JWT cookie. */
  deauthenticate: Scalars["String"];
  /** Attempt to add a new wallet public key to the user account. */
  importPublicKey?: Maybe<Scalars["Boolean"]>;
};

/** Root level mutation type. */
export type MutationAuthenticateArgs = {
  chainId: ChainId;
  message: Scalars["String"];
  publicKey: Scalars["String"];
  signature: Scalars["String"];
};

/** Root level mutation type. */
export type MutationImportPublicKeyArgs = {
  address: Scalars["String"];
  chainId: ChainId;
  signature: Scalars["String"];
};

/** Generic NFT object type definition to provide on-chain and off-chain metadata. */
export type Nft = Node & {
  __typename?: "Nft";
  /** The mint or contract address of the item. */
  address: Scalars["String"];
  /** The list of attributes or traits found in the item's metadata. */
  attributes?: Maybe<Array<NftAttribute>>;
  /** The collection or contract parental entity of the item. */
  collection?: Maybe<Collection>;
  /** The description of the NFT found in the metadata. */
  description?: Maybe<Scalars["String"]>;
  /** Globally unique identifier for an NFT. */
  id: Scalars["ID"];
  /** The image link of the NFT found in the metadata. */
  image?: Maybe<Scalars["String"]>;
  /** Possible marketplace or platform listing data for the NFT for sale. */
  listing?: Maybe<Listing>;
  /** The link to the off-chain metadata. */
  metadataUri: Scalars["String"];
  /** The name of the NFT found in the metadata. */
  name: Scalars["String"];
  /** The owning wallet's public key. */
  owner: Scalars["String"];
  /** The associated token account address or contract token ID of the individual item. */
  token: Scalars["String"];
};

/** NFT `attributes` list sub-type definition. */
export type NftAttribute = {
  __typename?: "NftAttribute";
  /** The trait name of the attribute. */
  trait: Scalars["String"];
  /** The item's value for the specified trait type. */
  value: Scalars["String"];
};

/** Relay connection specification for `Nft` edges. */
export type NftConnection = {
  __typename?: "NftConnection";
  edges?: Maybe<Array<Maybe<NftEdge>>>;
  pageInfo: PageInfo;
};

/** Relay edge specification for `Nft` nodes. */
export type NftEdge = {
  __typename?: "NftEdge";
  cursor: Scalars["String"];
  node?: Maybe<Nft>;
};

/** Input filter type for fetching user wallet NFTs. */
export type NftFiltersInput = {
  /** A list of mint or contract addresses to filter the response. */
  addresses?: InputMaybe<Array<Scalars["String"]>>;
};

/** Interface to enforce the implementation of an `id` field on a type. */
export type Node = {
  /** Globally unique identifier. */
  id: Scalars["ID"];
};

/** Notification data type for user notification reads. */
export type Notification = Node & {
  __typename?: "Notification";
  /** Arbitrary body data of the notification parsed as an object. */
  body: Scalars["JSONObject"];
  /** Globally unique identifier for a specific notification. */
  id: Scalars["ID"];
  /** The emitting source of the notification. */
  source: Scalars["String"];
  /** The timestamp that the notification was created. */
  timestamp: Scalars["String"];
  /** The title of the notification. */
  title: Scalars["String"];
  /** Flag to indicate whether it has been viewed or not by the user. */
  viewed: Scalars["Boolean"];
};

/** Relay connection specification for `Notification` edges. */
export type NotificationConnection = {
  __typename?: "NotificationConnection";
  edges?: Maybe<Array<Maybe<NotificationEdge>>>;
  /** The database integer ID of the last read notification of the user. */
  lastReadId?: Maybe<Scalars["Int"]>;
  pageInfo: PageInfo;
};

/** Relay edge specification for `Notification` nodes. */
export type NotificationEdge = {
  __typename?: "NotificationEdge";
  cursor: Scalars["String"];
  node?: Maybe<Notification>;
};

/** Input filter type for fetching user notifications. */
export type NotificationsFiltersInput = {
  /** The limit for number of items desired in the response. */
  limit?: InputMaybe<Scalars["Int"]>;
  /** Flag to filter for only unread notifications of the user. */
  unreadOnly?: InputMaybe<Scalars["Boolean"]>;
};

/** Relay specification for a connection's page information. */
export type PageInfo = {
  __typename?: "PageInfo";
  /** Cursor for the last edge in the page. */
  endCursor?: Maybe<Scalars["String"]>;
  /** Flag to indicate if the connection has another page of edges. */
  hasNextPage: Scalars["Boolean"];
  /** Flag to indicate if the connection has a previous page of edges. */
  hasPreviousPage: Scalars["Boolean"];
  /** Cursor for the first edge in the page. */
  startCursor?: Maybe<Scalars["String"]>;
};

/** Root level query type. */
export type Query = {
  __typename?: "Query";
  /**
   * Fetch a user by their Backpack account username. The username is inferred by the
   * presence of a valid and verified JWT.
   */
  user?: Maybe<User>;
  /** Fetching a wallet and it's assets by the public key address and associated `ChainID`. */
  wallet?: Maybe<Wallet>;
};

/** Root level query type. */
export type QueryWalletArgs = {
  address: Scalars["String"];
  chainId: ChainId;
};

/** Generic native or non-native token data and balance for a `Wallet`. */
export type TokenBalance = Node & {
  __typename?: "TokenBalance";
  /** The associated token account or wallet + contract address of the wallet. */
  address: Scalars["String"];
  /** The unformated amount of tokens held for the specific contract or mint. */
  amount: Scalars["String"];
  /** The number of decimals associated with the contract or mint. */
  decimals: Scalars["Int"];
  /** The formatted display amount for the wallet's holdings of the token. */
  displayAmount: Scalars["String"];
  /** Globally unqiue identifier for the token balance object in a wallet. */
  id: Scalars["ID"];
  /** Market price data for the token contract or mint. */
  marketData?: Maybe<MarketData>;
  /** The address of the token mint or contract. */
  mint: Scalars["String"];
};

/** Relay connection specification for `TokenBalance` edges. */
export type TokenBalanceConnection = {
  __typename?: "TokenBalanceConnection";
  edges?: Maybe<Array<Maybe<TokenBalanceEdge>>>;
  pageInfo: PageInfo;
};

/** Relay edge specification for `TokenBalance` nodes. */
export type TokenBalanceEdge = {
  __typename?: "TokenBalanceEdge";
  cursor: Scalars["String"];
  node?: Maybe<TokenBalance>;
};

/** Generic on-chain transaction details structure. */
export type Transaction = Node & {
  __typename?: "Transaction";
  /** The block number or slot that the transaction was committed to. */
  block: Scalars["Float"];
  /** The semantic description of the transaction effects. */
  description?: Maybe<Scalars["String"]>;
  /** The amount in fees that were paid for processing the transaction. */
  fee?: Maybe<Scalars["Int"]>;
  /** The address of the wallet that paid the processing fees. */
  feePayer?: Maybe<Scalars["String"]>;
  /** The transaction hash or signature. */
  hash: Scalars["String"];
  /** Globally unique identifier for a single transaction. */
  id: Scalars["ID"];
  /** The source or program that is associated with the transaction. */
  source?: Maybe<Scalars["String"]>;
  /** The timestamp of the execution or commitment of the transaction. */
  timestamp?: Maybe<Scalars["String"]>;
  /** The category or type of transaction. */
  type: Scalars["String"];
};

/** Relay connection specification for `Transaction` edges. */
export type TransactionConnection = {
  __typename?: "TransactionConnection";
  edges?: Maybe<Array<Maybe<TransactionEdge>>>;
  pageInfo: PageInfo;
};

/** Relay edge specification for `Transaction` nodes. */
export type TransactionEdge = {
  __typename?: "TransactionEdge";
  cursor: Scalars["String"];
  node?: Maybe<Transaction>;
};

/**
 * Backpack user type definition so provide data about all of the user's
 * assets, peripheral information, and social data.
 */
export type User = Node & {
  __typename?: "User";
  /** The image link for the avatar of the user. */
  avatar: Scalars["String"];
  /** The timestamp of the creation of the user. */
  createdAt: Scalars["String"];
  /** A grouping object of the friends and friend request data for the user. */
  friendship?: Maybe<Friendship>;
  /** Globally unique identifier for a Backpack user. */
  id: Scalars["ID"];
  /** The Relay connection for the notifications received by the user. */
  notifications?: Maybe<NotificationConnection>;
  /** The user's Backpack username. */
  username: Scalars["String"];
  /** The Relay connection for the wallet's and their data that are registered to the user. */
  wallets?: Maybe<WalletConnection>;
};

/**
 * Backpack user type definition so provide data about all of the user's
 * assets, peripheral information, and social data.
 */
export type UserNotificationsArgs = {
  filters?: InputMaybe<NotificationsFiltersInput>;
};

/**
 * Backpack user type definition so provide data about all of the user's
 * assets, peripheral information, and social data.
 */
export type UserWalletsArgs = {
  filters?: InputMaybe<WalletsFiltersInput>;
};

/** Wallet definition to provide data about all assets owned by an address. */
export type Wallet = Node & {
  __typename?: "Wallet";
  /** The public key address of the wallet. */
  address: Scalars["String"];
  /** The detailed and aggregate balance data for the wallet. */
  balances?: Maybe<Balances>;
  /** The blockchain enum variant that the wallet is associated with. */
  chainId: ChainId;
  /** The timestamp that the wallet was imported or registered to the Backpack user. */
  createdAt: Scalars["String"];
  /** Globally unique identifier for a specific wallet on a blockchain. */
  id: Scalars["ID"];
  /** Flag to indicate whether it is the user's primary wallet for the designated blockchain. */
  isPrimary: Scalars["Boolean"];
  /** The Relay connection for all of the NFTs owned by the wallet. */
  nfts?: Maybe<NftConnection>;
  /** The Relay connection for all transactions initiated or associated with the wallet. */
  transactions?: Maybe<TransactionConnection>;
};

/** Wallet definition to provide data about all assets owned by an address. */
export type WalletNftsArgs = {
  filters?: InputMaybe<NftFiltersInput>;
};

/** Wallet definition to provide data about all assets owned by an address. */
export type WalletTransactionsArgs = {
  after?: InputMaybe<Scalars["String"]>;
  before?: InputMaybe<Scalars["String"]>;
};

/** Relay connection specification for `Wallet` edges. */
export type WalletConnection = {
  __typename?: "WalletConnection";
  edges?: Maybe<Array<Maybe<WalletEdge>>>;
  pageInfo: PageInfo;
};

/** Relay edge specification for `Wallet` nodes. */
export type WalletEdge = {
  __typename?: "WalletEdge";
  cursor: Scalars["String"];
  node?: Maybe<Wallet>;
};

/** Input filter type for fetching user wallets and their data. */
export type WalletsFiltersInput = {
  /** A `ChainID` value to filter for all of the public keys of the user for a given blockchain. */
  chainId?: InputMaybe<ChainId>;
  /** Flag to filter for only the primary wallets for each registered blockchain of the user. */
  primaryOnly?: InputMaybe<Scalars["Boolean"]>;
  /** A list of public keys to filter in the response. */
  pubkeys?: InputMaybe<Array<Scalars["String"]>>;
};

export type GetNftsForWalletQueryVariables = Exact<{
  chainId: ChainId;
  address: Scalars["String"];
}>;

export type GetNftsForWalletQuery = {
  __typename?: "Query";
  wallet?: {
    __typename?: "Wallet";
    id: string;
    nfts?: {
      __typename?: "NftConnection";
      edges?: Array<{
        __typename?: "NftEdge";
        node?: {
          __typename?: "Nft";
          id: string;
          image?: string | null;
          name: string;
          address: string;
          description?: string | null;
          attributes?: Array<{
            __typename?: "NftAttribute";
            trait: string;
            value: string;
          }> | null;
          collection?: {
            __typename?: "Collection";
            id: string;
            address: string;
            image?: string | null;
            name?: string | null;
            verified: boolean;
          } | null;
        } | null;
      } | null> | null;
    } | null;
  } | null;
};

export type NftNodeFragment = {
  __typename?: "Nft";
  id: string;
  image?: string | null;
  name: string;
  address: string;
  description?: string | null;
  attributes?: Array<{
    __typename?: "NftAttribute";
    trait: string;
    value: string;
  }> | null;
  collection?: {
    __typename?: "Collection";
    id: string;
    address: string;
    image?: string | null;
    name?: string | null;
    verified: boolean;
  } | null;
};

export type NftCollectionFragment = {
  __typename?: "Collection";
  id: string;
  address: string;
  image?: string | null;
  name?: string | null;
  verified: boolean;
};

export type GetRecentTransactionsForWalletQueryVariables = Exact<{
  chainId: ChainId;
  address: Scalars["String"];
}>;

export type GetRecentTransactionsForWalletQuery = {
  __typename?: "Query";
  wallet?: {
    __typename?: "Wallet";
    id: string;
    transactions?: {
      __typename?: "TransactionConnection";
      edges?: Array<{
        __typename?: "TransactionEdge";
        node?: {
          __typename?: "Transaction";
          id: string;
          description?: string | null;
          block: number;
          fee?: number | null;
          feePayer?: string | null;
          hash: string;
          source?: string | null;
          timestamp?: string | null;
          type: string;
        } | null;
      } | null> | null;
    } | null;
  } | null;
};

export type GetWalletAggregateQueryVariables = Exact<{
  chainId: ChainId;
  address: Scalars["String"];
}>;

export type GetWalletAggregateQuery = {
  __typename?: "Query";
  wallet?: {
    __typename?: "Wallet";
    id: string;
    balances?: {
      __typename?: "Balances";
      id: string;
      aggregate: { __typename?: "BalanceAggregate"; value: number };
    } | null;
  } | null;
};

export const NftCollectionFragmentDoc = gql`
  fragment NftCollection on Collection {
    id
    address
    image
    name
    verified
  }
`;
export const NftNodeFragmentDoc = gql`
  fragment NftNode on Nft {
    id
    image
    name
    address
    description
    attributes {
      trait
      value
    }
    collection {
      ...NftCollection
    }
  }
  ${NftCollectionFragmentDoc}
`;
export const GetNftsForWalletDocument = gql`
  query GetNftsForWallet($chainId: ChainID!, $address: String!) {
    wallet(chainId: $chainId, address: $address) {
      id
      nfts {
        edges {
          node {
            ...NftNode
          }
        }
      }
    }
  }
  ${NftNodeFragmentDoc}
`;
export type GetNftsForWalletQueryResult = Apollo.QueryResult<
  GetNftsForWalletQuery,
  GetNftsForWalletQueryVariables
>;
export const GetRecentTransactionsForWalletDocument = gql`
  query GetRecentTransactionsForWallet($chainId: ChainID!, $address: String!) {
    wallet(chainId: $chainId, address: $address) {
      id
      transactions {
        edges {
          node {
            id
            description
            block
            fee
            feePayer
            hash
            source
            timestamp
            type
          }
        }
      }
    }
  }
`;
export type GetRecentTransactionsForWalletQueryResult = Apollo.QueryResult<
  GetRecentTransactionsForWalletQuery,
  GetRecentTransactionsForWalletQueryVariables
>;
export const GetWalletAggregateDocument = gql`
  query GetWalletAggregate($chainId: ChainID!, $address: String!) {
    wallet(chainId: $chainId, address: $address) {
      id
      balances {
        id
        aggregate {
          value
        }
      }
    }
  }
`;
export type GetWalletAggregateQueryResult = Apollo.QueryResult<
  GetWalletAggregateQuery,
  GetWalletAggregateQueryVariables
>;