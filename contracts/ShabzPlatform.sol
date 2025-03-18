// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract SHABzPlatform is Ownable {
    // Mapping to track user engagement points for gamification
    mapping(address => bool) public isCreator;
    mapping(address => bool) public isUser;
    
    event UserRegistered(address indexed user);
    event CreatorRegistered(address indexed creator);
    
    constructor() Ownable(msg.sender) {}
    
    //  USER & CREATOR REGISTRATION
    function registerUser() external {
        require(!isUser[msg.sender], "Already registered as User");
        isUser[msg.sender] = true;
        emit UserRegistered(msg.sender);
    }
    
    function registerCreator() external {
        require(!isCreator[msg.sender], "Already registered as creator");
        isCreator[msg.sender] = true;
        emit CreatorRegistered(msg.sender);
    }
    
    function isUserOrCreator() public view returns (string memory personax) {
        if (isUser[msg.sender]) personax = "USER";
        if (isCreator[msg.sender]) personax =  "CREATOR";
        return  personax;
    }
}
