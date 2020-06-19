//var ConvertLib = artifacts.require("./ConvertLib.sol");
//var MetaCoin = artifacts.require("./MetaCoin.sol");
var dataTest = artifacts.require("./dataTest.sol");

module.exports = function(deployer) {
 // deployer.deploy(ConvertLib);
 // deployer.link(ConvertLib, MetaCoin);
//  deployer.deploy(MetaCoin);
  deployer.deploy(dataTest);
};
