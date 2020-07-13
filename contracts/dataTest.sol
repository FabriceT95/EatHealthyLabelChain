pragma solidity 0.5.16;

pragma experimental ABIEncoderV2;




/**
 @title DataLabelChain contract
 @author Fabrice Tapia
 @dev Contract which is a part of the Alyra's Final Project : Eat Healthy LabelChain
 */

contract DataTest {

  // Option : define roles depending on the user status
  enum Role {CUSTOMER, SELLER, ADMIN}

  // Basic User structure with useful parameters.
  // In particular, token date, token number and reputation
  // needed for the consensus
  struct User{
    uint userId;
    Role role;
    uint lastTimeTokenGiven;
    int tokenNumber;
    int reputation;
    bool isExist;
  }

  // Basic Product definition containing values about the product itself
  // but also about consensus
  struct Product{
    uint productId;
    uint productCode;
    string productName;
    address productProposerAddress;
    string[] labels;
    uint nutrimentsId;
    string[] ingredients;
    string[] additifs;
    uint quantity;
    string typeOfProduct;
    string[] packaging;
    uint totalVotes;
    uint forVotes;
    uint againstVotes;
    // mapping(address => bool) alreadyVoted;
    // address[] alreadyVoted;
    uint[2] created_n_last_modif;
    //  bytes32 hash;
    bool isValidated;
    bool isExist;
  }

  mapping(uint => mapping(address => bool)) public alreadyVoted;

  // Basic Nutriment structure needed for the Product structure
  // A way to divide Product content
  struct Nutriments {
    string energy;
    string energy_kcal;
    string proteines;
    string carbohydrates;
    string salt;
    string sugars;
    string fat;
    string saturated_fat;
    string fiber;
    string sodium;
  }

  address private _owner;

  // Integer needed for the implicit user registration
  // for the first time he proposed a product
  uint uniqueIdUser;

  uint uniqueProductId;

  // Getter of all products in proposal phase
  Product[] ProposalProducts;

  // Getter of all nutriments products in proposal phase
  Nutriments[] ProposalNutriments;

  // Accessing to a User structure by his address
  mapping(address => User) public addressToUser;

  // Accessing to a Product in proposal phase by his code
  mapping(uint => Product) public productCodeToProposalProduct;

  // Accessing to a Product adopted by his code
  mapping(uint => Product) public productCodeToProduct;

  // Accessing to Nutriments of a Product adopted by his code
  mapping(uint => Nutriments) public productCodeToNutriments;

  // Simple event when a product is added to the product proposal phase
  event TriggerAddProduct(uint indexed idProduct);

  // Setting up the owner as a user (may not be needed)
  constructor() public {
    _owner = msg.sender;
    addressToUser[_owner] = User(uniqueIdUser, Role.ADMIN, now, 10, 0,true);
    uniqueIdUser++;
  }

//  modifier checkProductIsNew (uint productCode) {
//    require(!productCodeToProduct[productCode].isExist);
//    _;
//  }
//
//
//  modifier checkProductProposalIsNew (uint productCode) {
//    require(!productCodeToProduct[productCode].isExist);
//    _;
//  }

  modifier checkLengthGS1 (uint productCode){
    require(productCode > 1111111111111);
    _;
  }
/*
  function getProduct(uint productCode) view public returns(Product){
    return productCodeToProduct[productCode];
  }*/


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
    uint _productCode,
    string memory _productName,
    string[] memory _labels,
    string[] memory _ingredients,
    uint _quantity,
    string memory _typeOfProduct,
    string[] memory _packaging,
    Nutriments memory _nutriments,
    string[] memory _additifs

  ) public {
    require(!productCodeToProduct[_productCode].isExist);
    Product memory _product;
    Nutriments memory _nutrimentsObject;
    _product.productId = uniqueProductId;
    _product.productCode = _productCode;
    _product.productName = _productName;
    _product.productProposerAddress = msg.sender;
    _product.labels = _labels;
    _product.ingredients = _ingredients;
    _product.additifs = _additifs;
    _product.quantity = _quantity;
    _product.typeOfProduct = _typeOfProduct;
    _product.packaging = _packaging;
    //_product.isValidated = false;
    _product.isExist = true;
    _product.created_n_last_modif = [now, now];
    _product.nutrimentsId = _productCode;
    _product.forVotes = 0;
    _product.againstVotes = 0;
    _product.totalVotes = 0;
    // productCodeToNutriments[_productCode] = _nutriments;
   // _product.hash = keccak256(abi.encodePacked(_product.productName,_product.productProposerAddress, _product.quantity));
    productCodeToProposalProduct[_productCode] = _product;
    ProposalProducts.push(_product);

    _nutrimentsObject.carbohydrates = _nutriments.carbohydrates;
    _nutrimentsObject.energy = _nutriments.energy;
    _nutrimentsObject.energy_kcal = _nutriments.energy_kcal;
    _nutrimentsObject.proteines = _nutriments.proteines;
    _nutrimentsObject.salt = _nutriments.salt;
    _nutrimentsObject.sugars = _nutriments.sugars;
    _nutrimentsObject.fat = _nutriments.fat;
    _nutrimentsObject.saturated_fat = _nutriments.saturated_fat;
    _nutrimentsObject.fiber = _nutriments.fat;
    _nutrimentsObject.sodium = _nutriments.sodium;
    productCodeToNutriments[_productCode] = _nutrimentsObject;
    ProposalNutriments.push(_nutrimentsObject);

    uniqueProductId++;

    emit TriggerAddProduct(_productCode);
    // keccak256(abi.encodePacked(_productCode,_productName,msg.sender,_labels,_ingredients,_nutriments,_quantity,_typeOfProduct,_packaging))
  }

  // Getting actual user role at the start or when wallet is changed (may not be needed)
  function getRole() public view returns (Role) {
    return addressToUser[msg.sender].role;
  }


  // To add a product in proposal, we need to check if the product doesn't already exist in mappings of products
  function checkProductIsNew (uint _productCode) public view checkLengthGS1(_productCode) returns (bool) {
    if(!productCodeToProposalProduct[_productCode].isExist && !productCodeToProduct[_productCode].isExist){
      return true;
    }else{
      return false;
    }
  }


  /**
@notice Register a user when he does his first proposal or vote
@dev
       Defines a new User object, giving him token and reputation
       Adds it to a mapping with all other subscribed users
 */
  function subscribeUser() public returns (User memory) {
    require(addressToUser[msg.sender].isExist == false);
    User memory user;
    user.userId = uniqueIdUser;
    user.role = Role.CUSTOMER;
    user.lastTimeTokenGiven = now;
    user.tokenNumber = 5;
    user.reputation = 50;
    user.isExist = true;
    uniqueIdUser++;
    addressToUser[msg.sender] = user;
    return user;
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
    require(addressToUser[msg.sender].tokenNumber > 0);
    // require(productCodeToProduct[_productCode].isExist && addressToUser[msg.sender].isExist && !alreadyVoted[_productCode][msg.sender] && productCodeToProduct[_productCode].productProposerAddress != msg.sender);
    alreadyVoted[_productCode][msg.sender] = true;
    if(_opinion == true){
      productCodeToProposalProduct[_productCode].forVotes++;
      ProposalProducts[productCodeToProposalProduct[_productCode].productId].forVotes++;
    }else{
      productCodeToProposalProduct[_productCode].againstVotes++;
      ProposalProducts[productCodeToProposalProduct[_productCode].productId].againstVotes++;
    }
    productCodeToProposalProduct[_productCode].totalVotes++;
    ProposalProducts[productCodeToProposalProduct[_productCode].productId].totalVotes++;
    addressToUser[msg.sender].tokenNumber--;
  }

  function getProductsVoting() public view returns(Product[] memory, Nutriments[] memory){
    return (ProposalProducts, ProposalNutriments);
  }

  function isAlreadyVotedByCurrentUser(uint _productCode) public view returns (bool){
    return alreadyVoted[_productCode][msg.sender];
  }

  function isProposer(uint _productCode) public view returns (bool){
    return productCodeToProposalProduct[_productCode].productProposerAddress == msg.sender;
  }

}
