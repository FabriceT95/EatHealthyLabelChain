pragma solidity 0.5.16;
pragma experimental ABIEncoderV2;

contract LabelChainHelper {

  // Option : define roles depending on the user status
  enum Role {CUSTOMER, SELLER, ADMIN}

  // Basic User structure with useful parameters.
  // In particular, token date, token number and reputation
  // needed for the consensus
  struct User {
    uint userId;
    Role role;
    uint lastTimeTokenGiven;
    int tokenNumber;
    int reputation;
    bool isExist;
  }

  // Basic Product definition containing values about the product itself
  // but also about consensus
  struct Product {
    uint productId;
    uint productCode;
    string productName;
    address productProposerAddress;
    string[] labels;
    // uint nutrimentsId;
    string[] ingredients;
    string[] additifs;
    uint quantity;
    string typeOfProduct;
    string[] packaging;
    uint totalVotes;
    uint forVotes;
    uint againstVotes;
    uint[2] created_n_last_modif;
    uint endDate;
    // uint endVoteDate;
    //  bytes32 hash;
    bool isValidated;
    bool isExist;
  }

  mapping(uint => mapping(address => bool[2])) public alreadyVoted;

  // Basic Nutriment structure needed for the Product structure
  // A way to divide Product content
  struct Nutriment {
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

  // Integer needed for the implicit user registration
  // for the first time he proposed a product
  uint uniqueIdUser;

  uint uniqueProductId;

  // Getter of all products in proposal phase
  Product[] ProposalProducts;

  // Getter of all nutriments products in proposal phase
  Nutriment[] ProposalNutriments;

  // Getter of all products accepted
  Product[] Products;

  // Getter of all nutriments products accepted
  Nutriment[] Nutriments;

  // Getter of all products accepted
  Product[] DeniedProducts;

  // Getter of all nutriments products accepted
  Nutriment[] DeniedNutriments;

  uint[] ProposalProductsCode;

  // Accessing to a User structure by his address
  mapping(address => User) public addressToUser;

  // Accessing to a Product in proposal phase by his code
  mapping(uint => Product) public productCodeToProposalProduct;

  mapping(uint => Nutriment) public productCodeToProposalNutriments;

  // Accessing to a Product adopted by his code
  mapping(uint => Product) public productCodeToProduct;

  // Accessing to Nutriments of a Product adopted by his code
  mapping(uint => Nutriment) public productCodeToNutriments;

  //mapping(address => Product[]) addressToProducts;
  mapping(address => mapping(uint => Product)) addressToProducts;

  mapping(address => mapping(uint => Nutriment)) addressToNutriments;


  // Simple event when a product is added to the product proposal phase
  event TriggerAddProduct(uint indexed idProduct);

//  function getProductsByUsers() public view returns (Product[] memory, Nutriment[] memory) {
//    return (addressToProducts[msg.sender], addressToNutriments[msg.sender]);
//  }

  function getProductsVoting() public view returns (Product[] memory, Nutriment[] memory){
    return (ProposalProducts, ProposalNutriments);
  }


  function isAlreadyVotedByCurrentUser(uint _productCode) public view returns (bool){
    return alreadyVoted[_productCode][msg.sender][0];
  }

  function isProposer(uint _productCode) public view returns (bool){
    return productCodeToProposalProduct[_productCode].productProposerAddress == msg.sender;
  }

  function isDateOK(uint _productCode) public view returns (bool) {
    // now ne varie pas, impossible de savoir si on a dépassé la date de fin du vote
    return now < productCodeToProposalProduct[_productCode].endDate;
  }
}
