const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { parseEther, MaxInt256 } = require("ethers");

describe("GenePool", function () {
    async function deployContracts() {
        const [owner] = await ethers.getSigners();

        const GenePool = await ethers.getContractFactory("GenePool");
        const genePool = await GenePool.deploy(owner.address);

        return {
            genePool,
        };
    }

    describe("CHECK", function () {
        it("Shoud Mint", async function () {
            const [owner, user1] = await ethers.getSigners();

            console.log(owner.address);

            const { genePool } = await loadFixture(deployContracts);

            await genePool.addSpeciesToGenePool(0, 2);

            const a = await genePool.speciesToSpawnCondition(0);

            await genePool.addSpeciesToGenePool(1, 2);

            const b = await genePool.speciesToSpawnCondition(1);

            await genePool.addSpeciesToGenePool(2, 6);

            const c = await genePool.speciesToSpawnCondition(2);

            console.log({
                a,
                b,
                c,
            });

            let type0 = 0;
            let type1 = 0;
            let type2 = 0;

            for (let i = 0; i < 1000; i++) {
                const r = await genePool.generateRandomGene(owner, i);
                if (r == 0n) type0++;
                if (r == 1n) type1++;
                if (r == 2n) type2++;
            }

            console.log({
                type0,
                type1,
                type2,
            });
        });
    });
});
