//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

interface IMusicMarketPlace  {
    function musicTransfer(
        address nftAddress,
        address to,
        uint256 tokenId
    ) external;
}

contract AuctionFactory is ReentrancyGuard {
    event bidEvent(
        uint256 indexed auctionId,
        uint256 indexed tokenId,
        uint256 amount,
        address indexed bidder
    );
    event withdrawEvent(
        uint256 indexed auctionId,
        uint256 amount,
        address indexed withdrawer
    );

    address contactAddress;
    address nftMarket;
    using Counters for Counters.Counter;
    Counters.Counter private _openAuctionCount;
    Counters.Counter private _auctionCount;

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

    enum AuctionStatus {
        Closed,
        Started,
        Reserved,
        Cancelled
    }

    mapping(string => uint256) bids;
    mapping(uint256 => AuctionStatus) tokenIdToStatus;
    mapping(uint256 => Auction) public auctions;

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

    function createAuction(
        uint256 startAt,
        uint256 endAt,
        address seller,
        uint256 startBidPrice,
        uint256 tokenId
    ) external restricted nonReentrant returns (uint){
        require(
            tokenIdToStatus[tokenId] == AuctionStatus.Closed,
            "Cant Create New Auction while another is Pending"
        );
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
        tokenIdToStatus[tokenId] = AuctionStatus.Reserved;
        return auctions[_auctionCount.current()].id;
    }

    function makeBid(uint256 auctionId) external payable nonReentrant {
        require(
            auctions[auctionId].startAt <= block.timestamp &&
                auctions[auctionId].endAt >= block.timestamp,
            "Auction Duration Exceeded"
        );
        require(msg.value > auctions[auctionId].currentBid,"bid must exceed current bid");
        require(auctions[auctionId].status != AuctionStatus.Cancelled,"Cancelled Auction");

        if (auctions[auctionId].highestBidder != address(0)) {
            bids[
                createUniqueBidEntry(
                    auctions[auctionId].highestBidder,
                    auctionId
                )
            ] += auctions[auctionId].currentBid;
        } else {
            auctions[auctionId].status = AuctionStatus.Started;
            tokenIdToStatus[auctions[auctionId].tokenId] = AuctionStatus
                .Started;
        }

        auctions[auctionId].highestBidder = msg.sender;
        auctions[auctionId].currentBid = msg.value;

        emit bidEvent(
            auctionId,
            auctions[auctionId].tokenId,
            auctions[auctionId].currentBid,
            auctions[auctionId].highestBidder
        );
    }

    function withdraw(uint256 auctionId) external payable nonReentrant {
        uint256 auctionBalance = bids[
            createUniqueBidEntry(msg.sender, auctionId)
        ];
        bids[createUniqueBidEntry(msg.sender, auctionId)] = 0;
        (bool sent,) = payable(msg.sender).call{
            value: auctionBalance
        }("");
        assert(sent);
        emit withdrawEvent(auctionId, auctionBalance, msg.sender);
    }

    function closeAuction(uint256 auctionId) external {
        require(
            auctions[auctionId].endAt < block.timestamp &&
                auctions[auctionId].status == AuctionStatus.Started,"Auction not yet ended"
        );

        if (auctions[auctionId].highestBidder != address(0)) {
            IMusicMarketPlace(contactAddress).musicTransfer(
                nftMarket,
                auctions[auctionId].highestBidder,
                auctions[auctionId].tokenId
            );
            (bool sent,) = auctions[auctionId].seller.call{
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
    }
}
