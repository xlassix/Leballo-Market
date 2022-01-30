//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";


contract NFTMarket is ReentrancyGuard{
    using Counters for Counters.Counter;
    Counters.Counter private _itemsIds;
    Counters.Counter private _ItemsSold;
    address payable _owner;
    uint256 listingPrice = 0.025 ether;

    enum MarketItemStatus{
        Active,
        Sold,
        Reserved
    }
    struct MarketItem{
        uint itemId;
        uint256 tokenId;
        address nftContract;
        address payable owner;
        address payable seller;
        uint256 price;
        MarketItemStatus status;
    }
    mapping (uint256=>MarketItem) private itemIdToMarketItem;

    event MarketItemEvent(
        uint indexed itemId,
        uint256 indexed tokenId,
        address indexed nftContract,
        address owner,
        address seller,
        uint256 price,
        MarketItemStatus status,
        string message
    );

    constructor(){
        _owner=payable(msg.sender);
    }

    function getListingPrice() public view returns (uint256){
        return listingPrice;
    }

    function createMarketItem(
        address nftContract,
        uint256 tokenId,
        uint256 price
    )public payable nonReentrant{
        require(price>0,"Item Price most be greater then 1 WEI");
        require(msg.value>=listingPrice,"Insufficent listing fee");


        _itemsIds.increment();
        uint256 currentItemId=_itemsIds.current();
        itemIdToMarketItem[currentItemId]=MarketItem(
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
            MarketItemStatus.Active , 
            "Created NFT"
            );
    }

    function sellMarketItem(
        address nftContract,
        uint256 itemId
    )public payable nonReentrant{
        MarketItem storage currentToken = itemIdToMarketItem[itemId];
        uint256 price = currentToken.price;
        uint256 tokenId = currentToken.tokenId;
        require(msg.value>=price,"kindly transfer the listed price");


        IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);
        currentToken.status= MarketItemStatus.Active ;
        currentToken.owner=payable(msg.sender);
        _ItemsSold.increment();
        currentToken.seller.transfer(price);
        _owner.transfer(listingPrice);
        emit MarketItemEvent(itemId, tokenId, nftContract, currentToken.owner,currentToken.seller , price,MarketItemStatus.Sold, "Transferred NFT");
    }

    function getMarketItems() public view returns (MarketItem[] memory) {
        uint itemCount = _itemsIds.current();
        uint unsoldItemCount = itemCount - _ItemsSold.current();
        uint currentIndex=0;

        MarketItem[] memory unsoldItem= new MarketItem[](unsoldItemCount);

        for (uint index = 0; index < itemCount; index++) {
            if (itemIdToMarketItem[index+1].owner==address(0)){
                MarketItem memory currentItem = itemIdToMarketItem[index+1];
                unsoldItem[currentIndex]=currentItem;
                currentIndex++;
            }
        }
        return unsoldItem;
    }

    function fetchMyNfts()public view returns(MarketItem[] memory){
        uint _itemsCount = _itemsIds.current();
        uint nftOwned=0;
        uint currentIndexOfNftFound=0;

        for(uint index = 0; index < _itemsCount; index++) {
            if (itemIdToMarketItem[index+1].owner==msg.sender){
                nftOwned+=1;
            }
        }
        if(nftOwned==0){
            return new MarketItem[](0);
        }
        MarketItem[] memory myNfts = new MarketItem[](nftOwned);
        for(uint index = 0; index < _itemsCount; index++) {
            if (itemIdToMarketItem[index+1].owner==msg.sender){
                myNfts[currentIndexOfNftFound] = itemIdToMarketItem[index+1];
                currentIndexOfNftFound+=1;
            }
        }
        return myNfts;
    }

    function fetchNftsCreated()public view returns(MarketItem[] memory){
        uint _itemsCount = _itemsIds.current();
        uint nftCreated=0;
        uint currentIndexOfNftFound=0;

        for(uint index = 0; index < _itemsCount; index++) {
            if (itemIdToMarketItem[index+1].seller==msg.sender){
                nftCreated+=1;
            }
        }
        if(nftCreated==0){
            return new MarketItem[](0);
        }
        MarketItem[] memory myNfts = new MarketItem[](nftCreated);
        for(uint index = 0; index < _itemsCount; index++) {
            if (itemIdToMarketItem[index+1].seller==msg.sender){
                myNfts[currentIndexOfNftFound] = itemIdToMarketItem[index+1];
                currentIndexOfNftFound+=1;
            }
        }
        return myNfts;
    }
}