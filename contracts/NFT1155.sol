//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LebelloNFT1155 is ERC1155, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    //fallback uri
    mapping(uint256 => string) public  _tokenURIs;

    constructor() ERC1155("leballo.com/nfts/") {
    }

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function createToken(string calldata uri,uint256 amount) external onlyOwner returns  (uint256) {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        _mint(msg.sender, newTokenId, amount, "");
        _setTokenURI(newTokenId, uri);
        setApprovalForAll(owner(), true);
        return newTokenId;
    }

    /**
     * @dev Sets `_tokenURI` as the tokenURI of `tokenId`.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     */
    function _setTokenURI(uint256 tokenId, string memory _tokenURI)
        internal
        virtual
    {
        _tokenURIs[tokenId] = _tokenURI;
    }

    function transferFrom(
        address from,
        address to,
        uint256 tokenId,
        uint256 amount
    ) public virtual {
        safeTransferFrom(from, to, tokenId, amount, "");
    }

    function burn(uint256 tokenId,uint256 amount) public {
        _burn(msg.sender, tokenId,amount);
    }
}

// contract NFT is ERC721URIStorage {
//     constructor(address marketplace) ERC721("Leballo Tokens", "lebs") {}

//     // Optional mapping for token URIs
//     mapping(uint256 => string) private _tokenURIs;

//     function transferFrom(
//         address from,
//         address to,
//         uint256 tokenId
//     ) public virtual override {
//         require(
//             _isApprovedOrOwner(from, tokenId),
//             "ERC721: transfer caller is not owner nor approved"
//         );

//         _transfer(from, to, tokenId);
//     }

//     function burn(uint256 tokenId) public {
//         require(
//             _isApprovedOrOwner(msg.sender, tokenId),
//             "ERC721: transfer caller is not owner nor approved"
//         );
//         _burn(tokenId);
//     }

//     function createToken(string memory uri) external returns (uint256) {
//         _tokenIds.increment();
//         uint256 newTokenId = _tokenIds.current();
//         _mint(msg.sender, newTokenId);
//         _setTokenURI(newTokenId, uri);
//         setApprovalForAll(contractAddress, true);
//         return newTokenId;
//     }

//     function getMax(uint256[] memory array) public pure returns (uint256) {
//         uint256 largest = 0;
//         uint256 i;

//         for (i = 0; i < array.length; i++) {
//             if (array[i] > largest) {
//                 largest = array[i];
//             }
//         }
//         return largest;
//     }

//     /**
//      * @dev fallback permer
//      */
//     function tokenURI(uint256 tokenId)
//         public
//         view
//         virtual
//         override
//         returns (string memory)
//     {
//         require(_exists(tokenId), "URI query for nonexistent token");

//         string memory _tokenURI = _tokenURIs[tokenId];
//         string memory base = _baseURI();

//         // If there is no base URI, return the token URI.
//         if (bytes(base).length == 0) {
//             return _tokenURI;
//         }
//         // If both are set, concatenate the baseURI and tokenURI (via abi.encodePacked).
//         if (bytes(_tokenURI).length > 0) {
//             return string(abi.encodePacked(base, _tokenURI));
//         }

//         return super.tokenURI(tokenId);
//     }

//     /**
//      * @dev Sets `_tokenURI` as the tokenURI of `tokenId`.
//      *
//      * Requirements:
//      *
//      * - `tokenId` must exist.
//      */
//     function _setTokenURI(uint256 tokenId, string memory _tokenURI)
//         internal
//         virtual
//     {
//         require(
//             _exists(tokenId),
//             "ERC721URIStorage: URI set of nonexistent token"
//         );
//         _tokenURIs[tokenId] = _tokenURI;
//     }

//     /**
//      * @dev Destroys `tokenId`.
//      * The approval is cleared when the token is burned.
//      *
//      * Requirements:
//      *
//      * - `tokenId` must exist.
//      *
//      * Emits a {Transfer} event.
//      */
//     function _burn(uint256 tokenId) internal virtual override {
//         super._burn(tokenId);

//         if (bytes(_tokenURIs[tokenId]).length != 0) {
//             delete _tokenURIs[tokenId];
//         }
//     }
// }
