// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CreatorToken is ERC20 {
    address public creator;

    modifier onlyCreator() {
        require(msg.sender == creator, "Not the creator");
        _;
    }

    constructor(string memory name, string memory symbol, address _creator) ERC20(name, symbol) {
        creator = _creator;
    }

    function mint(address to, uint256 amount) external onlyCreator {
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) external onlyCreator {
        _burn(from, amount);
    }
}