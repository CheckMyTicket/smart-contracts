// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import {ERC721} from '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import {Pausable} from '@openzeppelin/contracts/security/Pausable.sol';
import {Ownable} from '@openzeppelin/contracts/access/Ownable.sol';
import {Counters} from '@openzeppelin/contracts/utils/Counters.sol';
import {ReentrancyGuard} from '@openzeppelin/contracts/security/ReentrancyGuard.sol';

/// TODO CHANGE CONTRACT FOR RESELL MARKETPLACE
/// TODO CHANGE CONTRACT FOR TICKET

contract Ticket is ERC721, Pausable, Ownable, ReentrancyGuard {
  using Counters for Counters.Counter;

  string public baseUri;
  uint256 public totalSupply;
  uint256 public nftPrice;
  Counters.Counter private _tokenIdCounter;
  event PriceSet(uint256 price);

  constructor(string memory name, string memory symbol, string memory _baseUri, uint8 _totalSupply) ERC721(name, symbol) {
    totalSupply = _totalSupply; //Set total supply at blockchain
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

  function safeMint(address to) internal {
    uint256 tokenId = _tokenIdCounter.current();
    _tokenIdCounter.increment();
    _safeMint(to, tokenId);
  }

  function setPrice(uint256 _price) public onlyOwner {
    nftPrice = _price;
    emit PriceSet(nftPrice);
  }

  function buyNft(address _to) public payable nonReentrant {
    require(_tokenIdCounter.current() <= totalSupply, 'All nfts of contract were minted'); //Limit of 46 nfts per collection
    require(nftPrice != 0, 'A price has not been set yet'); //Add to modifier
    safeMint(_to);
  }
}
