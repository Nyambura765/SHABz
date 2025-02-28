// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Game {
    IERC20 public rewardToken;
    address public owner;
    uint256 private spinNonce;

    event SpinResult(address indexed player, uint256 rewardAmount, uint256 randomValue);

    constructor(address _rewardToken) {
        rewardToken = IERC20(_rewardToken);
        owner = msg.sender;
        spinNonce = 0;
    }

    
    function spinWheel() public {
        spinNonce++;

        // Generate a random number between 0 and 99.
        uint256 randomValue = uint256(
            keccak256(abi.encodePacked(blockhash(block.number - 1), msg.sender, spinNonce))
        ) % 100; 

        uint256 rewardAmount = 0;

        // Determine reward based on the random value.
        if (randomValue < 50) {
            rewardAmount = 10 * 1e18;  // 50% chance to win 10 tokens
        } else if (randomValue < 80) {
            rewardAmount = 25 * 1e18;  // 30% chance to win 25 tokens
        } else {
            rewardAmount = 50 * 1e18;  // 20% chance to win 50 tokens
        }

        // Ensure the contract has enough tokens to reward the player.
        require(rewardToken.balanceOf(address(this)) >= rewardAmount, "Not enough tokens in contract");

        // Transfer tokens to the player.
        rewardToken.transfer(msg.sender, rewardAmount);

        emit SpinResult(msg.sender, rewardAmount, randomValue);
    }
}
