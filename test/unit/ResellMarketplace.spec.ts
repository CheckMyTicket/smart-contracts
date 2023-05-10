import chai, { expect } from 'chai';
import { takeSnapshot, SnapshotRestorer } from '@nomicfoundation/hardhat-network-helpers';
import { MockContract, MockContractFactory, smock } from '@defi-wonderland/smock';
import { Ticket, Ticket__factory, ResellMarketplace, ResellMarketplace__factory } from '@typechained';
import { ethers } from 'hardhat';

chai.use(smock.matchers);
// signer 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
// testWallet 0x28d2e5970b4DA0fA27DfFe2072984382cF594531
describe('Resell Marketplace', () => {
  let resellMarketplace: MockContract<ResellMarketplace>;
  let resellMarketplaceFactory: MockContractFactory<ResellMarketplace__factory>;
  let ticket: MockContract<Ticket>;
  let ticketFactory: MockContractFactory<Ticket__factory>;
  let snapshot: SnapshotRestorer;
  before(async () => {
    ticketFactory = await smock.mock<Ticket__factory>('Ticket');
    ticket = await ticketFactory.deploy('Ticket', 'TT', '', 70000);
    let ethersToWei = ethers.utils.parseUnits('0.001', 'ether');
    await ticket.setPrice(ethersToWei);

    await ticket.mintTicket('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', { value: ethers.utils.parseEther('0.001') });

    resellMarketplaceFactory = await smock.mock<ResellMarketplace__factory>('ResellMarketplace');
    resellMarketplace = await resellMarketplaceFactory.deploy();
    resellMarketplace.initialize('000000000000000001', '0x2F5604A290FAF5Fc8100c5A569AdeDBE61823e30');
    snapshot = await takeSnapshot();
  });
  // Do not restore blockchain
  // beforeEach(async () => {
  //   await snapshot.restore();
  // });

  describe('Functionality test', () => {
    it('Should set the address of the ticket collection', async () => {
      expect(await resellMarketplace.addTicketContract(ticket.address))
        .to.emit(resellMarketplace, 'ContractAdded')
        .withArgs('0x2F5604A290FAF5Fc8100c5A569AdeDBE61823e30');
      expect(await resellMarketplace.contractIsAllowed(ticket.address)).to.be.true;
    });
    it('Should create an offer', async () => {
      let ethersToWei = ethers.utils.parseUnits('0.001', 'ether');

      expect(await resellMarketplace.createMarketOffer(ticket.address, 0, '100000', ethersToWei)).to.emit(resellMarketplace, 'ItemOfferCreated');
    });
    // it('Should buy an nft and mint it', async () => {
    //   await ticket.mintTicket('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', { value: ethers.utils.parseEther('0.001') });
    //   expect(await ticket.balanceOf('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')).to.equal('1');
    // });

    // it('Should fail buying an nft and minting it', async () => {
    //   await ticket.mintTicket('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', { value: ethers.utils.parseEther('0.001') });
    //   expect(await ticket.balanceOf('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')).to.equal('1');
    // });

    // it('Should pause the contract', async () => {
    //   expect(await ticket.pause()).to.emit(ticket, 'Paused');
    // });
  });
  // describe('Error test', () => {
  //   it('Should revert mint if paused', async () => {
  //     if (!(await ticket.paused())) await ticket.pause(); // Make sure is paused
  //     const [, testWallet] = await ethers.getSigners();
  //     await expect(ticket.connect(testWallet).mintTicket(testWallet.address, { value: ethers.utils.parseEther('0.001') })).to.be.revertedWith(
  //       'Pausable: paused'
  //     );
  //   });
  //   it('Should revert transfer if paused', async () => {
  //     await expect(
  //       ticket.transferFrom('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', '0x28d2e5970b4DA0fA27DfFe2072984382cF594531', '0')
  //     ).to.be.revertedWith('Pausable: paused');
  //   });
  // });
});
