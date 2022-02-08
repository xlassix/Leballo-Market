//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";


contract NFTMarket is ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _itemsIds;
    Counters.Counter private _itemsSold;
    Counters.Counter private _currentListings;
    address payable _owner;
    uint256 listingPrice = 0.025 ether;

    enum MarketItemStatus {
        Active,
        Sold,
        Reserved
    }
    struct MarketItem {
        uint256 itemId;
        uint256 tokenId;
        address nftContract;
        address payable owner;
        address payable seller;
        uint256 price;
        MarketItemStatus status;
    }
    mapping(uint256 => MarketItem) private itemIdToMarketItem;

    event MarketItemEvent(
        uint256 indexed itemId,
        uint256 indexed tokenId,
        address indexed nftContract,
        address owner,
        address seller,
        uint256 price,
        MarketItemStatus status,
        string message
    );

    constructor() {
        _owner = payable(msg.sender);
    }

    function getListingPrice() public view returns (uint256) {
        return listingPrice;
    }

    function createMarketItem(
        address nftContract,
        uint256 tokenId,
        uint256 price
    ) public payable nonReentrant {
        require(price > 0, "Item Price most be greater then 1 WEI");
        require(msg.value >= listingPrice, "Insufficent listing fee");

        _itemsIds.increment();
        uint256 currentItemId = _itemsIds.current();
        itemIdToMarketItem[currentItemId] = MarketItem(
            currentItemId,
            tokenId,
            nftContract,
            payable(address(0)),
            payable(msg.sender),
            price,
            MarketItemStatus.Active
        );

        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);
        emit MarketItemEvent(
            currentItemId,
            tokenId,
            nftContract,
            address(0),
            msg.sender,
            price,
            MarketItemStatus.Active,
            "Created NFT"
        );
    }

    function createMarketItemSale(address nftContract, uint256 itemId)
        public
        payable
        returns(MarketItem memory)
    {
        MarketItem memory currentToken = itemIdToMarketItem[itemId];
        uint256 price = currentToken.price;
        uint256 tokenId = currentToken.tokenId;
        require(msg.value >= price, "kindly transfer the listed price");

        IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);
        currentToken.status = MarketItemStatus.Active;
        currentToken.owner = payable(msg.sender);
        _itemsSold.increment();
        currentToken.seller.transfer(price);
        _owner.transfer(listingPrice);
        itemIdToMarketItem[itemId]=currentToken;
        emit MarketItemEvent(
            itemId,
            tokenId,
            nftContract,
            itemIdToMarketItem[itemId].owner,
            itemIdToMarketItem[itemId].seller,
            price,
            MarketItemStatus.Sold,
            "Transferred NFT"
        );
        return currentToken;
    }

    function listItem(address nftContract, uint256 itemId,uint256 price)
        public
        payable
    {
        MarketItem storage currentToken = itemIdToMarketItem[itemId];
        uint256 tokenId = currentToken.tokenId;
        require(msg.value >= listingPrice , "kindly transfer the listed price");
        require(payable(msg.sender) == payable(currentToken.owner), "you must must be the owner");
        currentToken.price=price;
        _currentListings.increment();
        emit MarketItemEvent(
            itemId,
            tokenId,
            nftContract,
            msg.sender,
            _owner,
            price,
            MarketItemStatus.Active,
            "List NFT"
        );

    }

    function getMarketItems(uint limit) public view returns (MarketItem[] memory) {
        uint256 itemCount = _itemsIds.current();
        uint256 unsoldItemCount = itemCount - _itemsSold.current();
        uint256 currentIndex = 0;
        uint256 _min =Math.min(limit, unsoldItemCount);

        MarketItem[] memory unsoldItem = new MarketItem[](_min);

        for (uint256 index = 0; index < itemCount; index++) {
            if(currentIndex==_min){
                break;
            }
            if (itemIdToMarketItem[index + 1].owner == address(0)||itemIdToMarketItem[index + 1].status==MarketItemStatus.Active) {
                MarketItem memory currentItem = itemIdToMarketItem[index + 1];
                unsoldItem[currentIndex] = currentItem;
                currentIndex++;
            }
        }
        return unsoldItem;
    }

    function fetchMyNfts(uint limit) public view returns (MarketItem[] memory) {
        uint256 _itemsCount = _itemsIds.current();
        uint256 nftOwned = 0;
        uint256 currentIndexOfNftFound = 0;

        for (uint256 index = 0; index < _itemsCount; index++) {
            if (itemIdToMarketItem[index + 1].owner == msg.sender&& itemIdToMarketItem[index + 1].status!=MarketItemStatus.Active) {
                nftOwned += 1;
            }
        }
        if (nftOwned == 0) {
            return new MarketItem[](0);
        }
        uint256 _min =Math.min(limit, nftOwned);
        MarketItem[] memory myNfts = new MarketItem[](_min);
        for (uint256 index = 0; index < _itemsCount; index++) {
            if(currentIndexOfNftFound==_min){
                break;
            }
            if (itemIdToMarketItem[index + 1].owner == msg.sender&& itemIdToMarketItem[index + 1].status!=MarketItemStatus.Active) {
                myNfts[currentIndexOfNftFound] = itemIdToMarketItem[index + 1];
                currentIndexOfNftFound += 1;
            }
        }
        return myNfts;
    }

    function fetchNftsCreated(uint limit) public view returns (MarketItem[] memory) {
        uint256 _itemsCount = _itemsIds.current();
        uint256 nftCreated = 0;
        uint256 currentIndexOfNftFound = 0;

        for (uint256 index = 0; index < _itemsCount; index++) {
            if (itemIdToMarketItem[index + 1].seller == msg.sender) {
                nftCreated += 1;
            }
        }
        if (nftCreated == 0) {
            return new MarketItem[](0);
        }
        uint256 _min =Math.min(limit, nftCreated);
        MarketItem[] memory myNfts = new MarketItem[](_min);
        for (uint256 index = 0; index < _itemsCount; index++) {
            if(currentIndexOfNftFound==_min){
                break;
            }
            if (itemIdToMarketItem[index + 1].seller == msg.sender) {
                myNfts[currentIndexOfNftFound] = itemIdToMarketItem[index + 1];
                currentIndexOfNftFound += 1;
            }
        }
        return myNfts;
    }
}
