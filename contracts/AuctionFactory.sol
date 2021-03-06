//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

library Music {
    struct Song {
        uint256 itemId;
        uint256 tokenId;
        address musicContract;
        address payable owner;
        address payable seller;
        uint256 price;
        uint256 albumId;
        uint256 trackNumber;
        uint256 artistId;
        uint256 status;
    }
}

interface IMusicMarketPlace {
    function musicTransfer(
        address nftAddress,
        address to,
        uint256 tokenId
    ) external;

    function getItemByTokenId(uint256 tokenId)
        external
        view
        returns (Music.Song memory item);

    function itemIdToSong(uint256 item)
        external
        view
        returns (Music.Song memory);
}

contract AuctionFactory is ReentrancyGuard {
    /*******************Events Definition*******************/
    event bidEvent(
        uint256 indexed auctionId,
        uint256 indexed tokenId,
        uint256 amount,
        address indexed bidder,
        uint256 timestamp
    );
    event withdrawEvent(
        uint256 indexed auctionId,
        uint256 amount,
        address indexed withdrawer,
        uint256 timestamp
    );

    event AuctionEvent(
        uint256 indexed auctionId,
        uint256 indexed tokenId,
        address indexed seller,
        AuctionStatus status,
        string message,
        uint256 timestamp
    );

    /*******************variable  Definition*******************/
    address contactAddress;
    address nftMarket;
    using Counters for Counters.Counter;
    Counters.Counter private _openAuctionCount;
    Counters.Counter private _auctionCount;
    mapping(string => uint256) private bids;
    mapping(uint256 => uint256) public tokenIdToAuction;
    mapping(uint256 => Auction) public auctions;


    /*******************Struct Definition*******************/
    struct Auction {
        uint256 id;
        uint256 tokenId;
        uint256 startAt;
        uint256 endAt;
        address payable seller;
        uint256 currentBid;
        address highestBidder;
        AuctionStatus status;
    }


    /*******************Enum Definition*******************/
    enum AuctionStatus {
        Closed,
        Started,
        Reserved,
        Cancelled
    }


    constructor(address _contactAddress, address nft) {
        contactAddress = _contactAddress;
        nftMarket = nft;
    }

    /**
     * @dev Throws if called by any contract other than the owner.
     */
    modifier restricted() {
        require(msg.sender == address(contactAddress), "not Allowed");
        _;
    }

    /**
     * @dev create Unique String from address and auctionId
     */
    function createUniqueBidEntry(address addr, uint256 auctionId)
        internal
        pure
        returns (string memory)
    {
        return string(abi.encodePacked(addr, auctionId));
    }


    /**
     * @dev create Auction 
     */
    function createAuction(
        uint256 startAt,
        uint256 endAt,
        address seller,
        uint256 startBidPrice,
        uint256 tokenId
    ) external restricted nonReentrant returns (uint256) {
        require(
            auctions[tokenIdToAuction[tokenId]].status == AuctionStatus.Closed,
            "Cant Create New Auction while another is Pending"
        );
        _openAuctionCount.increment();
        _auctionCount.increment();
        auctions[_auctionCount.current()] = Auction({
            id: _auctionCount.current(),
            startAt: startAt,
            endAt: endAt,
            tokenId: tokenId,
            seller: payable(seller),
            currentBid: startBidPrice,
            highestBidder: address(0),
            status: AuctionStatus.Reserved
        });
        tokenIdToAuction[tokenId] = _auctionCount.current();
        emit AuctionEvent(
            auctions[_auctionCount.current()].id,
            tokenId,
            seller,
            AuctionStatus.Reserved,
            "Reserved Auction",
            block.timestamp
        );
        return auctions[_auctionCount.current()].id;
    }

    /**
     * @dev Make Bid in an Active Auction
     */
    function makeBid(uint256 auctionId) external payable nonReentrant {
        require(
            auctions[auctionId].startAt <= block.timestamp &&
                auctions[auctionId].endAt >= block.timestamp,
            "Auction Duration Exceeded"
        );
        require(
            msg.value > auctions[auctionId].currentBid,
            "bid must exceed current bid"
        );
        require(
            auctions[auctionId].status != AuctionStatus.Cancelled,
            "Cancelled Auction"
        );

        if (auctions[auctionId].highestBidder != address(0)) {
            bids[
                createUniqueBidEntry(
                    auctions[auctionId].highestBidder,
                    auctionId
                )
            ] += auctions[auctionId].currentBid;
        } else {
            auctions[auctionId].status = AuctionStatus.Started;
            emit AuctionEvent(
                auctions[auctionId].id,
                auctions[auctionId].tokenId,
                auctions[auctionId].seller,
                AuctionStatus.Started,
                "Auction Start",
                block.timestamp
            );
        }

        auctions[auctionId].highestBidder = msg.sender;
        auctions[auctionId].currentBid = msg.value;

        emit bidEvent(
            auctionId,
            auctions[auctionId].tokenId,
            auctions[auctionId].currentBid,
            auctions[auctionId].highestBidder,
            block.timestamp
        );
    }

    /**
     * @dev View Funds allocation in auction
     */
    function amountInAuction(uint256 auctionId) external view returns(uint) {
        return bids[createUniqueBidEntry(msg.sender, auctionId)];
    }

    function withdraw(uint256 auctionId) external payable nonReentrant {
        uint256 auctionBalance = bids[
            createUniqueBidEntry(msg.sender, auctionId)
        ];
        bids[createUniqueBidEntry(msg.sender, auctionId)] = 0;
        (bool sent, ) = payable(msg.sender).call{value: auctionBalance}("");
        assert(sent);
        emit withdrawEvent(
            auctionId,
            auctionBalance,
            msg.sender,
            block.timestamp
        );
    }


    /**
     * @dev Close Auction
     */
    function closeAuction(uint256 auctionId) external {
        require(
            auctions[auctionId].endAt < block.timestamp,
            "Auction not yet ended"
        );
        require(
            auctions[auctionId].status != AuctionStatus.Cancelled,
            "Cancelled Auction"
        );

        if (auctions[auctionId].highestBidder != address(0)) {
            IMusicMarketPlace(contactAddress).musicTransfer(
                nftMarket,
                auctions[auctionId].highestBidder,
                auctions[auctionId].tokenId
            );
            (bool sent, ) = auctions[auctionId].seller.call{
                value: auctions[auctionId].currentBid
            }("");
            assert(sent);
        } else {
            IMusicMarketPlace(contactAddress).musicTransfer(
                nftMarket,
                auctions[auctionId].seller,
                auctions[auctionId].tokenId
            );
        }
        _openAuctionCount.decrement();
        auctions[auctionId].status = AuctionStatus.Closed;
        emit AuctionEvent(
            auctions[auctionId].id,
            auctions[auctionId].tokenId,
            auctions[auctionId].seller,
            AuctionStatus.Closed,
            "Auction Closed",
            block.timestamp
        );
    }

    /**
     * @dev get Auction
     */
    function getAuctions() public view returns (Auction[] memory data) {
        data = new Auction[](_auctionCount.current());
        for (uint256 i = 1; i <= data.length; i++) {
            data[i - 1] = auctions[i];
        }
    }

    /**
     * @dev get Auction by ItemId
     */
    function getAuctionByItemId(uint256 itemId)
        public
        view
        returns (Auction memory data)
    {
        Music.Song memory _song = IMusicMarketPlace(contactAddress)
            .itemIdToSong(itemId);
        data = auctions[tokenIdToAuction[_song.tokenId]];
    }
}
