// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CreatorToken is ERC20, Ownable {
    constructor(
        string memory name,
        string memory symbol,
        address initialOwner
    ) ERC20(name, symbol) Ownable(initialOwner) {}
    
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
    
    function burnFrom(address account, uint256 amount) external onlyOwner {
        uint256 currentAllowance = allowance(account, address(this));
        require(currentAllowance >= amount, "ERC20: burn amount exceeds allowance");
        
        _approve(account, address(this), currentAllowance - amount);
        _burn(account, amount);
    }
}