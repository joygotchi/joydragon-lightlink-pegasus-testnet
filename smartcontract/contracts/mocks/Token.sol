// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;
import {ERC20Burnable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
 


contract Token is ERC20,ERC20Burnable {
    constructor() ERC20("Token", "TKN") {
        _mint(msg.sender, 1_000_000 ether);
    }
} 