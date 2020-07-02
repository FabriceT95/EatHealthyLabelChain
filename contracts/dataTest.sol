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
    string userName;
    string userMail;
    Role role;
    bool isExist;
  }

  struct Product{
    // uint productId;
    // uint productCode;
    string productName;
    address productProposerAddress;
    string[] labels;
    uint nutrimentsId;
    string[] ingredients;
    string[] additifs;
    string quantity;
    string typeOfProduct;
    string[] packaging;
    uint totalVotes;
    uint forVotes;
    uint againstVotes;
    uint created_t;
    bytes32 hash;
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

  mapping(address => User) public ownerToUser;

  mapping(uint => Product) public productCodeToProposalProduct;

  mapping(uint => Product) public productCodeToProduct;

  mapping(uint => Nutriments) public productCodeToNutriments;

  event TriggerAddProduct(uint indexed idProduct);

  constructor() public {
    _owner = msg.sender;
    ownerToUser[_owner] = User(uniqueIdUser, "FABRIIIIIIIIIIICE", "yoip@yop.fr", Role.ADMIN, true);
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
    string memory _quantity,
    string memory _typeOfProduct,
    string[] memory _packaging,
    Nutriments memory _nutriments,
    string[] memory _additifs

  ) public {
    require(!productCodeToProduct[_productCode].isExist);
    Product memory _product;
   // _product.productCode = _productCode;
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
    _product.created_t = now;
    _product.nutrimentsId = _productCode;
    productCodeToNutriments[_productCode] = _nutriments;
    _product.hash = keccak256(abi.encodePacked(_product.productName,_product.productProposerAddress, _product.quantity));
    productCodeToProposalProduct[_productCode] = _product;
    emit TriggerAddProduct(_productCode);
    // keccak256(abi.encodePacked(_productCode,_productName,msg.sender,_labels,_ingredients,_nutriments,_quantity,_typeOfProduct,_packaging))
  }

  function getRole() public view returns (Role) {
    return ownerToUser[msg.sender].role;
  }


  // To add a product in proposal, we need to check if the product doesn't already exist in mappings of products
  function checkProductIsNew (uint _productCode) public view checkLengthGS1(_productCode) returns (bool) {
    if(!productCodeToProposalProduct[_productCode].isExist && !productCodeToProduct[_productCode].isExist){
      return true;
    }else{
      return false;
    }
  }
}
