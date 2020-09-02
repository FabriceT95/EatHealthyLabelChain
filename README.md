# Projet Alyra : EatHealthy Chain
The purpose of this project is to validate the Alyra cursus "Développeur Blockchain";
Basée sur la technologie blockchain, ce projet est une application web permettant 
à quiconque possédant un porte-monnaie Metamask de renseigner des informations
sur un produit alimentaire. En d'autres termes, n'importe quel utilisateur peut ajouter,
modifier ou simplement s'informer sur les caractéristiques de produits sans avoir à
douter de leur véracité.
Cette application décentralisée est gouvernée par sa communauté : à travers la gestion des produits
ainsi que part le système de vote proposé, la communauté décide elle-même de la fiabilité qu'un
proposeur de produit saisit.


## Installation
#### Requirements :
- Ganache : [https://www.trufflesuite.com/ganache](https://www.trufflesuite.com/ganache)
- VirtualBox : [https://www.virtualbox.org](https://www.virtualbox.org/)
- Metamask : [https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn](https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn)

#### Setup the project
- Clone the project repository on your local : [https://github.com/FabriceT95/EatHealthyLabelChain](https://github.com/FabriceT95/EatHealthyLabelChain)
- Then import the virtual machine MySQL_Centos_Eat in VirtualBox : [EatHealthyLabelChain\VMs](https://github.com/FabriceT95/EatHealthyLabelChain\VMs)
- Open the Virtual Machine :
    - Write down its ipv4, it will be needed later.
    - Check if mysql is installed : ``mysql --version``, otherwise install it `` sudo apt install mysql-server``
    - Start the mysql service : ``service mysqld start`` then check its status : ``service mysqld status``, output has to be running
    - Clone the project repository in the Virtual Machine 
    - Open two terminals.
    
        First :
        ```bash 
        cd EatHealthyLabelChain/src/eatHealthySC_Server/src
        node index.js -p 8090 -db eatHealthy_SC -u root -pwd ''
        ```
      
       Second :
      ```bash 
      cd EatHealthyLabelChain/src/eatHealthySC_Server/src
      node index.js -p 8080 -db eatHealthy -u root -pwd ''
      ```
      Now your MySQL back-end is running
- On your local, open three terminal :  
    - First : 
        ```bash
        cd EatHealthyLabelChain/
        truffle deploy --network ganache --reset  
        ```

    - Second : 
        ```bash
        cd src/
        node watcherServer.js -ip <ip wrote earlier> -p 8090 -m BC
        ```
  
    - Third : 
        ```bash
        node watcherServer.js -ip <ip wrote earlier> -p 8080 -m mysql
         ```
      
    - On the first window : 
        ```bash
          npm start
         ```  
          
The project is now entirely running on your [http://localhost:4200/](http://localhost:4200/)
      
