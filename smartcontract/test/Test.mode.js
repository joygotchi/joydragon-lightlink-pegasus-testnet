const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { parseEther, MaxInt256 } = require("ethers");

describe("Mode", function () {
    async function deployContracts() {
        const [owner] = await ethers.getSigners();

        // const WETH = await ethers.getContractFactory("WETH");
        // const weth = await WETH.deploy();

        const Token = await ethers.getContractFactory("Token");
        const token = await Token.deploy();

        // const Factory = await ethers.getContractFactory("UniswapV2Factory");
        // const factory = await Factory.deploy(owner.address);

        // const Router = await ethers.getContractFactory("UniswapV2Router02");
        // const router = await Router.deploy(factory.target, weth.target);

        const ModeNFT = await ethers.getContractFactory("ModeNFT");
        const modeNFT = await ModeNFT.deploy(token.target);

        const GameManager = await ethers.getContractFactory("GameManager");
        const gameManager = await GameManager.deploy(modeNFT.target);

        await modeNFT.setGameManager(gameManager.target);

        return {
            // weth,
            token,
            // factory,
            // router,
            modeNFT,
            gameManager,
        };
    }

    describe("Mint", function () {
        it("Shoud Mint", async function () {
            const [owner, user1] = await ethers.getSigners();

            const { token, modeNFT, gameManager } = await loadFixture(
                deployContracts
            );

            await token.transfer(user1, parseEther("2000"));
            expect(await token.balanceOf(user1.address)).to.equal(
                parseEther("2000")
            );

            await token.connect(user1).approve(modeNFT.target, MaxInt256);

            await modeNFT.connect(user1).mint();

            expect(await modeNFT.balanceOf(user1.address)).to.equal(1);
        });
    });

    describe("Item", function () {
        it("Shoud Create Item", async function () {
            const [owner] = await ethers.getSigners();

            const { token, modeNFT, gameManager } = await loadFixture(
                deployContracts
            );

            expect(
                await modeNFT.createItem(
                    "HEROINE",
                    parseEther("100"),
                    1000,
                    86400
                )
            )
                .to.emit(modeNFT, "ItemCreated")
                .withArgs(0, "HEROINE", parseEther("100"), 1000, 86400);
        });

        it("Shoud Buy Item", async function () {
            const [owner, user1] = await ethers.getSigners();

            const { token, modeNFT, gameManager } = await loadFixture(
                deployContracts
            );

            await token.transfer(user1, parseEther("3000"));

            await token.connect(user1).approve(modeNFT.target, MaxInt256);

            await modeNFT.connect(user1).mint();

            await modeNFT.createItem(
                "HEROINE",
                parseEther("100"),
                1000,
                864000
            );

            await modeNFT.connect(user1).buyAccessory(0, 0);
        });
    });

    describe("Gameplay", function () {
        it.only("Should attack", async function () {
            const [owner, user1, user2] = await ethers.getSigners();

            const { token, modeNFT, gameManager } = await loadFixture(
                deployContracts
            );

            await token.transfer(user1, parseEther("3000"));
            await token.transfer(user2, parseEther("2000"));

            await token.connect(user1).approve(modeNFT.target, MaxInt256);
            await token.connect(user2).approve(modeNFT.target, MaxInt256);

            await modeNFT.connect(user1).mint();
            await modeNFT.connect(user2).mint();

            await modeNFT.createItem(
                "HEROINE",
                parseEther("100"),
                parseEther("1"),
                864000
            );

            await modeNFT.connect(user1).buyAccessory(0, 0);

            await modeNFT.connect(user2).attack(1, 0);
        });
    });
});
