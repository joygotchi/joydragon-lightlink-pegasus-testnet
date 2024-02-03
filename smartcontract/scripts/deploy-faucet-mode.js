const {
    Contract,
    ContractFactory,
    utils,
    BigNumber,
    constants,
    getSigners,
} = require("ethers");
const { ethers } = require("hardhat");

const TOKEN_ADDRESS = "0x110Ac22029AbAf5e15418B95619508cAE6f1a8Ec";

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    const Faucet = await ethers.getContractFactory("JoyGotchiFaucet");
    const faucet = await Faucet.deploy(TOKEN_ADDRESS);
    await faucet.waitForDeployment();

    console.log("Faucet:", faucet.target);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
