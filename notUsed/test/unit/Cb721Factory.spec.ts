// import chai, { expect } from 'chai';
// import { takeSnapshot, SnapshotRestorer } from '@nomicfoundation/hardhat-network-helpers';
// import { MockContract, MockContractFactory, smock } from '@defi-wonderland/smock';
// import { Cb721Factory, Cb721Factory__factory } from '@typechained';

// chai.use(smock.matchers);

// describe('Cryptobadies Factory contract', () => {
//   let cb721Factory: MockContract<Cb721Factory>;
//   let cb721FactoryFactory: MockContractFactory<Cb721Factory__factory>;
//   let snapshot: SnapshotRestorer;

//   before(async () => {
//     cb721FactoryFactory = await smock.mock<Cb721Factory__factory>('Cb721Factory');
//     cb721Factory = await cb721FactoryFactory.deploy();
//     snapshot = await takeSnapshot();
//   });

//   beforeEach(async () => {
//     await snapshot.restore();
//   });

//   it('should emit deploy collection event', async () => {
//     //await cb721Factory.setVariable('baseUri', 'https://gateway.pinata.cloud/ipfs/QmYmu2yVPDyd6fDZ2GQnwE9s1g6BGL2K5XBzSpeHCoA2by/');

//     expect(
//       await cb721Factory.newCollection(
//         'Cb2',
//         'Cb2',
//         'https://gateway.pinata.cloud/ipfs/QmYmu2yVPDyd6fDZ2GQnwE9s1g6BGL2K5XBzSpeHCoA2by/',
//         46,
//         '0x28d2e5970b4DA0fA27DfFe2072984382cF594531'
//       )
//     ).to.emit(cb721Factory, 'DeployCollection');
//   });

//   //   it('should revert if greeting is empty', async () => {
//   //     await expect(greeter.setGreeting('')).to.be.revertedWithCustomError(greeter, 'EmptyGreeting');
//   //   });
// });
