// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

interface IFrenPet {
    function lastAttackUsed(uint256 id) external view returns (uint256);

    function lastAttacked(uint256 id) external view returns (uint256);

    function level(uint256 id) external view returns (uint256);

    function score(uint256 id) external view returns (uint256);
}