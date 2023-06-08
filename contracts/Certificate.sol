//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./ERC4671.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Certificate is ERC4671, Ownable {
    constructor(string memory _certificateName, string memory _symbol) ERC4671(_certificateName, _symbol) {

    }

    mapping(address => uint) public holderToId;

    event TokenMinted(address indexed _holder, uint indexed _tokenId);

    function createCertificate(address _holder, string memory _tokenUri) public onlyOwner {
        _mint(_holder);
        holderToId[_holder] = emittedCount() - 1;
        setTokenURI(holderToId[_holder], _tokenUri);
        emit TokenMinted(_holder, holderToId[_holder]);
    }


}