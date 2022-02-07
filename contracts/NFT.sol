//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFT is ERC721URIStorage{
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address contractAddress;


    constructor(address marketplace) ERC721("Leballo Tokens","lebs"){
        contractAddress = marketplace;
        setApprovalForAll(contractAddress,true);
    }

    function createToken(string memory uri) external returns (uint256){
        _tokenIds.increment();
        uint256 newTokenId=_tokenIds.current();
        _mint(msg.sender,newTokenId);
        _setTokenURI(newTokenId,uri);
        approve(contractAddress,newTokenId);
        setApprovalForAll(contractAddress,true);
        return newTokenId;
    }
    
}