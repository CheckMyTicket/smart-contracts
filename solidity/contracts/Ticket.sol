// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import {ERC721} from '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import {Pausable} from '@openzeppelin/contracts/security/Pausable.sol';
import {Ownable} from '@openzeppelin/contracts/access/Ownable.sol';
import {Counters} from '@openzeppelin/contracts/utils/Counters.sol';
import {ReentrancyGuard} from '@openzeppelin/contracts/security/ReentrancyGuard.sol';

/// TODO CHANGE CONTRACT FOR RESELL MARKETPLACE
/// TODO CHANGE CONTRACT FOR TICKET
/// ERC1155 allows to create more complex tickets

contract Ticket is ERC721, Pausable, Ownable, ReentrancyGuard {
  using Counters for Counters.Counter;

  string public baseUri;
  uint256 public totalSupply;
  uint256 public ticketPrice;
  Counters.Counter private _tokenIdCounter;
  event PriceSet(uint256 price);

  constructor(string memory name, string memory symbol, string memory _baseUri, uint8 _totalSupply) ERC721(name, symbol) {
    totalSupply = _totalSupply; //Set total supply
    baseUri = _baseUri;
  }

  function _baseURI() internal view override returns (string memory) {
    return baseUri;
  }

  function pause() public onlyOwner {
    _pause();
  }

  function unpause() public onlyOwner {
    _unpause();
  }

  function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal override whenNotPaused {
    super._beforeTokenTransfer(from, to, tokenId);
  }

  function _mint(address to) internal {
    uint256 tokenId = _tokenIdCounter.current();
    _tokenIdCounter.increment();
    _safeMint(to, tokenId);
  }

  function setPrice(uint256 _price) public onlyOwner {
    nftPrice = _price;
    emit PriceSet(nftPrice);
  }

  function mintTicket(address _to) public payable nonReentrant {
    require(_tokenIdCounter.current() <= totalSupply, 'All tickets of contract were minted');
    require(ticketPrice != 0, 'A price has not been set yet');
    require(ticketPrice <= msg.value, 'Ether value is not correct');
    _mint(_to);
    //Return leftovers
    if (msg.value > ticketPrice) {
      uint256 ethLeftovers = msg.value - ticketPrice;
      (bool success, ) = msg.sender.call{value: ethLeftovers}('');
      require(success, 'refund failed');
    }
  }

  function withdraw() public onlyOwner {
    uint balance = address(this).balance;
    msg.sender.transfer(balance);
  }
}
