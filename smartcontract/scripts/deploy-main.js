const {
    Contract,
    ContractFactory,
    utils,
    BigNumber,
    constants,
    getSigners,
} = require("ethers");
const { ethers } = require("hardhat");

const ROUTER_ADDRESS = "0xdd6E85bC17cF6851A9919A19E5f354Af0D312A6B";

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    const Token = await ethers.getContractFactory("JoyGotchiToken");
    const token = await Token.deploy(ROUTER_ADDRESS);
    await token.waitForDeployment();
    console.log("JoyGotchiToken:", token.target);

    const ModeNFT = await ethers.getContractFactory("JoyGotchiV2");
    const modeNFT = await ModeNFT.deploy(
        token.target,
        "0xa0AD79D995DdeeB18a14eAef56A549A04e3Aa1Bd" //airnode rrp on lightlink testnet
    );
    await modeNFT.waitForDeployment();
    console.log("JoyGotchi:", modeNFT.target);

    const GameManager = await ethers.getContractFactory("GameManagerV2");
    const gameManager = await GameManager.deploy(modeNFT.target);
    await gameManager.waitForDeployment();
    console.log("GameManager:", gameManager.target);

    const GenePool = await ethers.getContractFactory("GenePool");
    const genePool = await GenePool.deploy(modeNFT.target, 2, 2, 2, 2);
    await genePool.waitForDeployment();
    console.log("GenePool:", genePool.target);

    const Faucet = await ethers.getContractFactory("JoyGotchiFaucet");
    const faucet = await Faucet.deploy(token.target);
    await faucet.waitForDeployment();
    console.log("Faucet:", faucet.target);

    console.log("Settings");
    await modeNFT.setGameManager(gameManager.target);

    await modeNFT.setGenePool(gameManager.target);

    await token.transfer(faucet.target, ethers.parseEther("100000")); // move 100k to faucet

    await token.enableTrading();
    // enable trading

    console.log("Done");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
