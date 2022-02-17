//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

contract MusicMarket is ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _songCount;
    Counters.Counter private _musicMarketCount;
    Counters.Counter private _artistCount;
    Counters.Counter private _albumCount;
    Counters.Counter private _currentListings;
    address payable public owner;
    uint256 private listingPrice = 0.025 ether;

    //Defined Enums
    enum SongStatus {
        Active,
        Sold,
        Reserved
    }
    enum AlbumStatus {
        Reserved,
        NotVerified,
        Verified
    }

    //Struct definitions
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
        SongStatus status;
    }
    struct Artist {
        uint256 id;
        string artistName;
        string url;
    }
    struct Album {
        uint256 id;
        string albumName;
        uint256 createdAt;
        AlbumStatus Status;
        string coverUrl;
        uint256 mintedSongs;
        uint256 soldSongs;
    }

    //Mapping Definition
    mapping(uint256 => Song) public itemIdToSong;
    mapping(uint256 => Artist) public artists;
    mapping(uint256 => Album) private _albums;
    mapping(uint256 => uint256[]) private _albumToArtistMapping;
    mapping(address => uint256) private ownerToNftCount;

    event SongEvent(
        uint256 indexed itemId,
        uint256 indexed tokenId,
        address musicContract,
        address owner,
        address seller,
        uint256 price,
        uint256 indexed albumId,
        uint256 trackNumber,
        uint256 artistId,
        SongStatus status,
        string message
    );

    event AlbumEvent(
        uint256 indexed albumId,
        string albumName,
        uint256 createdAt,
        AlbumStatus Status,
        string coverUrl,
        uint256 mintedSongs,
        uint256 soldSongs,
        string message
    );

    event ArtistEvent(
        uint256 indexed artistId,
        string artistName,
        string url,
        string message
    );

    /**
     * @dev Initialized Constructor and set value owner.
     */
    constructor() {
        owner = payable(msg.sender);
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        require(address(owner) == msg.sender, "Caller must be the owner");
        _;
    }

    /**
     * @dev Fetch current Listing Price
     */
    function getListingPrice() public view returns (uint256) {
        return listingPrice;
    }

    function getArtists() public view returns (Artist[] memory data) {
        data = new Artist[](_artistCount.current());
        for (uint256 i = 1; i <= data.length; i++) {
            data[i - 1] = (artists[i]);
        }
    }

    function getAlbums() public view returns (Album[] memory data) {
        data = new Album[](_albumCount.current());
        for (uint256 i = 1; i <= data.length; i++) {
            data[i - 1] = (_albums[i]);
        }
    }

    /**
     * @dev set current Listing Price(can only be performed by the Owner)
     */
    function setListingPrice(uint256 price)
        external
        onlyOwner
        returns (uint256)
    {
        require(owner == msg.sender, "Only the Owner Can set Listing Price");
        listingPrice = price;
        return listingPrice;
    }

    function createArtist(string memory artistName, string memory uri)
        external
        onlyOwner
        returns (uint256 artistID)
    {
        require(bytes(uri).length != 0, "URI cant be null or empty");
        _artistCount.increment();
        uint256 currentArtistId = _artistCount.current();
        artists[currentArtistId] = Artist(currentArtistId, artistName, uri);
        emit ArtistEvent(currentArtistId, artistName, uri, "Artist Created");
        return currentArtistId;
    }

    function createAlbum(
        string memory albumName,
        string memory uri,
        uint256[] memory _artists
    ) external onlyOwner returns (uint256 albumId) {
        require(bytes(uri).length != 0, "URI cant be null or empty");
        require(_artists.length != 0, "At least include a length");
        // require(
        //     _artists.getMax() <= _artistCount.current(),
        //     "The array artists contains an Invalid Id"
        // );

        _albumCount.increment();
        uint256 currentAlbumId = _albumCount.current();
        _albums[currentAlbumId] = Album(
            currentAlbumId,
            albumName,
            block.timestamp,
            AlbumStatus.Reserved,
            uri,
            0,
            0
        );
        _albumToArtistMapping[currentAlbumId] = _artists;
        emit AlbumEvent(
            currentAlbumId,
            albumName,
            block.timestamp,
            AlbumStatus.Reserved,
            uri,
            0,
            0,
            "Created Album"
        );
        return currentAlbumId;
    }

    function createSong(
        address musicContract,
        uint256 tokenId,
        uint256 albumId,
        uint256 artistId,
        uint256 price
    ) external onlyOwner nonReentrant {
        require(price > 0, "Item Price most be greater then 1 WEI");
        require(tokenId >= _songCount.current(), "invalid TokenId");
        require(albumId <= _albumCount.current(), "Invalid AlbumId");

        _songCount.increment();
        uint256 currentItemId = _songCount.current();
        Album storage _album = _albums[albumId];
        itemIdToSong[currentItemId] = Song(
            currentItemId,
            tokenId,
            musicContract,
            payable(address(0)),
            payable(msg.sender),
            price,
            albumId,
            _album.mintedSongs + 1,
            artistId,
            SongStatus.Active
        );
        _album.mintedSongs += 1;
        IERC721(musicContract).transferFrom(msg.sender, address(this), tokenId);
        emit SongEvent(
            currentItemId,
            tokenId,
            musicContract,
            address(0),
            msg.sender,
            price,
            albumId,
            artistId,
            _album.mintedSongs,
            SongStatus.Active,
            "Created MusicNFT"
        );
    }

    function BuySong(address musicContract, uint256 tokenId)
        public
        payable
        nonReentrant
        returns (Song memory)
    {
        Song memory item = getItemByTokenId(tokenId);
        require(
            item.status == SongStatus.Active,
            "Items That aint Listed cant be Solded"
        );
        require(msg.value >= item.price, "Insufficent funds");

        IERC721(musicContract).transferFrom(item.owner, msg.sender, tokenId);
        ownerToNftCount[item.owner]--;
        ownerToNftCount[msg.sender]++;
        _currentListings.decrement();
        item.owner.transfer(item.price);
        item.status = SongStatus.Sold;
        item.owner = payable(msg.sender);
        itemIdToSong[item.itemId] = item;

        emit SongEvent(
            item.itemId,
            tokenId,
            musicContract,
            msg.sender,
            item.owner,
            item.price,
            item.albumId,
            item.artistId,
            item.trackNumber,
            SongStatus.Sold,
            "Sold MusicNFT"
        );
        return itemIdToSong[item.itemId];
    }

    function createSongSale(address musicContract, uint256 itemId)
        public
        payable
        nonReentrant
        returns (Song memory)
    {
        Song memory currentToken = itemIdToSong[itemId];
        uint256 price = currentToken.price;
        uint256 tokenId = currentToken.tokenId;
        require(msg.value >= price, "kindly transfer the listed price");

        IERC721(musicContract).transferFrom(address(this), msg.sender, tokenId);
        ownerToNftCount[msg.sender]++;
        currentToken.status = SongStatus.Sold;
        currentToken.owner = payable(msg.sender);
        _musicMarketCount.increment();
        currentToken.seller.transfer(price);
        itemIdToSong[itemId] = currentToken;
        emit SongEvent(
            itemId,
            tokenId,
            musicContract,
            itemIdToSong[itemId].owner,
            itemIdToSong[itemId].seller,
            price,
            itemIdToSong[itemId].albumId,
            itemIdToSong[itemId].trackNumber,
            itemIdToSong[itemId].artistId,
            SongStatus.Sold,
            "Transferred MusicNFT"
        );
        return currentToken;
    }

    function listItem(
        address musicContract,
        uint256 itemId,
        uint256 price
    ) public payable {
        Song storage currentToken = itemIdToSong[itemId];
        uint256 tokenId = currentToken.tokenId;
        require(
            payable(msg.sender) == payable(currentToken.owner),
            "you must must be the owner"
        );
        require(
            currentToken.status != SongStatus.Active,
            "Cant list that is already Listed"
        );
        require(msg.value >= listingPrice, "kindly transfer the listed price");
        currentToken.price = price;
        currentToken.status = SongStatus.Active;
        _currentListings.increment();
        emit SongEvent(
            itemId,
            tokenId,
            musicContract,
            msg.sender,
            owner,
            price,
            currentToken.albumId,
            currentToken.trackNumber,
            currentToken.artistId,
            SongStatus.Active,
            "List MusicNFT"
        );
    }

    function CancelItem(address musicContract, uint256 itemId)
        public
        payable
        nonReentrant
    {
        Song storage currentToken = itemIdToSong[itemId];
        uint256 tokenId = currentToken.tokenId;
        require(
            payable(msg.sender) == payable(currentToken.owner),
            "you must must be the owner"
        );
        require(
            currentToken.status == SongStatus.Active,
            "Cant list that is already unListed"
        );
        currentToken.status = SongStatus.Sold;
        _currentListings.decrement();
        emit SongEvent(
            itemId,
            tokenId,
            musicContract,
            msg.sender,
            owner,
            currentToken.price,
            currentToken.albumId,
            currentToken.trackNumber,
            currentToken.artistId,
            SongStatus.Active,
            "List MusicNFT"
        );
    }

    function getItemByTokenId(uint256 tokenId)
        public
        view
        returns (Song memory item)
    {
        uint256 itemCount = _songCount.current();
        for (uint256 index = 0; index < itemCount; index++) {
            if (itemIdToSong[index + 1].tokenId == tokenId) {
                return itemIdToSong[index + 1];
            }
        }
        require(false, "Invalid Token ID");
    }

    function getAlbum(uint256 albumId)
        external
        view
        returns (Album memory _album, Artist[] memory _artists)
    {
        require(_albumCount.current() >= albumId, "Invalid Token ID");
        _album = _albums[albumId];
        _artists = new Artist[](_albumToArtistMapping[albumId].length);
        for (
            uint256 index = 0;
            index < _albumToArtistMapping[albumId].length;
            index++
        ) {
            _artists[index] = artists[_albumToArtistMapping[albumId][index]];
        }
    }

    function getLastMinted(uint256 limit) public view returns (Song[] memory) {
        uint256 itemCount = _songCount.current();
        uint256 unsoldItemCount = itemCount +
            _currentListings.current() -
            _musicMarketCount.current();
        uint256 currentIndex = 0;
        uint256 _min = Math.min(limit, unsoldItemCount);

        Song[] memory unsoldItem = new Song[](_min);

        for (uint256 index = itemCount; index > 0; index--) {
            if (currentIndex == _min) {
                break;
            }
            if (itemIdToSong[index].status == SongStatus.Active) {
                Song memory currentItem = itemIdToSong[index];
                unsoldItem[currentIndex] = currentItem;
                currentIndex++;
            }
        }
        return unsoldItem;
    }

    function getSongs(uint256 limit) public view returns (Song[] memory) {
        uint256 itemCount = _songCount.current();
        uint256 unsoldItemCount = itemCount +
            _currentListings.current() -
            _musicMarketCount.current();
        uint256 currentIndex = 0;
        uint256 _min = Math.min(limit, unsoldItemCount);
        Song[] memory unsoldItem = new Song[](_min);
        for (uint256 index = 0; index < itemCount; index++) {
            if (currentIndex == _min) {
                break;
            }
            if (itemIdToSong[index + 1].status == SongStatus.Active) {
                Song memory currentItem = itemIdToSong[index + 1];
                unsoldItem[currentIndex] = currentItem;
                currentIndex++;
            }
        }
        return unsoldItem;
    }

    function fetchMyMusicNFTs(uint256 limit)
        public
        view
        returns (Song[] memory)
    {
        uint256 _itemsCount = _songCount.current();
        uint256 musicOwned = ownerToNftCount[msg.sender];
        uint256 currentIndexOfMusicNFTFound = 0;
        if (musicOwned == 0) {
            return new Song[](0);
        }
        uint256 _min = Math.min(limit, musicOwned);
        Song[] memory myMusicNFTs = new Song[](_min);
        for (uint256 index = 0; index < _itemsCount; index++) {
            if (currentIndexOfMusicNFTFound == _min) {
                break;
            }
            if (itemIdToSong[index + 1].owner == msg.sender) {
                myMusicNFTs[currentIndexOfMusicNFTFound] = itemIdToSong[
                    index + 1
                ];
                currentIndexOfMusicNFTFound += 1;
            }
        }
        return myMusicNFTs;
    }
}
