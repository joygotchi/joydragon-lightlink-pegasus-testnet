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
        NFT_ADDRESS:'0x3C68D401b0082Ed833f6d285Df615254DdDDB5a2',
        TOKEN_ADDRESS:'0xf898ddC2dBaC71AF98D054fD3DEE0284f4aB9483',
        FAUCET_ADDRESS:'0x17D36ECA9CFA04C7435FE60447091C0872733c47',
        EXPLORER_URL:'https://pegasus.lightlink.io'
      },
}

module.exports = nextConfig
