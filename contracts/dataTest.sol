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
    uint productId;
    uint productCode;
    string productName;
    uint productProposerId;
    int[] labelIds;
    uint totalVotes;
    uint forVotes;
    bool isValidated;
    bool isExist;
  }

  address private _owner;

  uint uniqueIdUser;

  mapping(address => User) public ownerToUser;

  mapping(uint => Product) public productCodeToProduct;

  event TriggerAddProduct(uint indexed idProduct);

  constructor() public {
    _owner = msg.sender;
    ownerToUser[_owner] = User(uniqueIdUser, "FABRIIIIIIIIIIICE", "yoip@yop.fr", Role.ADMIN, true);
  }

  function getProduct(uint productCode) view public returns(Product memory){
    return productCodeToProduct[productCode];
  }

  function addProductToProposal(uint productCode, string memory productName, uint productProposerId, int[] memory labelIds) public {
    require(!productCodeToProduct[productCode].isExist);
    Product memory product;
    product.productCode = productCode;
    product.productName = productName;
    product.productProposerId = productProposerId;
    product.labelIds = labelIds;
    product.isValidated = false;
    product.isExist = true;
    productCodeToProduct[productCode] = product;
    emit TriggerAddProduct(productCode);
  }

  function getRole() public view returns (Role) {
    return ownerToUser[msg.sender].role;
  }
}
