// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface IGenePool {
    function nft() external view returns (address);
    function totalGeneNum() external view returns (uint256);
    function speciesCount() external view returns (uint256);
    function eyeColorGeneNum() external view returns (uint256);
    function skinColorGeneNum() external view returns (uint256);
    function hornStyleGeneNum() external view returns (uint256);
    function wingStyleGeneNum() external view returns (uint256);
    function speciesToSpawnCondition(uint256 _id) external view returns (uint256 gte, uint256 lte);
    function isSpeciesGeneInitialized(uint256 _id) external view returns (bool);
    function addSpeciesToGenePool(uint _id, uint256 _geneNum) external returns (uint256);
    function generateRandomGene(address _account, uint _nftId, uint seed) external view returns (uint256 species, uint256 eyeColor, uint256 skinColor, uint256 hornStyle, uint256 wingStyle);
}