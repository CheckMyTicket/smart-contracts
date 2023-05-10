// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import {Initializable} from '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';
import {OwnableUpgradeable} from '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import {SafeMathUpgradeable} from '@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol';
import {AggregatorV3Interface} from '@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol';
import {ReentrancyGuardUpgradeable} from '@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol';
import {CountersUpgradeable} from '@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol';
import {ERC1155Upgradeable} from '@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol';
import {ERC20Upgradeable} from '@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol';
import {ERC721Upgradeable} from '@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol';

/// TODO CHANGE CONTRACT FOR RESELL MARKETPLACE
/// TODO CHANGE CONTRACT FOR TICKET

/// @title NFT Marketplace
/// @author AboveZtars
/// @dev NFT Marketplace is inheriting from OwnableUpgradeable and OwnableUpgradeable is inheriting from Initializable, then NFTMarketplace is Initializable
contract ResellMarketplace is OwnableUpgradeable, ReentrancyGuardUpgradeable {
  uint256 public fee;
  address public recipient;

  using CountersUpgradeable for CountersUpgradeable.Counter;
  CountersUpgradeable.Counter private _offerIds; //Keep track of the offers in our market
  CountersUpgradeable.Counter private _offersEnded; // Keep track of the ended offers in our market

  ///VARIABLES

  ///@param offerId The Id of the offer in the marketplace
  ///@param nftContract The address of the nft token
  ///@param tokenId The Id of the nft token
  ///@param offerBegin The amount of nft token items to sell
  ///@param _deadline The time that will last the offer
  ///@param owner The owner of the nft token
  ///@param price The price of the offer in USD
  ///@param offerExist Boolean parameter to know when the offer exist
  struct MarketOffer {
    uint256 offerId;
    address ticketContract;
    uint256 tokenId;
    uint256 offerBegin;
    uint256 _deadline;
    address payable owner;
    uint256 price;
    bool offerExist;
  }
  ///@dev To track offers
  mapping(uint256 => MarketOffer) private _idToMarketOffer;
  mapping(address => bool) public contractIsAllowed;

  ///EVENTS
  event ItemOfferCreated(
    uint256 indexed offerId,
    address indexed ticketContract,
    uint256 indexed tokenId,
    uint256 offerBegin,
    uint256 _deadline,
    address payable owner,
    uint256 price
  );

  event OfferCanceled(bool offerExist);

  event OfferAccepted(bool offerExist, bool sent);

  event ContractAdded(address contractAddress);

  ///MODIFIERS
  ///@dev Ensure the seller owns NFT tokens
  modifier sellerOwned721(address _ticketContract, uint256 _tokenId) {
    require(ERC721Upgradeable(_ticketContract).balanceOf(msg.sender) > 0, 'Amount of tokens must be more than zero');
    _;
  }
  ///@dev Ensure the seller owns NFT tokens
  modifier isAllowed(address _ticketContract) {
    require(contractIsAllowed[_ticketContract] == true, 'This contract is not allowed in the marketplace');
    _;
  }

  /// @dev Set initial values for our contract
  function initialize(uint256 _fee, address _recipient) public initializer {
    __Ownable_init();
    fee = _fee;
    recipient = _recipient;
  }

  function addTicketContract(address _ticketContract) public onlyOwner {
    contractIsAllowed[_ticketContract] = true;
    emit ContractAdded(_ticketContract);
  }

  ///@notice Only the owner can set the fee
  ///@param _fee The fee to be set
  ///@dev Pass the fee from testing script
  function setFee(uint256 _fee) public onlyOwner {
    fee = _fee;
  }

  ///@notice Only the owner can set the recipient
  ///@param _recipient The recipient to be set
  ///@dev Pass the recipient from testing script
  function setRecipient(address _recipient) public onlyOwner {
    recipient = _recipient;
  }

  ///@notice Latest price of the market
  ///@param _pair The pair to calculate ETH, DAI or LINK tokens
  ///@dev Uses Chainlink oracle AggregatorV3Interface to get the price
  function getLatestPrice(address _pair) public view returns (int256) {
    AggregatorV3Interface priceFeed = AggregatorV3Interface(_pair);
    (, int256 price, , , ) = priceFeed.latestRoundData();
    return price;
  }

  /* Places an item for sale on the marketplace */
  ///@notice Create an offer
  ///@param _ticketContract The address of the nft token
  ///@param _tokenId The Id of the nft token
  ///@param _deadline The time that will last the offer
  ///@param _price The price of the offer in USD
  ///@dev The price in USD is worked in DAI tokens
  function createMarketOffer(
    address _ticketContract,
    uint256 _tokenId,
    uint256 _deadline,
    uint256 _price
  ) public payable nonReentrant sellerOwned721(_ticketContract, _tokenId) isAllowed(_ticketContract) {
    require(_price > 0, 'More than 0');
    _offerIds.increment();
    uint256 offerId = _offerIds.current();
    uint256 time = block.timestamp;
    uint256 deadlineTime = time + _deadline;

    _idToMarketOffer[offerId] = MarketOffer(
      offerId,
      _ticketContract,
      _tokenId,
      block.timestamp,
      deadlineTime,
      payable(msg.sender),
      _price,
      true
    );

    emit ItemOfferCreated(
      _idToMarketOffer[offerId].offerId,
      _idToMarketOffer[offerId].ticketContract,
      _idToMarketOffer[offerId].tokenId,
      _idToMarketOffer[offerId].offerBegin,
      _idToMarketOffer[offerId]._deadline,
      _idToMarketOffer[offerId].owner,
      _idToMarketOffer[offerId].price
    );
  }

  ///@notice Cancel an offer
  ///@param _offerId The Id of the offer
  function cancelOffer(uint256 _offerId) public {
    require(_idToMarketOffer[_offerId].owner == msg.sender, 'The offer does not exist');
    require(_idToMarketOffer[_offerId].offerExist, 'The offer does not exist');

    _idToMarketOffer[_offerId].offerExist = false;
    emit OfferCanceled(_idToMarketOffer[_offerId].offerExist);
  }

  ///@notice Accept an offer and pay for it
  ///@param _offerId The Id of the offer
  ///@param _token The token to pay
  function acceptOffer(uint256 _offerId, string memory _token) public payable nonReentrant {
    //Initial requirements
    require(_idToMarketOffer[_offerId].offerExist, 'The offer does not exist');

    address _ticketContract = _idToMarketOffer[_offerId].ticketContract;
    uint256 _tokenId = _idToMarketOffer[_offerId].tokenId;
    //uint256 balanceOfTokens = ERC721Upgradeable(_ticketContract).balanceOf(_idToMarketOffer[_offerId].owner);
    address payable owner = _idToMarketOffer[_offerId].owner;

    if (_idToMarketOffer[_offerId]._deadline < block.timestamp) {
      _idToMarketOffer[_offerId].offerExist = false;
      revert('The offer is not available');
    }

    //ETHEREUM
    if (keccak256(abi.encodePacked((_token))) == keccak256(abi.encodePacked(('ETH')))) {
      uint256 offerPriceInETH = getPriceInETH(_offerId);
      //Implement fee
      uint256 price = offerPriceInETH;
      uint256 feePrice = SafeMathUpgradeable.div(SafeMathUpgradeable.mul(offerPriceInETH, fee), 100);
      uint256 priceAfterFee = SafeMathUpgradeable.sub(price, feePrice);
      sendFeeETH(feePrice);

      (bool sent, ) = owner.call{value: priceAfterFee}('');
      require(sent, 'Failed transfer');
      ERC721Upgradeable(_ticketContract).safeTransferFrom(owner, msg.sender, _tokenId);

      ///@dev Return leftovers of ETH
      (bool success, ) = msg.sender.call{value: address(this).balance}('');
      require(success, 'refund failed');
      _idToMarketOffer[_offerId].offerExist = false;
      emit OfferAccepted(_idToMarketOffer[_offerId].offerExist, sent);
    }
  }

  ///@notice Get price of the offer in ETH
  ///@dev Notice the units
  function getPriceInETH(uint256 _offerId) public view returns (uint256) {
    address daiEth = 0x773616E4d11A78F511299002da57A0a94577F1f4;
    uint256 ethPrice = uint256(getLatestPrice(daiEth));
    uint256 offerPriceInETH = SafeMathUpgradeable.mul(_idToMarketOffer[_offerId].price, ethPrice);
    return offerPriceInETH;
  }

  ///@notice Using this function will send ETH to the recipient
  ///@param _fee The cost of the fee
  function sendFeeETH(uint256 _fee) public payable {
    // Call returns a boolean value indicating success or failure.
    // This is the current recommended method to use.
    // account[1] of Hardhat node

    (bool sent, ) = recipient.call{value: _fee}('');
    require(sent, 'Fee transaction failed');
  }

  ///@dev To receive ETH
  receive() external payable {}
}
