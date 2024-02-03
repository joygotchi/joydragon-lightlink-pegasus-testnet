const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { parseEther, MaxInt256 } = require("ethers");

describe("Vic", function () {
    async function deployContracts() {
        const [owner] = await ethers.getSigners();

        const ModeNFT = await ethers.getContractFactory("VICNFT");
        const modeNFT = await ModeNFT.deploy();

        const GameManager = await ethers.getContractFactory("GameManager");
        const gameManager = await GameManager.deploy(modeNFT.target);

        await modeNFT.setGameManager(gameManager.target);

        return {
            modeNFT,
            gameManager,
        };
    }

    describe("Mint", function () {
        it("Shoud Mint", async function () {
            const [owner, user1] = await ethers.getSigners();

            const { modeNFT, gameManager } = await loadFixture(deployContracts);

            await modeNFT.connect(user1).mint({ value: parseEther("0.2") });

            expect(await modeNFT.balanceOf(user1.address)).to.equal(1);
        });
    });

    describe("Item", function () {
        it("Shoud Create Item", async function () {
            const [owner] = await ethers.getSigners();

            const { modeNFT, gameManager } = await loadFixture(deployContracts);

            expect(
                await modeNFT.createItem(
                    "HEROINE",
                    parseEther("0.01"),
                    1000,
                    86400
                )
            )
                .to.emit(modeNFT, "ItemCreated")
                .withArgs(0, "HEROINE", parseEther("100"), 1000, 86400);
        });

        it("Shoud Buy Item", async function () {
            const [owner, user1] = await ethers.getSigners();

            const { modeNFT, gameManager } = await loadFixture(deployContracts);

            await modeNFT.connect(user1).mint({ value: parseEther("0.2") });

            await modeNFT.createItem(
                "HEROINE",
                parseEther("0.01"),
                1000,
                864000
            );

            await modeNFT
                .connect(user1)
                .buyAccessory(0, 0, { value: parseEther("0.01") });
        });
    });

    describe("Gameplay", function () {
        it("Should attack", async function () {
            const [owner, user1, user2] = await ethers.getSigners();

            const { modeNFT, gameManager } = await loadFixture(deployContracts);

            await modeNFT.connect(user1).mint({ value: parseEther("0.2") });
            await modeNFT.connect(user2).mint({ value: parseEther("0.2") });

            await modeNFT.createItem(
                "HEROINE",
                parseEther("0.01"),
                parseEther("1"),
                864000
            );

            await modeNFT
                .connect(user1)
                .buyAccessory(0, 0, { value: parseEther("0.01") });

            await modeNFT.connect(user2).attack(1, 0);
        });
    });
});
