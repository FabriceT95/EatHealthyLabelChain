# Projet Alyra : EatHealthy Chain
The purpose of this project is to validate the Alyra cursus "Développeur Blockchain";
Based on the Blockchain technology, this project is a web app allowing Metamask wallet owner to fill in information about food products.
In other words, any user can add, modify or simply inquire about product characteristics without having to doubt their veracity.
This DApp  is governed by its community throught product management and by the voting system. 
The community itself decides on the reliability of a product proposed by a user.


## Installation
#### Requirements :
- VirtualBox : [https://www.virtualbox.org](https://www.virtualbox.org/)
- Metamask : [https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn](https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn)

#### Setup the project
- Clone the project repository on your local : [https://github.com/FabriceT95/EatHealthyLabelChain](https://github.com/FabriceT95/EatHealthyLabelChain)
- In the project root, you will need to create a secret.json file with your credentials :
    ```json
    {
      "infuraProjectToken": "infuratoken",
      "mnemonic": "12 words mnemonic",
      "publicKey": "your public key",
      "privateKey": "your private key"
    }
    ```
  The first is needed to allow you to have an Infura node and the others are needed to deploy
  the contract and give access to your watcherServer.js (see below). DO NOT FORGET TO CREATE AN
  INFURA ACCOUNT AND A PROJECT THEN ALLOW ACCESS TO YOUR PUBLIC KEY.
  

- Then import the virtual machine MySQL_Centos_Eat in VirtualBox : [EatHealthyLabelChain\VMs](https://github.com/FabriceT95/EatHealthyLabelChain\VMs)
- Open the Virtual Machine :
    - Write down its ipv4, it will be needed later.
    - Check if mysql is installed : ``mysql --version``, otherwise install it `` sudo apt install mysql-server``
    - Start the mysql service : ``service mysqld start`` then check its status : ``service mysqld status``, output has to be 'running'
    - Clone the project repository in the Virtual Machine 
    - You need to get modules from the server package :
        ```bash
        cd EatHealthyLabelChain/src/eatHealthySC_Server
        npm i
        ```
    - Open two terminals.
    
        First :
        ```bash 
        cd EatHealthyLabelChain/src/eatHealthySC_Server/src
        node index.js -p 8090 -db eatHealthy_SC -u root -pwd ''
        ```
      
       Second (OPTIONAL, for demo purpose) :
      ```bash 
      cd EatHealthyLabelChain/src/eatHealthySC_Server/src
      node index.js -p 8080 -db eatHealthy -u root -pwd ''
      ```
      Now your MySQL back-end is running
- On your local, open three terminal :  
    - First, if you want to deploy the contract : 
        ```bash
        cd EatHealthyLabelChain/
        truffle deploy --network ropsten --reset  
        ```

    - Second : 
        ```bash
        cd src/
        node watcherServer.js -ip <ip wrote earlier> -p 8090 -m BC
        ```
      This server will help you to automatically end a vote and 
      set all alternatives votes in the contract at midnight
  
    - Third (OPTIONAL, for demo purpose): 
        ```bash
        node watcherServer.js -ip <ip wrote earlier> -p 8080 -m mysql
         ```
      
    - On the first window : 
        ```bash
          npm start
         ```  
          
The project is now entirely running on your [http://localhost:4200/](http://localhost:4200/)
      
