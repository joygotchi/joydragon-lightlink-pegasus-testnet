// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;
import {WETH} from  "solmate/src/tokens/WETH.sol";

contract MockWETH is WETH {
    constructor() {
        _mint(msg.sender, 1_000_000 ether);
    }
} 