const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { parseEther, MaxInt256 } = require("ethers");

describe("QRNG", function () {
    async function deployContracts() {
        const [owner] = await ethers.getSigners();

        const QRNG = await ethers.getContractFactory("QRNG");
        const qrng = await QRNG.deploy(
            "0x2ab9f26E18B64848cd349582ca3B55c2d06f507d"
        );

        return {
            qrng,
        };
    }

    describe("CHECK", function () {
        it("Shoud Mint", async function () {
            const { qrng } = await loadFixture(deployContracts);
            [owner] = await ethers.getSigners();

            console.log(qrng.target);
        });
    });
});
