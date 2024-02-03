const {
    Contract,
    ContractFactory,
    utils,
    BigNumber,
    constants,
    getSigners,
    parseUnits,
    N,
} = require("ethers");
const { ethers } = require("hardhat");
const JoyGotchiArtifact = require("../artifacts/contracts/JoyGotchi.sol/JoyGotchi.json");
const JOY_GOTCHI_ADDRESS = "0x681078eDFD01e68ae6dA2791Fe50b04837588422"; //testnet

const NAME = "ITEM 1";
const PRICE = parseUnits("1000", 18); // 1000 tokens with 18 decimals
const POINTS = parseUnits("1", 12); // 1*(10^12)
const TIME = "86400"; // 1 day

async function main() {
    const [deployer] = await ethers.getSigners();
    let nonce = await deployer.getNonce();

    const joyGotchi = new Contract(
        JOY_GOTCHI_ADDRESS,
        JoyGotchiArtifact.abi,
        deployer
    );

    await joyGotchi.createItem(NAME, PRICE, POINTS, TIME, {
        gasLimit: "0x1000000",
        nonce: nonce++,
    });

    console.log("Done");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
