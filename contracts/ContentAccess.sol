// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title ContentAccess
 * @dev Smart contract for managing premium content access based on ERC-20 token ownership.
 */
   contract ContentAccess is Ownable {
    IERC20 public token;

    enum Tier { Bronze, Silver, Gold }

    struct TierInfo {
        uint256 tokenRequirement; // Token amount required for the tier
    }

    mapping(Tier => TierInfo) public tiers; // Mapping of tier to its token requirements
    mapping(uint256 => Tier) public contentTiers; // Mapping of content ID to its required tier

    event ContentUnlocked(address indexed user, uint256 contentId);

    
    constructor(address tokenAddress) Ownable (msg.sender){
        
        token = IERC20(tokenAddress);

        // Initialize default token requirements for each tier
        tiers[Tier.Bronze] = TierInfo({ tokenRequirement: 10 });
        tiers[Tier.Silver] = TierInfo({ tokenRequirement: 50 });
        tiers[Tier.Gold] = TierInfo({ tokenRequirement: 100 });
    }


    function setTierRequirement(Tier tier, uint256 requirement) external onlyOwner {
        tiers[tier].tokenRequirement = requirement;
    }

    
    function setContentTier(uint256 contentId, Tier tier) external onlyOwner {
        contentTiers[contentId] = tier;
    }

  
    function hasAccess(address user, uint256 contentId) public view returns (bool) {
        Tier requiredTier = contentTiers[contentId];
        uint256 userBalance = token.balanceOf(user);
        return userBalance >= tiers[requiredTier].tokenRequirement;
    }

    
    function unlockContent(uint256 contentId) external {
        require(hasAccess(msg.sender, contentId), "Insufficient token balance to unlock content");
        emit ContentUnlocked(msg.sender, contentId);
    }

    
    function withdrawTokens(address recipient, uint256 amount) external onlyOwner {
        token.transfer(recipient, amount);
    }
}
