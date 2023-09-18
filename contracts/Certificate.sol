//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./ERC4671.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Certificate is ERC4671, Ownable {

    address public owner;

    constructor(string memory _certificateName, string memory _symbol) ERC4671(_certificateName, _symbol) {
    owner = msg.sender;
    }

    mapping(address => uint) public holderToId;

    event TokenMinted(address indexed _holder, uint indexed _tokenId);

    function createCertificate(address _holder, string memory _tokenUri) external onlyOwner {
        _mint(_holder);
        holderToId[_holder] = emittedCount() - 1;
        setTokenURI(holderToId[_holder], _tokenUri);
        emit TokenMinted(_holder, holderToId[_holder]);
    }

    function revoke(uint _tokenId) external onlyOwner {
        super._revoke(_tokenId);
    }
 

}
