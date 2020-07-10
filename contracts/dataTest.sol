pragma solidity 0.5.16;
pragma experimental ABIEncoderV2;



/**
 @title DataLabelChain contract
 @author Fabrice Tapia
 @dev Contract which is a part of the Alyra's Final Project : Eat Healthy LabelChain
 */

contract DataTest {

  enum Role {CUSTOMER, SELLER, ADMIN}
  struct User{
    uint userId;
    Role role;
    uint lastTimeTokenGiven;
    int tokenNumber;
    int reputation;
    bool isExist;
  }


  struct Product{
    // uint productId;
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
    uint[2] created_n_last_modif;
    //  bytes32 hash;
    bool isValidated;
    bool isExist;
  }

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

  uint uniqueIdUser;

  Product[] ProposalProducts;

  Nutriments[] ProposalNutriments;

  mapping(address => User) public addressToUser;

  mapping(uint => Product) public productCodeToProposalProduct;

  mapping(uint => Product) public productCodeToProduct;

  mapping(uint => Nutriments) public productCodeToNutriments;

  event TriggerAddProduct(uint indexed idProduct);

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
    _product.productCode = _productCode;
    _product.productName = _productName;
    _product.productProposerAddress = msg.sender;
    _product.labels = _labels;
    _product.ingredients = _ingredients;
    _product.additifs = _additifs;
    _product.quantity = _quantity;
    _product.typeOfProduct = _typeOfProduct;
    _product.packaging = _packaging;
    _product.isValidated = false;
    _product.isExist = true;
    _product.created_n_last_modif = [now, now];
    _product.nutrimentsId = _productCode;
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
    emit TriggerAddProduct(_productCode);
    // keccak256(abi.encodePacked(_productCode,_productName,msg.sender,_labels,_ingredients,_nutriments,_quantity,_typeOfProduct,_packaging))
  }

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

  function getProductsVoting() public view returns(Product[] memory, Nutriments[] memory){
    return (ProposalProducts, ProposalNutriments);
  }

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
}
