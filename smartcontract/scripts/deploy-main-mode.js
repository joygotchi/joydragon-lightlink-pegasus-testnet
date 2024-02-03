const {
    Contract,
    ContractFactory,
    utils,
    BigNumber,
    constants,
    getSigners,
} = require("ethers");
const { ethers } = require("hardhat");

// const ROUTER_ADDRESS = "0xb7d49ce9e7df8604c71d53501ecc81fcedcf9396"; //testnet

// const FEE_SHARING_ADDRESS = "0xBBd707815a7F7eb6897C7686274AFabd7B579Ff6"; //testnet

// const ROUTER_ADDRESS = "0x5D1942345D63562fD38d17C28Dcd22e7b3E9Cfb4"; // mainnet

const FEE_SHARING_ADDRESS = "0x8680CEaBcb9b56913c519c069Add6Bc3494B7020"; //mainnet

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    const Token = await ethers.getContractFactory("JoyGotchiTokenModeV1");
    // const token = await Token.deploy(ROUTER_ADDRESS);
    const token = await Token.deploy();
    await token.waitForDeployment();
    console.log("JoyGotchiToken:", token.target);

    const ModeNFT = await ethers.getContractFactory("JoyGotchiV1");
    const modeNFT = await ModeNFT.deploy(token.target);
    await modeNFT.waitForDeployment();
    console.log("JoyGotchi:", modeNFT.target);

    const GameManager = await ethers.getContractFactory("GameManagerV1");
    const gameManager = await GameManager.deploy(modeNFT.target);
    await gameManager.waitForDeployment();
    console.log("GameManager:", gameManager.target);

    const Faucet = await ethers.getContractFactory("JoyGotchiFaucet");
    const faucet = await Faucet.deploy(token.target);
    await faucet.waitForDeployment();
    console.log("Faucet:", faucet.target);

    console.log("Settings");
    await modeNFT.setGameManager(gameManager.target);
    await modeNFT.registerFeeSharing(FEE_SHARING_ADDRESS);
    await token.registerFeeSharing(FEE_SHARING_ADDRESS);
    await token.transfer(faucet.target, ethers.parseEther("100000")); // move 100k to faucet
    // await token.enableTrading();

    console.log("Done");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
