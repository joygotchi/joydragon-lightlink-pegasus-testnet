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
        NFT_ADDRESS:'0xBF398Db98d8aBd4847962fCD4d87aB7C8Ec012a6',
        TOKEN_ADDRESS:'0x151Ca4455aa1c00B145DDd2C94964f646D51cBb1',
        FAUCET_ADDRESS:'0x373B37C14874d1Cef2eDF278B8046Ce4163Bd62b',
        EXPLORER_URL:'https://pegasus.lightlink.io'
      },
}

module.exports = nextConfig
