const { BN, ether } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const EatHealthyChain = artifacts.require('./EatHealthyChain.sol');

contract('EatHealthyChain', function (accounts) {
  const owner = accounts[0];
  const proposer = accounts[1];
  const voter = accounts[2];
  const endVoteResponsible = '0x712EB6c16Ab3694b684B6c74B40A676c6d13621a';
  const product = {
    product_code: 1234567891234,
    labels: ['Bio', ' Label Rouge'],
    ingredients: ['Saucisson', 'Miel'],
    additifs: ['e310', 'e340'],
    nutriments: {
      carbohydrates: "10",
      energy: "270",
      energy_kcal: '100',
      fat: '5.3',
      fiber: '2.5',
      proteines: '5.9',
      salt: '0.2',
      saturated_fat: '0.9',
      sodium: '0.005',
      sugar: '0.1'
    },
    product_name: 'Saucisson au Miel',
    product_type: 'Charcuterie',
    quantity: 100,
    packaging: 'Plastique'
  };
  const opinion = true;

  const alternative_object = {
    productCode : 1234567891234,
    productCodeAlternative : 5555555555555,
    forVotes : 5,
    againstVotes:10,
    isVotedToday : true,
    propositionDate : 1585800857

  };
  beforeEach(async function () {
    this.EatHealthyChainInstance = await EatHealthyChain.new({from: owner});
  });
  it('vérifie que l\'utilisateur est inscrit', async function () {
    await this.EatHealthyChainInstance.subscribeUser({from: proposer});
    let addressToUser = await this.EatHealthyChainInstance.addressToUser.call(proposer);
    expect(Number(addressToUser.userId)).to.equal(Number(1));
    expect(Math.floor(Number(addressToUser.lastTimeTokenGiven)/10)).to.equal(Math.floor((Date.now() / 1000)/10));
    expect(Number(addressToUser.tokenNumber)).to.equal(5);
    expect(Number(addressToUser.reputation)).to.equal(50);
    expect(addressToUser.isExist).to.equal(true);
  });

  it('ajout d\'un produit en proposition', async function () {
    await this.EatHealthyChainInstance.subscribeUser({from: proposer});
    await this.EatHealthyChainInstance.addProductToProposal(
      product.product_code,
      product.labels,
      product.ingredients,
      product.additifs,
      product.nutriments,
      product.product_name,
      product.product_type,
      product.quantity,
      product.packaging,
      {from: proposer});

    let productCodeToProposalProduct = await this.EatHealthyChainInstance.productCodeToProposalProduct.call(product.product_code);
    expect(productCodeToProposalProduct.productProposerAddress).to.equal(proposer);
    expect(Number(productCodeToProposalProduct.forVotes)).to.equal(0);
    expect(Number(productCodeToProposalProduct.againstVotes)).to.equal(0);
    expect(Number(productCodeToProposalProduct.productId)).to.equal(0);
    expect(Number(productCodeToProposalProduct.isVotable)).to.equal(1);
    expect(Number(productCodeToProposalProduct.productCode)).to.equal(product.product_code);
    expect(Number(productCodeToProposalProduct.startDate)).to.equal(Math.floor((Date.now()/1000)));

    expect(Math.floor(Number(productCodeToProposalProduct.endDate))).to.equal(Math.floor((Date.now() / 1000) + 300));

    let productCodeToProposalHashes = await this.EatHealthyChainInstance.productCodeToProposalHashes.call(product.product_code);
    expect(productCodeToProposalHashes.ingredients_hash).to.equal('0x2325b874c5af142324c33a80aebebfeebe4c404e9ceaee31d19d7ca8d4a1b341');
    expect(productCodeToProposalHashes.labels_hash).to.equal('0xacb4243f15628d355e3d825861efc581f43066525c9761b85011d31eabe607cc');
    expect(productCodeToProposalHashes.additives_hash).to.equal('0xc9fece8da91a2eef2ba86f441b0547a83611d4c5038040702d570d656a334259');
    expect(productCodeToProposalHashes.nutriments_hash).to.equal('0x53fda2ecfc6c82a4adbe03deff6a46d06886c18c21a4c739e17768534cf6fed7');
    expect(productCodeToProposalHashes.variousData_hash).to.equal('0x313d48c867babce5993cb83886c24ed10a56e36f6220c1faec3daee5d2cb3676');
    expect(productCodeToProposalHashes.all_hash).to.equal('0xf14d9d8f34be764d3419d78a755472f21ee984e18c1c54f72ef549ecf7336334');

  });

  it('a voté pour un produit en cours de vote', async function () {
    await this.EatHealthyChainInstance.subscribeUser({from: proposer});
    await this.EatHealthyChainInstance.subscribeUser({from: voter});
    await this.EatHealthyChainInstance.addProductToProposal(
      product.product_code,
      product.labels,
      product.ingredients,
      product.additifs,
      product.nutriments,
      product.product_name,
      product.product_type,
      product.quantity,
      product.packaging,
      {from: proposer});

    let addressToUserBeforeVote = await this.EatHealthyChainInstance.addressToUser.call(voter);
    await this.EatHealthyChainInstance.vote(opinion, product.product_code, {from: voter});

    let addressToUserAfterVote = await this.EatHealthyChainInstance.addressToUser.call(voter);
    expect(Number(addressToUserAfterVote.tokenNumber)).to.equal(Number(addressToUserBeforeVote.tokenNumber) - 1);

    let alreadyVotedAfterVote = await this.EatHealthyChainInstance.alreadyVoted.call(product.product_code, 0, voter, 0);
    let alreadyVotedOpinionAfterVote = await this.EatHealthyChainInstance.alreadyVoted.call(product.product_code, 0, voter, 1);
    expect(Number(alreadyVotedAfterVote)).to.equal(1);
    expect(Number(alreadyVotedOpinionAfterVote)).to.equal(1);

    let productCodeToProposalProduct = await this.EatHealthyChainInstance.productCodeToProposalProduct.call(product.product_code);
    expect(Number(productCodeToProposalProduct.forVotes)).to.equal(1);


  });

  it('a mis fin à une session de vote', async function () {
    await this.EatHealthyChainInstance.subscribeUser({from: proposer});
    await this.EatHealthyChainInstance.subscribeUser({from: voter});
    await this.EatHealthyChainInstance.addProductToProposal(
      product.product_code,
      product.labels,
      product.ingredients,
      product.additifs,
      product.nutriments,
      product.product_name,
      product.product_type,
      product.quantity,
      product.packaging,
      {from: proposer});

    let addressToUserBeforeVote = await this.EatHealthyChainInstance.addressToUser.call(voter);

    await this.EatHealthyChainInstance.vote(opinion, product.product_code, {from: voter});

    let addressToUserAfterVote = await this.EatHealthyChainInstance.addressToUser.call(voter);
    expect(Number(addressToUserAfterVote.tokenNumber)).to.equal(Number(addressToUserBeforeVote.tokenNumber) - 1);

    let alreadyVotedAfterVote = await this.EatHealthyChainInstance.alreadyVoted.call(product.product_code, 0, voter, 0);
    let alreadyVotedOpinionAfterVote = await this.EatHealthyChainInstance.alreadyVoted.call(product.product_code, 0, voter, 1);
    expect(Number(alreadyVotedAfterVote)).to.equal(1);
    expect(Number(alreadyVotedOpinionAfterVote)).to.equal(1);

    let productCodeToProposalProduct = await this.EatHealthyChainInstance.productCodeToProposalProduct.call(product.product_code);
    expect(Number(productCodeToProposalProduct.forVotes)).to.equal(1);

    await this.EatHealthyChainInstance.endVote(product.product_code, {from: endVoteResponsible});
    let productCodeToProposalProductAfterEndVote = await this.EatHealthyChainInstance.productCodeToProposalProduct.call(product.product_code);
    expect(Number(productCodeToProposalProductAfterEndVote.productProposerAddress)).to.equal(0);

    let productCodeToProductAfterEndVote = await this.EatHealthyChainInstance.productCodeToProduct.call(product.product_code);
    expect(Number(productCodeToProductAfterEndVote.productCode)).to.equal(product.product_code);
    expect(productCodeToProductAfterEndVote.productProposerAddress).to.equal(proposer);
    expect(Number(productCodeToProductAfterEndVote.forVotes)).to.equal(1);
    expect(Number(productCodeToProductAfterEndVote.againstVotes)).to.equal(0);
    expect(Number(productCodeToProductAfterEndVote.productId)).to.equal(0);
    expect(Math.floor(Number(productCodeToProductAfterEndVote.startDate))).to.equal(Math.floor(Date.now() / 1000));
    expect(Math.floor(Number(productCodeToProductAfterEndVote.endDate))).to.equal(Math.floor((Date.now() / 1000) + 300));


  });

  it('ajout  d\'une alternative pour un produit (acceptation du responsable)', async function () {

    await this.EatHealthyChainInstance.subscribeUser({from: proposer});
    await this.EatHealthyChainInstance.addProductToProposal(
      product.product_code,
      product.labels,
      product.ingredients,
      product.additifs,
      product.nutriments,
      product.product_name,
      product.product_type,
      product.quantity,
      product.packaging,
      {from: proposer});
    await this.EatHealthyChainInstance.endVote(product.product_code, {from: endVoteResponsible});
    const alternatives = [alternative_object];
    await this.EatHealthyChainInstance.manageAlternatives(alternatives, {from: endVoteResponsible});

    let productCodeToProductAfterAlternatives = await this.EatHealthyChainInstance.productCodeToProduct.call(product.product_code);
    console.log(productCodeToProductAfterAlternatives);
   // expect(Number(productCodeToProductAfterAlternatives.alternatives[alternative_object.productCode].productCodeAlternative)).to.equal(alternative_object.productCode);



  });
});
