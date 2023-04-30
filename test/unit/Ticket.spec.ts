import chai, { expect } from 'chai';
import { takeSnapshot, SnapshotRestorer } from '@nomicfoundation/hardhat-network-helpers';
import { MockContract, MockContractFactory, smock } from '@defi-wonderland/smock';
import { Ticket, Ticket__factory } from '@typechained';
import { ethers } from 'hardhat';

chai.use(smock.matchers);
// signer 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
// testWallet 0x28d2e5970b4DA0fA27DfFe2072984382cF594531
describe('Ticket', () => {
  let ticket: MockContract<Ticket>;
  let ticketFactory: MockContractFactory<Ticket__factory>;
  let snapshot: SnapshotRestorer;
  before(async () => {
    ticketFactory = await smock.mock<Ticket__factory>('Ticket');
    ticket = await ticketFactory.deploy('Ticket', 'CB', 'https://gateway.pinata.cloud/ipfs/QmYmu2yVPDyd6fDZ2GQnwE9s1g6BGL2K5XBzSpeHCoA2by/', 46);
    snapshot = await takeSnapshot();
  });
  // Do not restore blockchain
  // beforeEach(async () => {
  //   await snapshot.restore();
  // });

  describe('Functionality test', () => {
    it('should return correct symbol', async () => {
      await ticket.setVariable('baseUri', 'https://gateway.pinata.cloud/ipfs/QmYmu2yVPDyd6fDZ2GQnwE9s1g6BGL2K5XBzSpeHCoA2by/');
      console.log(await ticket.nftPrice());
      expect(await ticket.symbol()).to.equal('CB');
    });
    it('Should set the price', async () => {
      let ethersToWei = ethers.utils.parseUnits('0.001', 'ether');

      expect(await ticket.setPrice(ethersToWei)).to.emit(ticket, 'PriceSet');
    });
    it('Should buy an nft and mint it', async () => {
      await ticket.buyNft('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', { value: ethers.utils.parseEther('0.001') });
      expect(await ticket.balanceOf('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')).to.equal('1');
    });

    it('Should fail buying an nft and minting it', async () => {
      await ticket.buyNft('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', { value: ethers.utils.parseEther('0.001') });
      expect(await ticket.balanceOf('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')).to.equal('1');
    });

    it('Should pause the contract', async () => {
      expect(await ticket.pause()).to.emit(ticket, 'Paused');
    });
  });
  describe('Error test', () => {
    it('Should revert mint if paused', async () => {
      if (!(await ticket.paused())) await ticket.pause(); // Make sure is paused
      const [, testWallet] = await ethers.getSigners();
      await expect(ticket.connect(testWallet).buyNft(testWallet.address, { value: ethers.utils.parseEther('0.001') })).to.be.revertedWith(
        'Pausable: paused'
      );
    });
    it('Should revert transfer if paused', async () => {
      await expect(
        ticket.transferFrom('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', '0x28d2e5970b4DA0fA27DfFe2072984382cF594531', '0')
      ).to.be.revertedWith('Pausable: paused');
    });
  });
});
