// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract GenePool {
    address public nft;
    uint256 public totalGeneNum;
    uint256 public speciesCount;
    uint256 public eyeColorGeneNum;
    uint256 public skinColorGeneNum;
    uint256 public hornStyleGeneNum;
    uint256 public wingStyleGeneNum;

    struct spawnCondition{
        uint256 gte;
        uint256 lte;
    }

    mapping(uint256 => spawnCondition) public speciesToSpawnCondition;
    mapping(uint256 => bool) public isSpeciesGeneInitialized;


    constructor(
        address _joyGotchiNFT,
        uint256 _eyeColorGeneNum,
        uint256 _skinColorGeneNum,
        uint256 _hornStyleGeneNum,
        uint256 _wingStyleGeneNum
    ) {
        nft = _joyGotchiNFT;
        eyeColorGeneNum = _eyeColorGeneNum;
        skinColorGeneNum = _skinColorGeneNum;
        hornStyleGeneNum = _hornStyleGeneNum;
        wingStyleGeneNum = _wingStyleGeneNum;
    }

    modifier onlyNFT() {
        require(msg.sender == nft, "Unauthorized");
        _;
    }


    function addSpeciesToGenePool(uint _id, uint256 _geneNum) external onlyNFT returns (uint256){
        require(!isSpeciesGeneInitialized[_id], "Species already added");
        isSpeciesGeneInitialized[_id] = true;
        speciesToSpawnCondition[_id] = spawnCondition(totalGeneNum, totalGeneNum + _geneNum - 1);
        totalGeneNum += _geneNum;
        speciesCount++;
        return speciesCount;
    }

    function generateRandomGene(address _account, uint _nftId, uint seed) external view onlyNFT returns (uint256 species, uint256 eyeColor, uint256 skinColor, uint256 hornStyle, uint256 wingStyle) {
        uint256 random = uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, _account, _nftId, seed)));
        uint256 randomSpeciesNum = random % totalGeneNum;
        for (uint256 i = 0; i < speciesCount; i++) {
            if (randomSpeciesNum >= speciesToSpawnCondition[i].gte && randomSpeciesNum <= speciesToSpawnCondition[i].lte) {
                species = i;
                break;
            }
        }
        eyeColor = random % eyeColorGeneNum;
        skinColor = random % skinColorGeneNum;
        hornStyle = random % hornStyleGeneNum;
        wingStyle = random % wingStyleGeneNum;
    }
    receive() external payable {
        payable(nft).transfer(msg.value);
    }
}