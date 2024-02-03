// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

interface IModeFeeSharing {
    function register(address _recipient) external returns (uint256);
}