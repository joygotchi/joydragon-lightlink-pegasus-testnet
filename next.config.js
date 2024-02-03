/** @type {import('next').NextConfig} */
const nextConfig = {
    swcMinify: true,
    env: {
        CHAIN_ID: 1891,
        CHAIN_NAME: "Lightlink Pegasus Testnet",
        CHAIN_NETWORK: "Pegasus",
        TOKEN: "ETHEREUM",
        SYMBOL: "ETH",
        RPC: "https://replicator.pegasus.lightlink.io/rpc/v1",
        URL_FAUCET: "https://faucet.pegasus.lightlink.io/",
        NFT_ADDRESS:'0x32f93910803B544C4c58240cc5E7B94678A4BD57',
        TOKEN_ADDRESS:'0xc9D2EDF36Ed48Cc3110c2D833bAc3420df12Ba5a',
        FAUCET_ADDRESS:'0xCC5D4595ec07e570d00ad7eF3213062071E5E00f',
        EXPLORER_URL:'https://pegasus.lightlink.io'
      },
}

module.exports = nextConfig
