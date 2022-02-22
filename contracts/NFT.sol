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
    }



    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public virtual override {
        require(_isApprovedOrOwner(from, tokenId), "ERC721: transfer caller is not owner nor approved");

        _transfer(from, to, tokenId);
    }

    function burn(uint256 tokenId) public {
        require(_isApprovedOrOwner(msg.sender, tokenId), "ERC721: transfer caller is not owner nor approved");
        _burn(tokenId);
    }

    function createToken(string memory uri) external returns (uint256){
        _tokenIds.increment();
        uint256 newTokenId=_tokenIds.current();
        _mint(msg.sender,newTokenId);
        _setTokenURI(newTokenId,uri);
        setApprovalForAll(contractAddress,true);
        return newTokenId;
    }


    function getMax(uint256[] memory array) public pure returns (uint256) {
        uint256 largest = 0;
        uint256 i;

        for (i = 0; i < array.length; i++) {
            if (array[i] > largest) {
                largest = array[i];
            }
        }
        return largest;
    }
    
}