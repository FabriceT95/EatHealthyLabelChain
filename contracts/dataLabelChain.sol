pragma solidity 0.5.16;
pragma experimental ABIEncoderV2;

import "./SafeMath.sol";
import "./SignedSafeMath.sol";

/**
 @title DataLabelChain contract
 @author Fabrice Tapia
 @dev Contract which is a part of the Alyra's Final Project : Eat Healthy LabelChain
 */

contract DataLabelChain {

  using SafeMath for uint256;
  using SafeMath32 for uint32;
  using SafeMath16 for uint16;
  using SignedSafeMath for int;

  enum Role {CUSTOMER, SELLER, ADMIN}

  struct User {
    uint userId;
    string userName;
    string userMail;
    Role role;
    bool isExist;
  }

  /* struct Seller{
       uint sellerId;
       string sellerName;
       bool isExist;
   }*/

  struct Product {
    uint productId;
    uint productCode;
    string productName;
    address productProposerId;
    int[] labelIds;
    int againstVotes;
    int forVotes;
    bool isValidated;
    bool isExist;
  }

  struct Label {
    uint labelId;
    string labelName;
    uint labelOwner;
    bool isExist;
  }

  uint uniqueIdUser;

  // uint uniqueIdSeller;

  address private _owner;

  mapping(address => User) public ownerToUser;

  // mapping(address => Seller) public ownerToSeller;

  mapping(address => uint) public ownerToReputation;

  mapping(uint => Product) public productCodeToProduct;

  mapping(uint => Product) public productCodeToProposalProduct;

  mapping(uint => Product) public productCodeToProposalDeleteProduct;

  event triggerSubscribe(uint indexed idUser, Role indexed role);

  event triggerAddProduct(uint indexed idProduct);

  event triggerVote(uint indexed productCode, bool indexed opinion);

  constructor() internal {
    _owner = msg.sender;
    ownerToUser[_owner] = User(uniqueIdUser, "FABRIIIIIIIIIIICE", "yoip@yop.fr", Role.ADMIN, true);
  }

  modifier checkProductIsNew (uint productCode) {
    require(!productCodeToProduct[productCode].isExist);
    _;
  }


  modifier checkProductProposalIsNew (uint productCode) {
    require(!productCodeToProduct[productCode].isExist);
    _;
  }

  modifier checkProposerExists(){
    //    require(ownerToUser[msg.sender].isExist || ownerToSeller[msg.sender].isExist);
    require(ownerToUser[msg.sender].isExist);
    _;
  }

  modifier checkUserIsNew(){
    require(!ownerToUser[msg.sender].isExist);
    _;
  }

  /*  modifier checkSellerIsNew(){
         require(!ownerToSeller[msg.sender].isExist);
        _;
    }*/
  function modifyDataFromUser() public {

  }

//  function subscribeUser(string memory newUserName, string memory newUserMail, int _role) public checkUserIsNew {
//    if (_role == 0) {
//      ownerToUser[msg.sender] = User(uniqueIdUser, newUserName, newUserMail, Role.CUSTOMER, true);
//    } else {
//      ownerToUser[msg.sender] = User(uniqueIdUser, newUserName, newUserMail, Role.SELLER, true);
//    }
//
//    ownerToReputation[msg.sender] = 50;
//    emit triggerSubscribe(uniqueIdUser, ownerToUser[msg.sender].role);
//    uniqueIdUser++;
//  }

  /*function subscribeSeller(string memory newSellerName) public checkSellerIsNew {
      ownerToSeller[msg.sender] = Seller(uint256(keccak256(abi.encodePacked(newSellerName))), newSellerName, true);
  }*/

  function getProduct(uint productCode) view public returns (Product memory){
    return productCodeToProduct[productCode];
  }

  function addProductToProposal(uint _productCode, string memory _productName, int[] memory _labelIds) public checkProductIsNew(_productCode) checkProductProposalIsNew(_productCode) checkProposerExists {
    Product memory product;
    product.productCode = _productCode;
    product.productName = _productName;
    product.productProposerId = msg.sender;
    product.labelIds = _labelIds;
    product.isValidated = false;
    product.isExist = true;
    productCodeToProposalProduct[_productCode] = product;
    emit triggerAddProduct(_productCode);
  }

  // A revoir sur les paramètres à ajouter pour le produit
  function proposalUpdateProduct(uint productCode, Product memory datas) public {
    // require(productCodeToProduct[productCode].isExist && !productCodeToProposalProduct[productCode].isExist && (ownerToUser[msg.sender].isExist || ownerToSeller[msg.sender].isExist));
    require(productCodeToProduct[productCode].isExist && !productCodeToProposalProduct[productCode].isExist && ownerToUser[msg.sender].isExist);
    productCodeToProposalProduct[productCode].productName = datas.productName;
    productCodeToProposalProduct[productCode].labelIds = datas.labelIds;
    productCodeToProposalProduct[productCode].isValidated = false;

  }

  function proposalDeleteProduct(uint productCode) public {
    // require(productCodeToProduct[productCode].isExist && (ownerToUser[msg.sender].isExist || ownerToSeller[msg.sender].isExist));
    require(productCodeToProduct[productCode].isExist && ownerToUser[msg.sender].isExist);
    productCodeToProposalDeleteProduct[productCode] = productCodeToProduct[productCode];
  }


  function voteForProduct(uint productCode, bool opinion) public {
    require(ownerToUser[msg.sender].isExist && productCodeToProposalProduct[productCode].isExist);
    if (opinion == true) {
      // Trouver une formule pour différencier un utilisateur fiable d'un utilisateur mauvais
      productCodeToProposalProduct[productCode].forVotes.add(1);
    } else {
      productCodeToProposalProduct[productCode].againstVotes.add(1);
    }
    emit triggerVote(productCode, opinion);
  }

  function getRole() public view returns (Role) {
    return ownerToUser[msg.sender].role;
  }


}
