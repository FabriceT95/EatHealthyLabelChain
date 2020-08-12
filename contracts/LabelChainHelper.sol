//pragma solidity 0.5.16;
//pragma experimental ABIEncoderV2;
//
//contract LabelChainHelper {
//
//  enum ProductStatus { NOT_EXIST, NEW, ACCEPTED, IN_MODIFICATION, REFUSED }
//
//  // Option : define roles depending on the user status
// // enum Role {CUSTOMER, SELLER, ADMIN}
//
//
//
//  // Basic Product definition containing values about the product itself
//  // but also about consensus
//  struct Product {
//    address productProposerAddress;
//    uint16 quantity;
//    uint16 forVotes;
//    uint16 againstVotes;
//    uint64 productCode;
//    uint64 created_t;
//    uint64 endDate;
//    uint32 productId;
//    string productName;
//    string[] labels;
//    // uint nutrimentsId;
//    string[] ingredients;
//    string[] additifs;
//    string typeOfProduct;
//    string[] packaging;
//   // uint totalVotes;
//    // uint endVoteDate;
//    //  bytes32 hash;
//  //  bool isValidated;
//    bool isExist;
//    ProductStatus status;
//  }
//
//  // Basic Nutriment structure needed for the Product structure
//  // A way to divide Product content
//  struct Nutriment {
//    bytes32 energy;
//    bytes32 energy_kcal;
//    bytes32 proteines;
//    bytes32 carbohydrates;
//    bytes32 salt;
//    bytes32 sugars;
//    bytes32 fat;
//    bytes32 saturated_fat;
//    bytes32 fiber;
//    bytes32 sodium;
//  }
//
//  // Basic User structure with useful parameters.
//  // In particular, token date, token number and reputation
//  // needed for the consensus
//  struct User {
//    uint32 userId;
//    uint lastTimeTokenGiven;
//    int16 tokenNumber;
//    int16 reputation;
//    bool isExist;
//  //  Role role;
//  }
//
//
//  // Integer needed for the implicit user registration
//  // for the first time he proposed a product
//  uint32 uniqueIdUser;
//
//  uint32 uniqueProductId;
//
//  address internal endVoteResponsible;
//
//  // Getter of all products in proposal phase
//  Product[] ProposalProducts;
//
//  // Getter of all nutriments products in proposal phase
//  Nutriment[] ProposalNutriments;
//
//  // Getter of all products accepted
//  Product[] Products;
//
//  // Getter of all nutriments products accepted
//  Nutriment[] Nutriments;
//
//  // Getter of all products denied
// // Product[] DeniedProducts;
//
//  // Getter of all nutriments products denied
// // Nutriment[] DeniedNutriments;
//
//  // uint[] ProposalProductsCode;
//
//  // Accessing to a User structure by his address
//  mapping(address => User) public addressToUser;
//
//  mapping(uint => mapping(address => bool[2])) public alreadyVoted;
//
//  // Accessing to a Product in proposal phase by his code
//  mapping(uint => Product) public productCodeToProposalProduct;
//
//  mapping(uint => Nutriment) public productCodeToProposalNutriments;
//
//  // Accessing to a Product adopted by his code
//  mapping(uint => Product) public productCodeToProduct;
//
//  // Accessing to Nutriments of a Product adopted by his code
//  mapping(uint => Nutriment) public productCodeToNutriments;
//
//  //mapping(address => Product[]) addressToProducts;
//  mapping(address => mapping(uint => Product)) addressToProducts;
//
//  mapping(address => mapping(uint => Nutriment)) addressToNutriments;
//
//
//  // Simple event when a product is added to the product proposal phase
//  event TriggerAddProduct(uint indexed idProduct);
//
//  modifier UserExists() {
//    require(addressToUser[msg.sender].isExist == true);
//    _;
//  }
//
//  modifier NotAlreadyInProposal(uint _productCode) {
//    require(!productCodeToProposalProduct[_productCode].isExist);
//    _;
//  }
//
//  modifier ProductInVoteStage(uint _productCode) {
//    require(productCodeToProposalProduct[_productCode].status == ProductStatus.NEW || productCodeToProduct[_productCode].status == ProductStatus.IN_MODIFICATION );
//    _;
//  }
//
//  modifier hasNotVoted(uint _productCode) {
//    require(alreadyVoted[_productCode][msg.sender][0] == false);
//    _;
//  }
//
//  modifier hasEnoughToken() {
//    require(addressToUser[msg.sender].tokenNumber > 0);
//    _;
//  }
//
//  modifier isInDateRange(uint _productCode) {
//    require(productCodeToProposalProduct[_productCode].created_t < productCodeToProposalProduct[_productCode].endDate);
//    _;
//  }
//
//  modifier isVotingDateExceeded(uint _productCode) {
//    require(now >= productCodeToProposalProduct[_productCode].endDate);
//    _;
//  }
//
//  modifier isEndVoteResponsibleAddress(){
//    require(msg.sender == endVoteResponsible);
//    _;
//  }
//  modifier checkLengthGS1 (uint productCode){
//    require(productCode > 1111111111111);
//    _;
//  }
//
//
//
////  function getProductsByUsers() public view returns (Product[] memory, Nutriment[] memory) {
////    return (addressToProducts[msg.sender], addressToNutriments[msg.sender]);
////  }
//
//  function getProductsVoting() public view returns (Product[] memory, Nutriment[] memory){
//    return (ProposalProducts, ProposalNutriments);
//  }
//
//  function getProductsAccepted() public view returns (Product[] memory, Nutriment[] memory){
//    return (Products, Nutriments);
//  }
//
//  function getProposedProduct(uint _productCode) public view returns (Product memory, Nutriment memory){
//    return (productCodeToProposalProduct[_productCode], productCodeToProposalNutriments[_productCode]);
//  }
//
//  function getProduct(uint _productCode) public view returns (Product memory, Nutriment memory){
//    return (productCodeToProduct[_productCode], productCodeToNutriments[_productCode]);
//  }
//
//
//  function isAlreadyVotedByCurrentUser(uint _productCode) public view returns (bool){
//    return alreadyVoted[_productCode][msg.sender][0];
//  }
//
//  function isProposer(uint _productCode) public view returns (bool){
//    return productCodeToProposalProduct[_productCode].productProposerAddress == msg.sender;
//  }
//
//  function isDateOK(uint _productCode) public view returns (bool) {
//    // now ne varie pas, impossible de savoir si on a dépassé la date de fin du vote
//    return now < productCodeToProposalProduct[_productCode].endDate;
//  }
//
//  function deleteProductFromProposal(uint _productCode, address proposerAddress) internal {
//    delete productCodeToProposalProduct[_productCode];
//    delete productCodeToProposalNutriments[_productCode];
//    delete ProposalProducts[addressToProducts[proposerAddress][_productCode].productId];
//    delete ProposalNutriments[addressToProducts[proposerAddress][_productCode].productId];
//  }
//
//  function refusedProduct(uint _productCode, address proposerAddress) internal {
//    productCodeToProposalProduct[_productCode].status = ProductStatus.REFUSED;
//    addressToProducts[proposerAddress][_productCode].status = ProductStatus.REFUSED;
//   // DeniedProducts.push(productCodeToProduct[_productCode]);
//  //  DeniedNutriments.push(productCodeToProposalNutriments[_productCode]);
//  }
//
//  function acceptedProduct(uint _productCode, address proposerAddress) internal {
//
//    if(productCodeToProposalProduct[_productCode].status == ProductStatus.IN_MODIFICATION){
//      delete Products[productCodeToProduct[_productCode].productId];
//      delete Nutriments[productCodeToProduct[_productCode].productId];
//    }
//    // productCodeToProposalProduct[_productCode].isValidated = true;
//    productCodeToProposalProduct[_productCode].status = ProductStatus.ACCEPTED;
//    // addressToProducts[proposerAddress][_productCode].isValidated = true;
//    addressToProducts[proposerAddress][_productCode].status = ProductStatus.ACCEPTED;
//
//    productCodeToProduct[_productCode] = productCodeToProposalProduct[_productCode];
//    productCodeToNutriments[_productCode] = productCodeToProposalNutriments[_productCode];
//    Products.push(productCodeToProposalProduct[_productCode]);
//    Nutriments.push(productCodeToProposalNutriments[_productCode]);
//  }
//}
