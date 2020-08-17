pragma solidity 0.5.16;

pragma experimental ABIEncoderV2;

contract EatHealthyChain {
  // Basic Product definition containing values about the product itself
  // but also about consensus
  struct Product {
    address productProposerAddress;
    uint16 forVotes;
    uint16 againstVotes;
    uint32 productId;
    uint64 productCode;
    uint startDate;
    uint endDate;
    //  bool isExist;
    bool isVotable;
  }

  struct Hashes {
    bytes32 ingredients_hash;
    bytes32 labels_hash;
    bytes32 nutriments_hash;
    bytes32 additives_hash;
    bytes32 variousData_hash;
    bytes32 all_hash;
  }

  // Basic Nutriment structure needed for the Product structure
  // A way to divide Product content
  struct Nutriment {
    string energy;
    string energy_kcal;
    string proteines;
    string carbohydrates;
    string salt;
    string sugar;
    string fat;
    string saturated_fat;
    string fiber;
    string sodium;
  }

  // Basic User structure with useful parameters.
  // In particular, token date, token number and reputation
  // needed for the consensus
  struct User {
    uint32 userId;
    uint lastTimeTokenGiven;
    int16 tokenNumber;
    int16 reputation;
    bool isExist;
    //  Role role;
  }

  address private _owner;

  uint32 private uniqueIdUser;

  uint32 private uniqueProductId;

  address internal endVoteResponsible;

  // Accessing to a User structure by his address
  mapping(address => User) public addressToUser;

  mapping(uint => mapping(uint => mapping(address => bool[2]))) public alreadyVoted;

  // Accessing to a Product in proposal phase by his code
  mapping(uint => Product) public productCodeToProposalProduct;

  mapping(uint => Hashes) public productCodeToProposalHashes;

  // Accessing to a Product adopted by his code
  mapping(uint => Product) public productCodeToProduct;

  mapping(uint => Hashes) public productCodeToHashes;

  // mapping(address => mapping(uint => Product)) addressToProducts;

  event TriggerAddProduct(bytes32[6] hashes, address proposerProduct, uint[2] voteDates);

  event TriggerVerifyCompliance(bytes32[6] hashes);

  constructor() public {
    _owner = msg.sender;
    endVoteResponsible = 0x712EB6c16Ab3694b684B6c74B40A676c6d13621a;
    addressToUser[_owner] = User(uniqueIdUser, now, 10, 0, true /*,  Role.ADMIN*/);
    uniqueIdUser++;
  }

  modifier checkLengthGS1 (uint productCode){
    require(productCode > 1111111111111, "Le code de produit n'a pas la bonne longueur !");
    _;
  }

  /**
@notice Product is added in proposal phase by the user,
        then visible for all users for votes
@dev
       Add a new Product and Nutriments object in corresponding proposal mappings
       Also added in corresponding arrays, useful to get them all from front-end
       Finally, emitting an event to warn the user, all is OK
@param _productCode, _productName, _labels, _ingredients, _quantity,
       _typeOfProduct, _packaging, _nutriments, _addiditfs
       => Elements needed to fill in both Product and Nutriments object
 */
  function addProductToProposal(
    uint64 _productCode,
    string[] memory _labels,
    string[] memory _ingredients,
    string[] memory _additifs,
    Nutriment memory _nutriments,
    string memory _productName,
    string memory _typeOfProduct,
    uint16 _quantity,
    string memory _packaging
  ) checkLengthGS1(_productCode) public {
    require(addressToUser[msg.sender].isExist == true, "Cet utilisateur n'existe pas");
    require(productCodeToProposalProduct[_productCode].productProposerAddress == address(0), "Ce produit est déjà proposé !");
    Product memory _product;
    Hashes memory _hashes;
    _product.productId = uniqueProductId;
    _product.productCode = _productCode;
    _product.productProposerAddress = msg.sender;
    _hashes.labels_hash = keccak256(abi.encode(_labels));
    _hashes.ingredients_hash = keccak256(abi.encode(_ingredients));
    _hashes.additives_hash = keccak256(abi.encode(_additifs));
    _hashes.nutriments_hash = keccak256(abi.encode(_nutriments));
    _hashes.variousData_hash = keccak256(abi.encodePacked(_productCode, _productName, _typeOfProduct, _quantity, _packaging));
    _hashes.all_hash = keccak256(abi.encodePacked(_hashes.labels_hash, _hashes.ingredients_hash, _hashes.additives_hash, _hashes.nutriments_hash, _hashes.variousData_hash));
    //  _product.isExist = true;
    _product.isVotable = true;
    _product.startDate = now;
    _product.endDate = now + 5 minutes;
    productCodeToProposalProduct[_productCode] = _product;
    // addressToProducts[msg.sender][_productCode] = _product;
    productCodeToProposalHashes[_productCode] = _hashes;
    uniqueProductId++;
    // addressToUser[msg.sender].tokenNumber--;
    emit TriggerAddProduct([_hashes.labels_hash, _hashes.ingredients_hash, _hashes.additives_hash, _hashes.nutriments_hash, _hashes.variousData_hash, _hashes.all_hash], msg.sender, [_product.startDate, _product.endDate]);
  }

  /**
  @notice User is voting for a product in proposal phase (new or update)
  @dev
         User can only vote if he is registered and he has not already voted
         Then adding vote to for and against
  @param _opinion vote value (for or against)
         _productCode product targeted for the vote
  */
  function vote(bool _opinion, uint _productCode) public {
    require(productCodeToProposalProduct[_productCode].productProposerAddress != msg.sender, "Vous ne pouvez pas voter pour votre propre proposition");
    require(addressToUser[msg.sender].tokenNumber > 0, "Vous n'avez pas assez de token");
    require(productCodeToProposalProduct[_productCode].isVotable, "Ce produit n'est pas en vote");
    require(productCodeToProposalProduct[_productCode].startDate < productCodeToProposalProduct[_productCode].endDate, "Le vote de ce produit est clos");
    require(alreadyVoted[_productCode][productCodeToProposalProduct[_productCode].productId][msg.sender][0] == false, "Vous avez déjà voté");
    alreadyVoted[_productCode][productCodeToProposalProduct[_productCode].productId][msg.sender][0] = true;
    if (_opinion == true) {
      productCodeToProposalProduct[_productCode].forVotes++;
    } else {
      productCodeToProposalProduct[_productCode].againstVotes++;
    }
    alreadyVoted[_productCode][productCodeToProposalProduct[_productCode].productId][msg.sender][1] = _opinion;
    addressToUser[msg.sender].tokenNumber--;
  }

  /**
  @notice User is voting for a product in proposal phase (new or update)
  @dev
         User can only vote if he is registered and he has not already voted
         Then adding vote to for and against
  @param proposerAddress proposer
         _productCode product targeted for the vote
*/
  function endVote(uint _productCode, address proposerAddress) public {
    require(msg.sender == endVoteResponsible, 'Vous ne pouvez pas mettre fin au vote !');
    require(productCodeToProposalProduct[_productCode].startDate < productCodeToProposalProduct[_productCode].endDate, "La fin du vote n'est pas depassée !");
    require(productCodeToProposalProduct[_productCode].isVotable, "Ce produit n'est pas NOUVEAU ni en MODIFICATION");
    require(productCodeToProposalProduct[_productCode].productProposerAddress != address(0), "Ce produit n'existe pas en proposition");
    if (productCodeToProposalProduct[_productCode].forVotes >= productCodeToProposalProduct[_productCode].againstVotes) {
      acceptedProduct(_productCode, proposerAddress);
    } else {
      refusedProduct(_productCode, proposerAddress);
    }
  }

  /*
  @notice Register a user when he does his first proposal or vote
  @dev
  Defines a new User object, giving him token and reputation
  Adds it to a mapping with all other subscribed users
  */
  function subscribeUser() public {
    require(addressToUser[msg.sender].isExist == false);
    User memory user;
    user.userId = uniqueIdUser;
    // user.role = Role.CUSTOMER;
    user.lastTimeTokenGiven = now;
    user.tokenNumber = 5;
    user.reputation = 50;
    user.isExist = true;
    uniqueIdUser++;
    addressToUser[msg.sender] = user;
  }

  function deleteProductFromProposal(uint _productCode, address proposerAddress) internal {
    delete productCodeToProposalProduct[_productCode];
    delete productCodeToProposalProduct[_productCode];
  }

  function refusedProduct(uint _productCode, address proposerAddress) internal {
    if (productCodeToProduct[_productCode].productProposerAddress != address(0)) {
      deleteProductFromProposal(_productCode, proposerAddress);
    } else {
      productCodeToProposalProduct[_productCode].isVotable = false;
      //  addressToProducts[proposerAddress][_productCode].isVotable = false;
    }

  }

  function acceptedProduct(uint _productCode, address proposerAddress) internal {
    productCodeToProposalProduct[_productCode].isVotable = false;
    //  addressToProducts[proposerAddress][_productCode].isVotable = false;
    productCodeToProduct[_productCode] = productCodeToProposalProduct[_productCode];
    productCodeToHashes[_productCode] = productCodeToProposalHashes[_productCode];
    deleteProductFromProposal(_productCode, proposerAddress);

  }

  /*function getProductHashes(uint _productCode) public view returns (bytes32[5] memory) {
    return [productCodeToProposalHashes[_productCode].labels_hash,
    productCodeToProposalHashes[_productCode].ingredients_hash,
    productCodeToProposalHashes[_productCode].additives_hash,
    productCodeToProposalHashes[_productCode].nutriments_hash,
    productCodeToProposalHashes[_productCode].variousData_hash
    ];
  }*/

  function verifyCompliance(
    uint64 _productCode,
    string[] memory _labels,
    string[] memory _ingredients,
    string[] memory _additifs,
    Nutriment memory _nutriments,
    string memory _productName,
    string memory _typeOfProduct,
    uint16 _quantity,
    string memory _packaging) public view returns (bytes32[6] memory) {
      bytes32 labels_hash =  keccak256(abi.encode(_labels));
      bytes32 ingredients_hash =  keccak256(abi.encode(_ingredients));
      bytes32 additives_hash =  keccak256(abi.encode(_additifs));
      bytes32 nutriments_hash =  keccak256(abi.encode(_nutriments));
      bytes32 variousDatas_hash = keccak256(abi.encodePacked(_productCode, _productName, _typeOfProduct, _quantity, _packaging));

      return [keccak256(abi.encodePacked(labels_hash, ingredients_hash, additives_hash, nutriments_hash, variousDatas_hash)),
      labels_hash,
      ingredients_hash,
      additives_hash,
      nutriments_hash,
      variousDatas_hash
    ];
  }

  function getProductHashes(uint _productCode) public view  returns (bytes32[6] memory){
    return [productCodeToHashes[_productCode].all_hash,
    productCodeToHashes[_productCode].labels_hash,
    productCodeToHashes[_productCode].ingredients_hash,
    productCodeToHashes[_productCode].additives_hash,
    productCodeToHashes[_productCode].nutriments_hash,
    productCodeToHashes[_productCode].variousData_hash
    ];
  }

  // To add a product in proposal, we need to check if the product doesn't already exist in mappings of products
  function checkProductIsNew(uint _productCode) public view checkLengthGS1(_productCode) returns (bool) {
    if (productCodeToProposalProduct[_productCode].productProposerAddress == address(0) && productCodeToProduct[_productCode].productProposerAddress == address(0)) {
      return true;
    } else {
      return false;
    }
  }

  function isProductProposer(uint _productCode) public view returns (bool) {
    return productCodeToProposalProduct[_productCode].productProposerAddress == msg.sender;
  }

  function isAlreadyVotedByCurrentUser(uint _productCode) public view returns (bool) {
    return alreadyVoted[_productCode][productCodeToProposalProduct[_productCode].productId][msg.sender][0] == true;
  }

  function getDates(uint _productCode) public view returns (uint, uint) {
    return (productCodeToProposalProduct[_productCode].startDate, productCodeToProposalProduct[_productCode].endDate);
  }

}
