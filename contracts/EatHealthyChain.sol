pragma solidity 0.5.16;

pragma experimental ABIEncoderV2;

contract EatHealthyChain {

  // Basic Alternative definition
  // It sets for and against votes for a product code alternative to the product code defined
  struct Alternative {
    uint64 productCode;
    uint64 productCodeAlternative;
    uint16 forVotes;
    uint16 againstVotes;
    bool isVotedToday;
    uint propositionDate;
  }

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
    bool isVotable;
    string hash_IPFS;
    mapping(uint => Alternative) alternatives;
  }

  // Hashes structure
  // Contains all hashes for a given product code / Can't store unhashed data
  struct Hashes {
    bytes32 ingredients_hash;
    bytes32 labels_hash;
    bytes32 nutriments_hash;
    bytes32 additives_hash;
    bytes32 variousData_hash;
    bytes32 all_hash;
  }

  // Label structure
  // Supposed to be real labels given by growers
  struct Label {
    uint id;
    uint expiration_date;
    string label_name;
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
    int16 tokenNumber;
    int16 reputation;
    uint32 userId;
    uint lastTimeTokenGiven;
    bool isExist;
  }

  // Contract deployer
  address private _owner;

  // Default user id increasing each time a user subscribes
  uint32 private uniqueIdUser;

  // Default product id increasing each time a product is proposed/modified
  uint32 private uniqueProductId;

  // Default product id increasing each time we add a product code with real labels
  uint32 private uniqueRealLabelId;

  // Accessing to a User structure by his address
  mapping(address => User) public addressToUser;

  // Describing users who has already voted for a proposed product(
  mapping(uint => mapping(uint => mapping(address => bool[2]))) public alreadyVoted;

  // Accessing to a Product in proposal phase by his code
  mapping(uint => Product) public productCodeToProposalProduct;

  // Accessing to Hashes product in proposal phase by his code
  mapping(uint => Hashes) public productCodeToProposalHashes;

  // Accessing to a Product adopted by his code
  mapping(uint => Product) public productCodeToProduct;

  // Accessing to Hashes product adopted by product code
  mapping(uint => Hashes) public productCodeToHashes;

  // Accessing to real labels defined by growers (they are actually fake in this contract)
  mapping(uint => Label[]) public productCodeToRealLabels;

  // Accessing to the image IPFS given by user for a product
  mapping(uint => string) public productCodeToHashIPFS;

  // mapping(address => mapping(uint => Product)) addressToProducts;
  uint[] private trueLabelizedProductCode;

  // Event triggering product hashes, product proposer address and start/end vote dates when a new product is proposed
  event TriggerAddProduct(bytes32[6] hashes, address proposerProduct, uint[2] voteDates);

  // Constructor setting the owner, the vote closer and alternatives setup
  // Owner is automatically set as user
  constructor() public {
    _owner = msg.sender;
    addressToUser[_owner] = User(10, 0, uniqueIdUser, now, true);
    uniqueIdUser++;
    setupRealLabels();
  }

  // Checks the code length, which has to be a length of 13 numbers
  modifier checkLengthGS1 (uint _productCode){
    require(_productCode > 1111111111111, "Le code de produit n'a pas la bonne longueur !");
    _;
  }

  // Checks if the user calling a function exists
  modifier onlyUsers () {
    require(addressToUser[msg.sender].isExist == true, "Cet utilisateur n'existe pas");
    _;
  }

  // Checks if the user calling a function exists
  modifier isNotProposed (uint _productCode) {
    require(productCodeToProposalProduct[_productCode].productProposerAddress == address(0), "Ce produit est déjà proposé !");
    _;
  }

  // Checks if the user is the responsible for ending a vote or set alternatives
  modifier isResponsible() {
    require(msg.sender == _owner, 'Vous n\'êtes pas le responsable');
    _;
  }

  // Checks if the product is votable
  modifier isProductVotable(uint _productCode) {
    require(productCodeToProposalProduct[_productCode].isVotable, "Ce produit n'est pas en vote");
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
    uint16 _quantity,
    string[] memory _labels,
    string[] memory _ingredients,
    string[] memory _additives,
    Nutriment memory _nutriments,
    string memory _productName,
    string memory _typeOfProduct,
    string memory _packaging,
    string memory _hash_ipfs
  ) checkLengthGS1(_productCode) onlyUsers() isNotProposed(_productCode) public {
    //  Product memory _product;
    Hashes memory _hashes;
    //    _product.productId = uniqueProductId;
    //    _product.productCode = _productCode;
    //    _product.productProposerAddress = msg.sender;
    //    _product.isVotable = true;
    //    _product.startDate = now;
    //    _product.endDate = now + 5 minutes;
    _hashes.labels_hash = keccak256(abi.encode(_labels));
    _hashes.ingredients_hash = keccak256(abi.encode(_ingredients));
    _hashes.additives_hash = keccak256(abi.encode(_additives));
    _hashes.nutriments_hash = keccak256(abi.encode(_nutriments));
    _hashes.variousData_hash = keccak256(abi.encodePacked(_productCode, _productName, _typeOfProduct, _quantity, _packaging, _hash_ipfs));
    _hashes.all_hash = keccak256(abi.encodePacked(_hashes.labels_hash, _hashes.ingredients_hash, _hashes.additives_hash, _hashes.nutriments_hash, _hashes.variousData_hash));
    productCodeToProposalProduct[_productCode] = Product(msg.sender, 0, 0, uniqueProductId, _productCode, now, now + 5 minutes, true, _hash_ipfs);
    productCodeToProposalHashes[_productCode] = _hashes;
    uniqueProductId++;
    // addressToUser[msg.sender].tokenNumber--;
    emit TriggerAddProduct([_hashes.labels_hash, _hashes.ingredients_hash, _hashes.additives_hash, _hashes.nutriments_hash, _hashes.variousData_hash, _hashes.all_hash], msg.sender, [now, now + 5 minutes]);
  }

  /**
  @notice User is voting for a product in proposal phase (new or update)
  @dev
         User can only vote if he is registered and he has not already voted
         Then adding vote to for and against
  @param _opinion vote value (for or against)
         _productCode product targeted for the vote
  */
  function vote(bool _opinion, uint _productCode) isProductVotable(_productCode) public {
    require(productCodeToProposalProduct[_productCode].productProposerAddress != msg.sender, "Vous ne pouvez pas voter pour votre propre proposition");
    require(addressToUser[msg.sender].tokenNumber > 0, "Vous n'avez pas assez de token");
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
  @param _productCode product targeted for the vote
*/
  function endVote(uint _productCode) isResponsible() isProductVotable(_productCode) public {
    require(productCodeToProposalProduct[_productCode].productProposerAddress != address(0), "Ce produit n'existe pas en proposition");
    if (productCodeToProposalProduct[_productCode].forVotes >= productCodeToProposalProduct[_productCode].againstVotes) {
      acceptedProduct(_productCode);
    } else {
      refusedProduct(_productCode);
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
    user.lastTimeTokenGiven = now;
    user.tokenNumber = 5;
    user.reputation = 50;
    user.isExist = true;
    uniqueIdUser++;
    addressToUser[msg.sender] = user;
  }

  /*
  @notice Delete a product from proposal product, no more available anywhere
  @dev
  Deletes the proposed product corresponding the product code in argument
  But also its corresponding hashes
  @params _productCode product code which needs to be deleted from the proposal
  */
  function deleteProductFromProposal(uint _productCode) internal {
    delete productCodeToProposalProduct[_productCode];
    delete productCodeToProposalHashes[_productCode];
  }

  /*
  @notice Deletes a product from proposal product, no more available anywhere
  @dev
  Deletes the proposed product corresponding the product code in argument
  But also its corresponding hashes
  @params _productCode product code which needs to be deleted from the proposal
  */
  function refusedProduct(uint _productCode) internal {
    if (productCodeToProduct[_productCode].productProposerAddress != address(0)) {
      deleteProductFromProposal(_productCode);
    } else {
      productCodeToProposalProduct[_productCode].isVotable = false;
    }
  }

  /*
  @notice Accepts the product voted by the community
  @dev
  Accepts the proposed product corresponding the product code in argument
  But also its corresponding hashes
  Deletes it from proposal because it no more exists as proposed
  @params _productCode product code which needs to be accepted from the proposal
  */
  function acceptedProduct(uint _productCode) internal {
    productCodeToProposalProduct[_productCode].isVotable = false;
    productCodeToProduct[_productCode] = productCodeToProposalProduct[_productCode];
    productCodeToHashes[_productCode] = productCodeToProposalHashes[_productCode];
    deleteProductFromProposal(_productCode);

  }


  /*
  @notice Setting up new alternatives into the contract
  @dev
  Takes a list of Alternative coming from and adding them all into the alternative mapping in accepted products structure
  Sets up votes and expiration date to the alternative
  @params _alternativeVotes list of Alternatives object
  */
  function manageAlternatives(Alternative[] memory _alternativeVotes) isResponsible() public {
    for (uint i = 0; i < _alternativeVotes.length; i++) {
      productCodeToProduct[_alternativeVotes[i].productCode].alternatives[_alternativeVotes[i].productCodeAlternative] = _alternativeVotes[i];
    }
  }

  /*
  @notice Simply returns hashes of each group of data (labels, ingredients, additives, nutriments and other various datas).
          Really useful with our app !
  @dev
  Takes all datas needed to build the product object (in the addProductToProposal methods) and hashing them.
  @params _productCode, _productName, _labels, _ingredients, _quantity,
         _typeOfProduct, _packaging, _nutriments, _additives
         => Elements used to build hashes during the addProductToProposal methods
  @returns hash build in the method
  */
  function verifyCompliance(
    uint64 _productCode,
    string[] memory _labels,
    string[] memory _ingredients,
    string[] memory _additives,
    Nutriment memory _nutriments,
    string memory _productName,
    string memory _typeOfProduct,
    uint16 _quantity,
    string memory _packaging,
    string memory _hash_ipfs) public pure returns (bytes32[6] memory) {
    bytes32 labels_hash = keccak256(abi.encode(_labels));
    bytes32 ingredients_hash = keccak256(abi.encode(_ingredients));
    bytes32 additives_hash = keccak256(abi.encode(_additives));
    bytes32 nutriments_hash = keccak256(abi.encode(_nutriments));
    bytes32 variousDatas_hash = keccak256(abi.encodePacked(_productCode, _productName, _typeOfProduct, _quantity, _packaging, _hash_ipfs));

    return [keccak256(abi.encodePacked(labels_hash, ingredients_hash, additives_hash, nutriments_hash, variousDatas_hash)),
    labels_hash,
    ingredients_hash,
    additives_hash,
    nutriments_hash,
    variousDatas_hash
    ];
  }

  /*
  @notice Simply returns hashes of an accepted product by code. Really useful with our app !
  @dev
  Checks into hashes mapping of accepted mapping and returning each hashes
  @params _productCode product code hashes which needs to be returned
  @returns hashes of the product code given
  */
  function getProductHashes(uint _productCode) public view returns (bytes32[6] memory){
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

  // Returning a boolean, checking if user is product proposer
  function isProductProposer(uint _productCode) public view returns (bool) {
    return productCodeToProposalProduct[_productCode].productProposerAddress == msg.sender;
  }

  // Returning a boolean, checking if user is product proposer
  function isAlreadyVotedByCurrentUser(uint _productCode) public view returns (bool) {
    return alreadyVoted[_productCode][productCodeToProposalProduct[_productCode].productId][msg.sender][0] == true;
  }

  // Returning start and end dates of a vote
  function getDates(uint _productCode) public view returns (uint, uint) {
    return (productCodeToProposalProduct[_productCode].startDate, productCodeToProposalProduct[_productCode].endDate);
  }

  /*
  @notice setting up fake "real" labels for demo purpose. For example : label called 'Campagne' expire in 10 days
  @dev
  Simply add objects into mapping
  */
  function setupRealLabels() internal {
    productCodeToRealLabels[1234567891234].push(Label(uniqueRealLabelId, now + 10 days, 'Label Rouge'));
    productCodeToRealLabels[1234567891234].push(Label(uniqueRealLabelId, now + 10 days, 'AOC'));
    trueLabelizedProductCode.push(1234567891234);
    uniqueRealLabelId++;
    productCodeToRealLabels[5555555555555].push(Label(uniqueRealLabelId, now + 8 days, ''));
    productCodeToRealLabels[5555555555555].push(Label(uniqueRealLabelId, now + 8 days, ''));
    trueLabelizedProductCode.push(5555555555555);
    uniqueRealLabelId++;
  }
}
