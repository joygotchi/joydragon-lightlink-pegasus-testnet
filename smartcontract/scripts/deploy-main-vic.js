const {
    Contract,
    ContractFactory,
    utils,
    BigNumber,
    constants,
    getSigners,
} = require("ethers");
const { ethers } = require("hardhat");

const ROUTER_ADDRESS = "0x5072EA8551efBF96Ad87050563e6BA197A03f34d"; //testnet

async function main() {
    const [deployer] = await ethers.getSigners();
    let nonce = await deployer.getNonce();

    console.log("Deploying contracts with the account:", deployer.address);

    const Token = await ethers.getContractFactory("JoyGotchiTokenVIC");
    const token = await Token.deploy(ROUTER_ADDRESS, {
        gasLimit: "0x5000000",
        nonce: nonce++,
    });
    await token.waitForDeployment();
    console.log("JoyGotchiToken:", token.target);

    const ModeNFT = await ethers.getContractFactory("JoyGotchiV2");
    const modeNFT = await ModeNFT.deploy(token.target, {
        gasLimit: "80000000",
        nonce: nonce++,
    });
    await modeNFT.waitForDeployment();
    console.log("JoyGotchi:", modeNFT.target);

    const GameManager = await ethers.getContractFactory("GameManagerV2");
    const gameManager = await GameManager.deploy(modeNFT.target, {
        gasLimit: "0x5000000",
        nonce: nonce++,
    });
    await gameManager.waitForDeployment();
    console.log("GameManager:", gameManager.target);

    const GenePool = await ethers.getContractFactory("GenePool");
    const genePool = await GenePool.deploy(modeNFT.target, {
        gasLimit: "0x5000000",
        nonce: nonce++,
    });
    await genePool.waitForDeployment();
    console.log("GenePool:", genePool.target);

    const Faucet = await ethers.getContractFactory("JoyGotchiFaucet");
    const faucet = await Faucet.deploy(token.target, {
        gasLimit: "0x5000000",
        nonce: nonce++,
    });
    await faucet.waitForDeployment();
    console.log("Faucet:", faucet.target);

    console.log("Settings");
    await modeNFT.setGameManager(gameManager.target, {
        gasLimit: "0x5000000",
        nonce: nonce++,
    });

    await modeNFT.setGenePool(gameManager.target, {
        gasLimit: "0x5000000",
        nonce: nonce++,
    });

    await token.transfer(faucet.target, ethers.parseEther("100000"), {
        gasLimit: "0x5000000",
        nonce: nonce++,
    }); // move 100k to faucet

    await token.enableTrading({
        gasLimit: "0x5000000",
        nonce: nonce++,
    });
    // enable trading

    console.log("Done");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
