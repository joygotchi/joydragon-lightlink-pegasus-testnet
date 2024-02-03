const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { parseEther, MaxInt256, parseUnits } = require("ethers");

describe("V2", function () {
    async function deployContracts() {
        const [owner] = await ethers.getSigners();

        const Token = await ethers.getContractFactory("Token");
        const token = await Token.deploy();

        const NFT = await ethers.getContractFactory("JoyGotchiV2");
        const nft = await NFT.deploy(
            token.target,
            "0x2ab9f26E18B64848cd349582ca3B55c2d06f507d" // airnode contract on lightlink testnet
        );

        const GameManager = await ethers.getContractFactory("GameManagerV2");
        const gameManager = await GameManager.deploy(nft.target);

        const GenePool = await ethers.getContractFactory("GenePool");
        const genePool = await GenePool.deploy(nft.target);

        await nft.setGameManager(gameManager.target);
        await nft.setGenePool(genePool.target);

        return {
            token,
            nft,
        };
    }

    describe("Create NFT", function () {
        it.only("Shoud Create Species & Mint", async function () {
            const [owner, user1] = await ethers.getSigners();

            const { token, nft } = await loadFixture(deployContracts);

            await nft.createSpecies(
                [
                    ["image-link-1", "0-evo0", 20, 10],
                    ["image-link-2", "0-evo1", 25, 20],
                    ["image-link-3", "0-evo2", 35, 0],
                ],
                10,
                false,
                0
            );

            await nft.createSpecies(
                [
                    ["image-link-1", "1-evo0", 20, 10],
                    ["image-link-2", "1-evo1", 25, 20],
                    ["image-link-3", "1-evo2", 35, 0],
                ],
                10,
                false,
                0
            );

            const species = await nft.speciesList(0);

            console.log({ species });

            const evo0 = await nft.speciesToEvolutions(0, 0);
            const evo1 = await nft.speciesToEvolutions(0, 1);
            const evo2 = await nft.speciesToEvolutions(0, 2);

            console.log({
                evo0,
                evo1,
                evo2,
            });

            await token.transfer(user1, parseEther("20000"));

            await token.connect(user1).approve(nft.target, MaxInt256);

            let type0Count = 0;
            let type1Count = 0;

            for (let i = 0; i < 10; i++) {
                await nft.connect(user1).mint();

                const species = await nft.petSpecies(i);

                if (species === 0n) type0Count++;
                if (species === 1n) type1Count++;
            }

            console.log({ type0Count, type1Count });

            expect(await nft.balanceOf(user1.address)).to.equal(10);
        });
    });

    // describe("Item", function () {
    //     it("Shoud Create Item", async function () {
    //         const [owner] = await ethers.getSigners();

    //         const { token, nft } = await loadFixture(deployContracts);

    //         expect(
    //             await nft.createItem(
    //                 "HEROINE",
    //                 parseEther("100"),
    //                 1000,
    //                 10,
    //                 0,
    //                 86400,
    //                 0,
    //                 false
    //             )
    //         )
    //             .to.emit(nft, "ItemCreated")
    //             .withArgs(
    //                 0,
    //                 "HEROINE",
    //                 parseEther("100"),
    //                 1000,
    //                 86400,
    //                 86400,
    //                 0,
    //                 false
    //             );
    //         expect(await nft.itemStock(0)).to.equal(10);
    //     });

    //     it("Shoud Buy Item", async function () {
    //         const [owner, user1] = await ethers.getSigners();

    //         const { token, nft } = await loadFixture(deployContracts);

    //         await nft.createSpecies(
    //             [
    //                 ["image-link-1", "0-evo0", 20, 10],
    //                 ["image-link-2", "0-evo1", 25, 20],
    //                 ["image-link-3", "0-evo2", 35, 0],
    //             ],
    //             10,
    //             false,
    //             0
    //         );

    //         await token.transfer(user1, parseEther("3000"));

    //         await token.connect(user1).approve(nft.target, MaxInt256);

    //         await nft.connect(user1).mint();

    //         await nft.createItem(
    //             "HEROINE",
    //             parseEther("100"),
    //             1000,
    //             10,
    //             parseUnits("1", 14),
    //             86400,
    //             0,
    //             false
    //         );

    //         const preInfo = await nft.getPetInfo(0);

    //         console.log(preInfo);

    //         await nft.connect(user1).buyItem(0, 0);

    //         const postInfo = await nft.getPetInfo(0);

    //         console.log(postInfo);
    //     });
    // });

    // describe("Gameplay", function () {
    //     it("Should attack", async function () {
    //         const [owner, user1, user2] = await ethers.getSigners();
    //         const { token, nft } = await loadFixture(deployContracts);

    //         await nft.createSpecies(
    //             [
    //                 ["image-link-1", "0-evo0", 20, 10],
    //                 ["image-link-2", "0-evo1", 25, 20],
    //                 ["image-link-3", "0-evo2", 35, 0],
    //             ],
    //             10,
    //             false,
    //             0
    //         );

    //         await token.transfer(user1, parseEther("3000"));
    //         await token.transfer(user2, parseEther("2000"));

    //         await token.connect(user1).approve(nft.target, MaxInt256);
    //         await token.connect(user2).approve(nft.target, MaxInt256);

    //         await nft.connect(user1).mint();
    //         await nft.connect(user2).mint();

    //         await nft.createItem(
    //             "HEROINE",
    //             parseEther("100"),
    //             1000,
    //             10,
    //             parseUnits("1", 14),
    //             86400,
    //             0,
    //             false
    //         );

    //         await nft.connect(user1).buyItem(0, 0);

    //         preInfo1 = await nft.getPetInfo(0);
    //         preInfo2 = await nft.getPetInfo(1);

    //         await nft.connect(user2).attack(1, 0);

    //         postInfo1 = await nft.getPetInfo(0);
    //         postInfo2 = await nft.getPetInfo(1);

    //         console.log({ preInfo1, postInfo1 });
    //         console.log({ preInfo2, postInfo2 });
    //     });

    //     it("Should block attack", async function () {
    //         const [owner, user1, user2] = await ethers.getSigners();
    //         const { token, nft } = await loadFixture(deployContracts);

    //         await nft.createSpecies(
    //             [
    //                 ["image-link-1", "0-evo0", 20, 10],
    //                 ["image-link-2", "0-evo1", 25, 20],
    //                 ["image-link-3", "0-evo2", 35, 0],
    //             ],
    //             10,
    //             false,
    //             0
    //         );

    //         await token.transfer(user1, parseEther("3000"));
    //         await token.transfer(user2, parseEther("2000"));

    //         await token.connect(user1).approve(nft.target, MaxInt256);
    //         await token.connect(user2).approve(nft.target, MaxInt256);

    //         await nft.connect(user1).mint();
    //         await nft.connect(user2).mint();

    //         await nft.createItem(
    //             "HEROINE",
    //             parseEther("100"),
    //             1000,
    //             10,
    //             parseUnits("1", 14),
    //             86400,
    //             1,
    //             false
    //         );

    //         await nft.connect(user1).buyItem(0, 0);

    //         preInfo1 = await nft.getPetInfo(0);
    //         preInfo2 = await nft.getPetInfo(1);

    //         expect(await nft.connect(user2).attack(1, 0)).to.emit(
    //             nft,
    //             "AttackBlocked"
    //         );

    //         postInfo1 = await nft.getPetInfo(0);
    //         postInfo2 = await nft.getPetInfo(1);

    //         console.log({ preInfo1, postInfo1 });
    //         console.log({ preInfo2, postInfo2 });
    //     });

    //     it("Should Evolve", async function () {
    //         const [owner, user1, user2] = await ethers.getSigners();
    //         const { token, nft } = await loadFixture(deployContracts);

    //         await nft.createSpecies(
    //             [
    //                 ["image-link-1", "0-evo0", 20, 10],
    //                 ["image-link-2", "0-evo1", 25, 20],
    //                 ["image-link-3", "0-evo2", 35, 0],
    //             ],
    //             10,
    //             false,
    //             0
    //         );

    //         await token.transfer(user1, parseEther("3000"));

    //         await token.connect(user1).approve(nft.target, MaxInt256);

    //         await nft.connect(user1).mint();

    //         const evo1Info = await nft.getPetEvolutionInfo(0);

    //         console.log({ evo1Info });

    //         await nft.createItem(
    //             "HEROINE",
    //             parseEther("100"),
    //             1000,
    //             10,
    //             parseUnits("1", 18),
    //             86400,
    //             0,
    //             false
    //         );

    //         await nft.connect(user1).buyItem(0, 0);

    //         await nft.connect(user1).evolve(0);

    //         const evo2Info = await nft.getPetEvolutionInfo(0);

    //         console.log({ evo2Info });

    //         await nft.connect(user1).evolve(0);

    //         const evo3Info = await nft.getPetEvolutionInfo(0);

    //         console.log({ evo3Info });

    //         const uri = await nft.tokenURI(0);

    //         console.log({ uri });
    //     });

    //     it("Should Evolve With Item", async function () {
    //         const [owner, user1, user2] = await ethers.getSigners();
    //         const { token, nft } = await loadFixture(deployContracts);

    //         await nft.createSpecies(
    //             [
    //                 ["image-link-1", "0-evo0", 20, 10],
    //                 ["image-link-2", "0-evo1", 25, 20],
    //                 ["image-link-3", "0-evo2", 35, 0],
    //             ],
    //             10,
    //             true,
    //             1
    //         );

    //         expect(await nft.petNeedsEvolutionItem(0)).to.equal(true);
    //         expect(await nft.petEvolutionItemId(0)).to.equal(1);

    //         await token.transfer(user1, parseEther("3000"));

    //         await token.connect(user1).approve(nft.target, MaxInt256);

    //         await nft.connect(user1).mint();

    //         const evo1Info = await nft.getPetEvolutionInfo(0);

    //         console.log({ evo1Info });

    //         await nft.createItem(
    //             "HEROINE",
    //             parseEther("100"),
    //             1000,
    //             10,
    //             parseUnits("1", 18),
    //             86400,
    //             0,
    //             false
    //         );

    //         await nft.createItem(
    //             "EVOLE ITEM",
    //             parseEther("100"),
    //             1000,
    //             10,
    //             parseUnits("1", 18),
    //             86400,
    //             0,
    //             false
    //         );

    //         await nft.connect(user1).buyItem(0, 0);

    //         await expect(nft.connect(user1).evolve(0)).to.be.revertedWith(
    //             "You need the evolution item"
    //         );

    //         await nft.connect(user1).buyItem(0, 1);

    //         await nft.connect(user1).evolve(0);

    //         const evo2Info = await nft.getPetEvolutionInfo(0);

    //         console.log({ evo2Info });

    //         await nft.connect(user1).evolve(0);

    //         const evo3Info = await nft.getPetEvolutionInfo(0);

    //         console.log({ evo3Info });

    //         const uri = await nft.tokenURI(0);

    //         console.log({ uri });
    //     });

    //     it("Shoud revive", async function () {
    //         const [owner, user1] = await ethers.getSigners();

    //         const { token, nft } = await loadFixture(deployContracts);

    //         await nft.createSpecies(
    //             [
    //                 ["image-link-1", "0-evo0", 20, 10],
    //                 ["image-link-2", "0-evo1", 25, 20],
    //                 ["image-link-3", "0-evo2", 35, 0],
    //             ],
    //             10,
    //             false,
    //             0
    //         );

    //         await token.transfer(user1, parseEther("3000"));

    //         await token.connect(user1).approve(nft.target, MaxInt256);

    //         await nft.connect(user1).mint();

    //         await nft.createItem(
    //             "HEROINE",
    //             parseEther("100"),
    //             1000,
    //             10,
    //             parseUnits("1", 14),
    //             86400,
    //             0,
    //             true
    //         );

    //         await time.increase(86400 * 3);

    //         expect(await nft.isPetAlive(0)).to.equal(false);

    //         await nft.connect(user1).buyItem(0, 0);

    //         expect(await nft.isPetAlive(0)).to.equal(true);
    //     });
    // });
});
