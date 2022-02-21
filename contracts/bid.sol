//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/utils/Counters.sol";

contract AuctionFactory {
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

    address public contactAddress;
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
    mapping(uint256 => Auction) public Auctions;

    constructor(address _contactAddress) {
        contactAddress = _contactAddress;
    }

    /**
     * @dev Throws if called by any contract other than the owner.
     */
    modifier restricted() {
        require(contactAddress == msg.sender, "not owner");
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
    ) external restricted {
        require(
            tokenIdToStatus[tokenId] == AuctionStatus.Closed,
            "Cant Create New Auction while another is Pending"
        );
        _auctionCount.increment();
        Auctions[_auctionCount.current()] = Auction({
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
    }

    function bid(uint256 auctionId) external payable {
        require(
            Auctions[auctionId].startAt <= block.timestamp &&
                Auctions[auctionId].endAt >= block.timestamp,
            "Auction Duration Exceeded"
        );
        require(msg.value > Auctions[auctionId].currentBid);
        require(Auctions[auctionId].status != AuctionStatus.Cancelled);

        if (Auctions[auctionId].highestBidder != address(0)) {
            bids[
                createUniqueBidEntry(
                    Auctions[auctionId].highestBidder,
                    auctionId
                )
            ] += Auctions[auctionId].currentBid;
        } else {
            Auctions[auctionId].status = AuctionStatus.Started;
            tokenIdToStatus[Auctions[auctionId].tokenId] = AuctionStatus
                .Started;
        }

        Auctions[auctionId].highestBidder = msg.sender;
        Auctions[auctionId].currentBid = msg.value;

        emit bidEvent(
            auctionId,
            Auctions[auctionId].tokenId,
            Auctions[auctionId].currentBid,
            Auctions[auctionId].highestBidder
        );
    }

    function withdraw(uint256 auctionId) external payable {
        uint256 auctionBalance = bids[
            createUniqueBidEntry(msg.sender, auctionId)
        ];
        bids[createUniqueBidEntry(msg.sender, auctionId)] = 0;
        (bool sent, bytes memory data) = Auctions[auctionId].seller.call{
            value: auctionBalance
        }("");
        assert(sent);
        emit withdrawEvent(auctionId, auctionBalance, msg.sender);
    }
}
