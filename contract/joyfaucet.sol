// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
interface IERC20 {
    function transfer(address recipient, uint256 amount) external returns (bool);
}

contract JoyGotchiFaucet {
    IERC20 public token;

    constructor(address _token) {
        token = IERC20(_token);
    }

    function getJoy(address _to) external {
        token.transfer(_to, 2000 ether);
    }
}