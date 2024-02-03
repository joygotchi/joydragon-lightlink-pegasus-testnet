// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

interface IGameManager {
    function onAttack(
        uint256 fromId,
        uint256 toId
    ) external view returns (uint256 pct, uint256 odds, bool canAttack);

    function onBuyAccessory(
        uint256 fromId,
        uint256 itemId
    ) external view returns (bool shouldContinue);
}