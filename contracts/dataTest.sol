//pragma solidity 0.5.16;
//
//import "./LabelChainHelper.sol";
//
//
//pragma experimental ABIEncoderV2;
//
//
///**
// @title DataLabelChain contract
// @author Fabrice Tapia
// @dev Contract which is a part of the Alyra's Final Project : Eat Healthy LabelChain
// */
//
//contract DataTest is LabelChainHelper {
//
//
//  address private _owner;
//
//  // Simple event when a product is added to the product proposal phase
// // event TriggerAddProduct(uint indexed idProduct);
//
//  // Setting up the owner as a user (may not be needed)
//  constructor() public {
//    _owner = msg.sender;
//    endVoteResponsible = 0x712EB6c16Ab3694b684B6c74B40A676c6d13621a;
//    addressToUser[_owner] = User(uniqueIdUser, now, 10, 0, true /*,  Role.ADMIN*/);
//    uniqueIdUser++;
//  }
//
//  //  modifier checkProductProposalIsNew (uint productCode) {
//  //    require(!productCodeToProduct[productCode].isExist);
//  //    _;
//  //  }
//
//  /*
//    function getProduct(uint productCode) view public returns(Product){
//      return productCodeToProduct[productCode];
//    }*/
//
//
//  /**
//  @notice Product is added in proposal phase by the user,
//          then visible for all users for votes
//  @dev
//         Add a new Product and Nutriments object in corresponding proposal mappings
//         Also added in corresponding arrays, useful to get them all from front-end
//         Finally, emitting an event to warn the user, all is OK
//  @param _productCode, _productName, _labels, _ingredients, _quantity,
//         _typeOfProduct, _packaging, _nutriments, _addiditfs
//         => Elements needed to fill in both Product and Nutriments object
//   */
//  function addProductToProposal(
//    uint64 _productCode,
//    string memory _productName,
//    string[] memory _labels,
//    string[] memory _ingredients,
//    uint16 _quantity,
//    string memory _typeOfProduct,
//    string[] memory _packaging,
//    Nutriment memory _nutriments,
//    string[] memory _additifs,
//    ProductStatus _status
//
//  ) checkLengthGS1(_productCode) public {
//    require(addressToUser[msg.sender].isExist == true);
//    require(!productCodeToProposalProduct[_productCode].isExist);
//
//  Product memory _product;
//    Nutriment memory _nutrimentsObject;
//    _product.productId = uniqueProductId;
//    _product.productCode = _productCode;
//    _product.productName = _productName;
//    _product.productProposerAddress = msg.sender;
//    _product.labels = _labels;
//    _product.ingredients = _ingredients;
//    _product.additifs = _additifs;
//    _product.quantity = _quantity;
//    _product.typeOfProduct = _typeOfProduct;
//    _product.packaging = _packaging;
//    _product.isExist = true;
//
//    _product.created_t = uint64(now);
//    _product.endDate = uint64(now + 10 seconds);
//    // _product.nutrimentsId = _productCode;
//   // _product.forVotes = 0;
//   // _product.againstVotes = 0;
//    _product.status = _status;
////    _product.totalVotes = 0;
//    // productCodeToNutriments[_productCode] = _nutriments;
//    // _product.hash = keccak256(abi.encodePacked(_product.productName,_product.productProposerAddress, _product.quantity));
//    productCodeToProposalProduct[_productCode] = _product;
//    addressToProducts[msg.sender][_productCode] = _product;
//    ProposalProducts.push(_product);
//
//    _nutrimentsObject.carbohydrates = bytes32(_nutriments.carbohydrates);
//    _nutrimentsObject.energy = bytes32(_nutriments.energy);
//    _nutrimentsObject.energy_kcal =bytes32 (_nutriments.energy_kcal);
//    _nutrimentsObject.proteines = bytes32(_nutriments.proteines);
//    _nutrimentsObject.salt = bytes32(_nutriments.salt);
//    _nutrimentsObject.sugars =bytes32( _nutriments.sugars);
//    _nutrimentsObject.fat = bytes32(_nutriments.fat);
//    _nutrimentsObject.saturated_fat = bytes32(_nutriments.saturated_fat);
//    _nutrimentsObject.fiber = bytes32(_nutriments.fat);
//    _nutrimentsObject.sodium = bytes32(_nutriments.sodium);
//    productCodeToProposalNutriments[_productCode] = _nutrimentsObject;
//    ProposalNutriments.push(_nutrimentsObject);
//    uniqueProductId++;
//    addressToNutriments[msg.sender][_productCode] = _nutrimentsObject;
//    addressToUser[msg.sender].tokenNumber--;
//    //    addressToProduct[msg.sender][_productCode] = _product;
//    //    addressToNutriments[msg.sender][_product] = _nutrimentsObject;
//
//  //  emit TriggerAddProduct(_productCode);
//    // keccak256(abi.encodePacked(_productCode,_productName,msg.sender,_labels,_ingredients,_nutriments,_quantity,_typeOfProduct,_packaging))
//  }
//
//  // Getting actual user role at the start or when wallet is changed (may not be needed)
////  function getRole() public view returns (Role) {
////    return addressToUser[msg.sender].role;
////  }
//
//
//  // To add a product in proposal, we need to check if the product doesn't already exist in mappings of products
//  function checkProductIsNew(uint _productCode) public view checkLengthGS1(_productCode) returns (bool) {
//    if (!productCodeToProposalProduct[_productCode].isExist && !productCodeToProduct[_productCode].isExist) {
//      return true;
//    } else {
//      return false;
//    }
//  }
//
//
//
//
//  /**
//  @notice User is voting for a product in proposal phase (new or update)
//  @dev
//         User can only vote if he is registered and he has not already voted
//         Then adding vote to for and against
//  @param _opinion vote value (for or against)
//         _productCode product targeted for the vote
// */
////  function vote(bool _opinion, uint _productCode)    public {
//    require(addressToUser[msg.sender].tokenNumber > 0);
//    require(productCodeToProposalProduct[_productCode].created_t < productCodeToProposalProduct[_productCode].endDate);
//    require(alreadyVoted[_productCode][msg.sender][0] == false);
//    require(productCodeToProposalProduct[_productCode].status == ProductStatus.NEW || productCodeToProduct[_productCode].status == ProductStatus.IN_MODIFICATION );
//    alreadyVoted[_productCode][msg.sender][0] = true;
//    if (_opinion == true) {
//      productCodeToProposalProduct[_productCode].forVotes++;
//      ProposalProducts[productCodeToProposalProduct[_productCode].productId].forVotes++;
//    } else {
//      productCodeToProposalProduct[_productCode].againstVotes++;
//      ProposalProducts[productCodeToProposalProduct[_productCode].productId].againstVotes++;
//    }
//    alreadyVoted[_productCode][msg.sender][1] = _opinion;
////    productCodeToProposalProduct[_productCode].totalVotes++;
////    ProposalProducts[productCodeToProposalProduct[_productCode].productId].totalVotes++;
//    addressToUser[msg.sender].tokenNumber--;
//  }
//
//  function endVote(uint _productCode, address proposerAddress) public {
//    require(msg.sender == endVoteResponsible, 'Vous ne pouvez pas mettre fin au vote !');
//    require(productCodeToProposalProduct[_productCode].created_t < productCodeToProposalProduct[_productCode].endDate, "La fin du vote n'est pas depassée !");
//    require(productCodeToProposalProduct[_productCode].status == ProductStatus.NEW || productCodeToProposalProduct[_productCode].status == ProductStatus.IN_MODIFICATION, "Ce produit n'est pas NOUVEAU ni en MODIFICATION" );
//    require(productCodeToProposalProduct[_productCode].isExist, "Ce produit n'existe pas en proposition");
//    if (productCodeToProposalProduct[_productCode].forVotes >= productCodeToProposalProduct[_productCode].againstVotes) {
//      acceptedProduct(_productCode, proposerAddress);
//    } else {
//      refusedProduct(_productCode, proposerAddress);
//    }
//  deleteProductFromProposal(_productCode, proposerAddress);
//  }
//
//
//  /**
//@notice Register a user when he does his first proposal or vote
//@dev
//     Defines a new User object, giving him token and reputation
//     Adds it to a mapping with all other subscribed users
//*/
//
//  function subscribeUser() public  returns (User memory) {
//    require(addressToUser[msg.sender].isExist == false);
//    User memory user;
//    user.userId = uniqueIdUser;
//    // user.role = Role.CUSTOMER;
//    user.lastTimeTokenGiven = now;
//    user.tokenNumber = 5;
//    user.reputation = 50;
//    user.isExist = true;
//    uniqueIdUser++;
//    addressToUser[msg.sender] = user;
//    return user;
//  }
//
//
//
//
//}
