const express = require('express');

// Gathering all routes queries to the DB
function createRouter(db) {
  let suffix;
  if(db.config.database === 'eatHealthy' + suffix + '') {
    suffix = '' + suffix + '';
  } else {
    suffix = '';
  }

  const router = express.Router();

  ////////////////////////////////////////////////////// POST QUERIES /////////////////////////////////////////////////////////////////

  // Adds a new user passing his wallet address
  router.post('/add_user/:user_address', async (req, res, next) => {
    insertFunction('INSERT INTO Users' + suffix + ' (address) ' +
      'VALUES ("' + req.params.user_address + '")', res);
  });

  // Registers user as voter for a product : avoids to let him vote twice or more
  router.post('/add_vote/:all_hash/:product_code/:user_address', async (req, res, next) => {
    insertFunction('INSERT INTO Voters' + suffix + ' (product_code, address, all_hash, type) ' +
      'VALUES (' + req.params.product_code + ',"' + req.params.user_address + '","' + req.params.all_hash + '", "Product")', res);
  });

  // Registers user as voter for an alternative : avoids to let him vote twice or more
  router.post('/add_vote_alternative/:all_hash/:product_code/:product_code_alternative/:user_address/:opinion', async (req, res, next) => {
    insertFunction('INSERT INTO Voters' + suffix + ' (product_code, address, all_hash, product_code_alternative, opinion, type) ' +
      'VALUES (' + req.params.product_code + ',"' + req.params.user_address + '","' + req.params.all_hash + '",' + req.params.product_code_alternative + ',' + req.params.opinion + ', "Alternative")', res);
  });

  // Adds labels and its hash for a product (distinct same hash and labels with their id)
  router.post('/add_labels/:labels_hash/:labels', async (req, res, next) => {
    insertFunction('INSERT INTO labels' + suffix + ' (labels_hash, labels)' +
      ' VALUES ("' + req.params.labels_hash + '","' + req.params.labels + '")', res);
  });

  // Adds additives and its hash for a product (distinct same hash and additives with their id)
  router.post('/add_additives/:additives_hash/:additives', async (req, res, next) => {
    insertFunction('INSERT INTO additives' + suffix + ' (additives_hash, additives) ' +
      'VALUES ("' + req.params.additives_hash + '","' + req.params.additives + '")', res);
  });

  // Adds ingredients and its hash for a product (distinct same hash and ingredients with their id)
  router.post('/add_ingredients/:ingredients_hash/:ingredients', async (req, res, next) => {
    insertFunction('INSERT INTO ingredients' + suffix + ' (ingredients_hash, ingredients) ' +
      'VALUES ("' + req.params.ingredients_hash + '","' + req.params.ingredients + '")', res);
  });

  // Adds nutriments and its hash for a product (distinct same hash and nutriments with their id)
  router.post('/add_nutriments/:nutriments_hash/:nutriments', async (req, res, next) => {
    const nutriments = JSON.parse(req.params.nutriments);
    db.query('INSERT INTO nutriments' + suffix + 'C (nutriments_hash, energy, energy_kcal, proteines, carbohydrates, salt, sugar, fat, saturated_fat, fiber, sodium) ' +
      'VALUES (?,?,?,?,?,?,?,?,?,?,?)',
      [req.params.nutriments_hash,
        nutriments.energy,
        nutriments.energy_kcal,
        nutriments.proteines,
        nutriments.carbohydrates,
        nutriments.salt,
        nutriments.sugar,
        nutriments.fat,
        nutriments.saturated_fat,
        nutriments.fiber,
        nutriments.sodium],
      (error) => {
        if (error) {
          console.log(error);
          res.status(500).json({status: 'error', error: error});
        } else {
          res.status(200).json({status: 'ok'});
        }
      })
  });

  // Adds various data and its hash for a product (distinct same hash and various data with their id)
  router.post('/add_various_data/:variousDatas_hash/:product_code/:product_name/:product_type/:quantity/:packaging', async (req, res, next) => {
    db.query('INSERT INTO variousDatas' + suffix + ' (variousDatas_hash, product_code, product_name, product_type, quantity, packaging) ' +
      'VALUES (?,?,?,?,?,?)',
      [req.params.variousDatas_hash, req.params.product_code, req.params.product_name, req.params.product_type, req.params.quantity, req.params.packaging],
      (error) => {
        if (error) {
          console.log(error);
          res.status(500).json({status: 'error', error: error});
        } else {
          res.status(200).json({status: 'ok'});
        }
      })

  });

  // Adds product info and its hash for a product (distinct same hash and product info with their id)
  // Has the hash of all hash with useful data (dates, proposer address and status) mainly used to compare with Smart contract
  router.post('/add_product_infos/:all_hash/:address_proposer/:start_date/:end_date/:status', async (req, res, next) => {
    db.query('INSERT INTO productInfos' + suffix + ' (all_hash, address_proposer, start_date, end_date, status) ' +
      'VALUES (?,?,FROM_UNIXTIME(?),FROM_UNIXTIME(?),?)',
      [req.params.all_hash, req.params.address_proposer, req.params.start_date, req.params.end_date, req.params.status],
      (error) => {
        if (error) {
          console.log(error);
          res.status(500).json({status: 'error', error: error});
        } else {
          res.status(200).json({status: 'ok'});
        }
      })

  });
  // Add a new product alternative : only needs the product target code and the product code alternative proposed
  router.post('/add_alternative/:product_code_target/:product_code_alternative', async (req, res, next) => {
    db.query('INSERT INTO alternatives' + suffix + ' (product_code_target, product_code_alternative) ' +
      'VALUES (?,?)',
      [req.params.product_code_target, req.params.product_code_alternative],
      (error) => {
        if (error) {
          console.log(error);
          res.status(500).json({status: 'error', error: error});
        } else {
          res.status(200).json({status: 'ok'});
          console.log('ALTERNATIVE AJOUTEE');
        }
      })

  });


  ////////////////////////////////////////////////////// PUT QUERIES /////////////////////////////////////////////////////////////////


  // Add a new product alternative : only needs the product target code and the product code alternative proposed
  router.put('/new_vote/:product_code/:opinion', async (req, res, next) => {
    let query;
    if (Boolean(req.params.opinion) === true) {
      query = 'UPDATE productInfos' + suffix + ' INNER JOIN variousDatas' + suffix + ' ON productInfos' + suffix + '.id = variousDatas' + suffix + '.id ' +
        'SET productInfos' + suffix + '.for_votes = productInfos' + suffix + '.for_votes + 1 ' +
        'WHERE variousDatas' + suffix + '.product_code = ' + req.params.product_code + ';';
    } else {
      query = 'UPDATE productInfos' + suffix + ' INNER JOIN variousDatas' + suffix + ' ON productInfos' + suffix + '.id = variousDatas' + suffix + '.id ' +
        'SET productInfos' + suffix + '.against_votes = productInfos' + suffix + '.against_votes + 1 ' +
        'WHERE variousDatas' + suffix + '.product_code = ' + req.params.product_code + ';';
    }
    insertFunction(query, res);

  });
  // Add a new product alternative vote : update will depend on the opinion and the previous opinion
  router.put('/new_vote_alternative/:product_code/:product_code_alternative/:opinion/:prev_opinion', async (req, res, next) => {
    const  query = 'UPDATE alternatives' + suffix + ' ' +
      'SET for_votes = IF(' + req.params.opinion + ' = 1, for_votes + 1, IF(' + req.params.prev_opinion + ' = 1, for_votes - 1, for_votes)), ' +
      'against_votes =  IF(' + req.params.opinion + ' = -1, against_votes + 1,  IF(' + req.params.prev_opinion + ' = -1, against_votes - 1, against_votes)), ' +
      'new_votes_today = true ' +
      'WHERE product_code_target = ' + req.params.product_code + ' AND product_code_alternative = ' + req.params.product_code_alternative + ';';
    insertFunction(query, res);

  });

  // End a vote by passing the product code, votes and set the last verification date to the end vote date sets in the contract
  router.put('/end_vote/:product_code/:for_votes/:against_votes/:lastVerificationDate', async (req, res, next) => {
    const query = 'UPDATE productInfos' + suffix + ' ' +
      'INNER JOIN variousDatas' + suffix + ' ON productInfos' + suffix + '.id = variousDatas' + suffix + '.id ' +
      'SET productInfos' + suffix + '.status = IF(' + req.params.for_votes + ' >= ' + req.params.against_votes + ', "ACCEPTED", "REFUSED"), ' +
      'lastVerificationDate = FROM_UNIXTIME(' + req.params.lastVerificationDate + ') ' +
      'WHERE variousDatas' + suffix + '.product_code = ' + req.params.product_code + ' AND (productInfos' + suffix + '.status = "NEW" OR productInfos' + suffix + '.status = "IN_MODIFICATION");';
    insertFunction(query, res);
  });

  // Sets up the verification date (users decides to verify a product and if everything is alright (no difference between contract and DB)
  // product is verified for one week
  router.put('/verification/:product_code/:lastVerificationDate', async (req, res, next) => {
    const query = 'UPDATE productInfos' + suffix + ' ' +
      'INNER JOIN variousDatas' + suffix + ' ON productInfos' + suffix + '.id = variousDatas' + suffix + '.id ' +
      'SET lastVerificationDate = FROM_UNIXTIME(' + req.params.lastVerificationDate + ') ' +
      'WHERE variousDatas' + suffix + '.product_code = ' + req.params.product_code + ' AND productInfos' + suffix + '.status = "ACCEPTED";';
    insertFunction(query, res);
  });

  // Otherwise , it sets the product as corrupted (difference between contract and DB)
  router.put('/corrupted/:product_code', async (req, res, next) => {
    const query = 'UPDATE productInfos' + suffix + ' ' +
      'INNER JOIN variousDatas' + suffix + ' ON productInfos' + suffix + '.id = variousDatas' + suffix + '.id ' +
      'SET lastVerificationDate = NULL, ' +
      'productInfos' + suffix + '.status = "CORRUPTED" ' +
      'WHERE variousDatas' + suffix + '.product_code = ' + req.params.product_code + ';';
    insertFunction(query, res);
  });

  // Triggers when a product is modified and this modification is accepted by the community :
  // older version is set as 'modified' and the new one is set as 'accepted'
  router.put('/accepted_to_modified/:product_code', async (req, res, next) => {
    const query = 'UPDATE productInfos' + suffix + ' ' +
      'INNER JOIN variousDatas' + suffix + ' ON productInfos' + suffix + '.id = variousDatas' + suffix + '.id ' +
      'SET lastVerificationDate = NULL, ' +
      'productInfos' + suffix + '.status = "MODIFIED" ' +
      'WHERE variousDatas' + suffix + '.product_code = ' + req.params.product_code + ' AND productInfos' + suffix + '.status = "ACCEPTED";';
    insertFunction(query, res);
  });

  // Triggers when a product is modified and this modification is accepted by the community :
  // older version is set as 'modified' and the new one is set as 'accepted'
  router.put('/new_day_alternative_votes/', async (req, res, next) => {
    const query = 'UPDATE alternatives' + suffix + ' ' +
      'SET new_votes_today = false';
    insertFunction(query, res);
  });

  ////////////////////////////////////////////////////// GET QUERIES /////////////////////////////////////////////////////////////////

  // Gets all products which are being modified or totally new
  router.get('/votable_products/', async (req, res, next) => {
    db.query('SELECT *, UNIX_TIMESTAMP(start_date) as start_date_timestamp, UNIX_TIMESTAMP(end_date) as end_date_timestamp FROM productInfos' + suffix + ' ' +
      'INNER JOIN variousDatas' + suffix + ' ON productInfos' + suffix + '.id = variousDatas' + suffix + '.id ' +
      'INNER JOIN labels' + suffix + ' ON productInfos' + suffix + '.id = labels' + suffix + '.id ' +
      'INNER JOIN nutriments' + suffix + ' ON productInfos' + suffix + '.id = nutriments' + suffix + '.id ' +
      'INNER JOIN additives' + suffix + ' ON productInfos' + suffix + '.id = additives' + suffix + '.id ' +
      'INNER JOIN ingredients' + suffix + ' ON productInfos' + suffix + '.id = ingredients' + suffix + '.id ' +
      'WHERE status = "NEW" OR status = "IN_MODIFICATION";',
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).json({status: 'error', error: error});
        } else {
          res.status(200).json(results);
        }
      })

  });

  // Gets all alternatives voted for a given product
  router.get('/get_alternative_voter_for_product/:user_address/:product_code', async (req, res, next) => {
    db.query('SELECT * FROM Voters' + suffix + ' ' +
      'WHERE product_code = ' + req.params.product_code + ' AND address =  "' + req.params.user_address + '" AND type = "Alternative";',
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).json({status: 'error', error: error});
        } else {
          res.status(200).json(results);
        }
      })

  });

  // Gets all alternatives which has been voted the current day (used in a separated server to update the contract)
  router.get('/get_voted_alternatives/', async (req, res, next) => {
    db.query('SELECT ' +
      'product_code_target as productCode, ' +
      'product_code_alternative as productCodeAlternative, ' +
      'for_votes as forVotes, ' +
      'against_votes as againstVotes, ' +
      'new_votes_today as isVotedToday, ' +
      'proposition_date as propositionDate FROM alternatives' + suffix + ' ' +
      'WHERE new_votes_today = true',
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).json({status: 'error', error: error});
        } else {
          res.status(200).json(results);
        }
      })

  });

  // Gets a single accepted product (mainly used to check existence)
  router.get('/get_product/:product_code', async (req, res, next) => {
    db.query('SELECT * FROM variousDatas' + suffix + ' ' +
      'INNER JOIN productInfos' + suffix + ' ON productInfos' + suffix + '.id = variousDatas' + suffix + '.id ' +
      'WHERE status = "ACCEPTED" AND product_code = ' + req.params.product_code + '; ',
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).json({status: 'error', error: error});
        } else {
          res.status(200).json(results);
        }
      })

  });
  // Gets all alternatives of a product split in two categories : top alternatives and new alternatives (newest, less than 7 days)
  router.get('/get_alternatives/:product_code', async (req, res, next) => {
    db.query('(SELECT * FROM ' +
      '(SELECT prod2.product_code, prod2.product_name, alt.for_votes, alt.against_votes, productInfos' + suffix + '.status FROM alternatives' + suffix + ' as alt ' +
      'INNER JOIN variousDatas' + suffix + ' as prod1 ON prod1.product_code = alt.product_code_target ' +
      'INNER JOIN variousDatas' + suffix + ' as prod2 ON prod2.product_code = alt.product_code_alternative ' +
      'INNER JOIN productInfos' + suffix + ' ON productInfos' + suffix + '.id = prod2.id ' +
      'WHERE prod1.product_code = ' + req.params.product_code + ' AND (productInfos' + suffix + '.status = "ACCEPTED" OR productInfos' + suffix + '.status = "IN_MODIFICATION") ' +
      'ORDER BY FIELD(productInfos' + suffix + '.status, "ACCEPTED", "IN_MODIFICATION"), for_votes DESC LIMIT 5) ' +
      'as d GROUP BY d.product_name, d.product_code, d.for_votes) ' +
      'UNION' +
      '(SELECT * FROM ' +
      '(SELECT prod2.product_code, prod2.product_name, alt.for_votes, alt.against_votes, productInfos' + suffix + '.status FROM alternatives' + suffix + ' as alt ' +
      'INNER JOIN variousDatas' + suffix + ' as prod1 ON prod1.product_code = alt.product_code_target ' +
      'INNER JOIN variousDatas' + suffix + ' as prod2 ON prod2.product_code = alt.product_code_alternative ' +
      'INNER JOIN productInfos' + suffix + ' ON productInfos' + suffix + '.id = prod2.id ' +
      'WHERE prod1.product_code = ' + req.params.product_code + ' AND (productInfos' + suffix + '.status = "ACCEPTED" OR productInfos' + suffix + '.status = "IN_MODIFICATION") AND proposition_date >= DATE(NOW()) - INTERVAL 7 DAY ' +
      'ORDER BY FIELD(productInfos' + suffix + '.status, "ACCEPTED", "IN_MODIFICATION"), proposition_date DESC ) ' +
      'as d GROUP BY d.product_name, d.product_code, d.for_votes);',
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).json({status: 'error', error: error});
        } else {
          res.status(200).json(results);
        }
      })

  });

  // Gets votable product based on some inputs (displays data on search result in votes page)
  router.get('/votable_products/:inputType/:inputValue/:alphabetical_name/:date_order', async (req, res, next) => {
    let query = 'SELECT *, UNIX_TIMESTAMP(start_date) as start_date_timestamp, UNIX_TIMESTAMP(end_date) as end_date_timestamp FROM productInfos' + suffix + ' ' +
      'INNER JOIN variousDatas' + suffix + ' ON productInfos' + suffix + '.id = variousDatas' + suffix + '.id ' +
      'INNER JOIN labels' + suffix + ' ON productInfos' + suffix + '.id = labels' + suffix + '.id ' +
      'INNER JOIN nutriments' + suffix + ' ON productInfos' + suffix + '.id = nutriments' + suffix + '.id ' +
      'INNER JOIN additives' + suffix + ' ON productInfos' + suffix + '.id = additives' + suffix + '.id ' +
      'INNER JOIN ingredients' + suffix + ' ON productInfos' + suffix + '.id = ingredients' + suffix + '.id ' +
      'WHERE status = "NEW" OR status = "IN_MODIFICATION" ';

    switch (req.params.inputType) {
      case 'productCode':
        query += 'AND ' + req.params.inputType + ' LIKE ';
        break;
      case 'label':
        query += 'AND labels' + suffix + '.' + req.params.inputType + ' LIKE ';
        break;
      case 'ingredients':
        query += 'AND ingredients' + suffix + '.' + req.params.inputType + ' LIKE ';
        break;
      case 'product_type':
        query += 'AND variousDatas' + suffix + '.' + req.params.inputType + ' LIKE ';
        break;
      case 'product_name':
        query += 'AND variousDatas' + suffix + '.' + req.params.inputType + ' LIKE ';
        break;
    }

    query = filters(req, query);

    db.query(query,
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).json({status: 'error', error: error});
        } else {
          res.status(200).json(results);
        }
      })

  });

  // Gets all accepted product (displays it in search result in the Home page)
  router.get('/accepted_products/', async (req, res, next) => {
    db.query('SELECT *, UNIX_TIMESTAMP(start_date) as start_date_timestamp, UNIX_TIMESTAMP(end_date) as end_date_timestamp FROM productInfos' + suffix + ' ' +
      'INNER JOIN variousDatas' + suffix + ' ON productInfos' + suffix + '.id = variousDatas' + suffix + '.id ' +
      'INNER JOIN labels' + suffix + ' ON productInfos' + suffix + '.id = labels' + suffix + '.id ' +
      'INNER JOIN nutriments' + suffix + ' ON productInfos' + suffix + '.id = nutriments' + suffix + '.id ' +
      'INNER JOIN additives' + suffix + ' ON productInfos' + suffix + '.id = additives' + suffix + '.id ' +
      'INNER JOIN ingredients' + suffix + ' ON productInfos' + suffix + '.id = ingredients' + suffix + '.id ' +
      'WHERE (status = "ACCEPTED" OR status = "MODIFIED") ' +
      'ORDER BY FIELD(status, "ACCEPTED", "MODIFIED"), end_date ASC;',
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).json({status: 'error', error: error});
        } else {
          res.status(200).json(results);
        }
      })

  });

  // Gets accpeted product based on some inputs (displays data on search result in Home page)
  router.get('/accepted_products/:inputType/:inputValue/:alphabetical_name/:date_order', async (req, res, next) => {
    let query = 'SELECT *, UNIX_TIMESTAMP(start_date) as start_date_timestamp, UNIX_TIMESTAMP(end_date) as end_date_timestamp FROM productInfos' + suffix + ' ' +
      'INNER JOIN variousDatas' + suffix + ' ON productInfos' + suffix + '.id = variousDatas' + suffix + '.id ' +
      'INNER JOIN labels' + suffix + ' ON productInfos' + suffix + '.id = labels' + suffix + '.id ' +
      'INNER JOIN nutriments' + suffix + ' ON productInfos' + suffix + '.id = nutriments' + suffix + '.id ' +
      'INNER JOIN additives' + suffix + ' ON productInfos' + suffix + '.id = additives' + suffix + '.id ' +
      'INNER JOIN ingredients' + suffix + ' ON productInfos' + suffix + '.id = ingredients' + suffix + '.id ' +
      'WHERE (status = "ACCEPTED"OR status = "MODIFIED") ';

    switch (req.params.inputType) {
      case 'product_code':
        query += 'AND ' + req.params.inputType + ' LIKE ';
        break;
      case 'label':
        query += 'AND labels' + suffix + '.' + req.params.inputType + ' LIKE ';
        break;
      case 'ingredients':
        query += 'AND ingredients' + suffix + '.' + req.params.inputType + ' LIKE ';
        break;
      case 'product_type':
        query += 'AND variousDatas' + suffix + '.' + req.params.inputType + ' LIKE ';
        break;
      case 'product_name':
        query += 'AND variousDatas' + suffix + '.' + req.params.inputType + ' LIKE ';
        break;
    }

    query = filters(req,query);

    db.query(query,
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).json({status: 'error', error: error});
        } else {
          res.status(200).json(results);
        }
      })

  });
  // Gets a particular product and its older versions (the 'accepted' one and 'modified' ones)
  router.get('/get_product_and_older_version/:product_code', async (req, res, next) => {
    db.query("SELECT *, UNIX_TIMESTAMP(start_date) as start_date_timestamp, UNIX_TIMESTAMP(end_date) as end_date_timestamp FROM productInfos' + suffix + ' " +
      "INNER JOIN variousDatas' + suffix + ' ON productInfos' + suffix + '.id = variousDatas' + suffix + '.id " +
      "INNER JOIN labels' + suffix + ' ON productInfos' + suffix + '.id = labels' + suffix + '.id " +
      "INNER JOIN nutriments' + suffix + ' ON productInfos' + suffix + '.id = nutriments' + suffix + '.id " +
      "INNER JOIN additives' + suffix + ' ON productInfos' + suffix + '.id = additives' + suffix + '.id " +
      "INNER JOIN ingredients' + suffix + ' ON productInfos' + suffix + '.id = ingredients' + suffix + '.id " +
      "WHERE (status = 'ACCEPTED' OR status = 'MODIFIED') AND variousDatas' + suffix + '.product_code = '" + req.params.product_code + "';",
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).json({status: 'error', error: error});
        } else {
          res.status(200).json(results);
        }
      })
  });

  // Check if a particular product is already being modified (avoid conflict for modifying a product)
  router.get('/get_in_modification_status/:product_code', async (req, res, next) => {
    db.query('SELECT * FROM productInfos' + suffix + ' ' +
      'INNER JOIN variousDatas' + suffix + ' ON variousDatas' + suffix + '.id = productInfos' + suffix + '.id ' +
      'WHERE variousDatas' + suffix + '.product_code = "' + req.params.product_code + '"  AND productInfos' + suffix + '.status = "IN_MODIFICATION";',
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).json({status: 'error', error: error});
        } else {
          res.status(200).json(results);
        }
      })
  });

  // Gets user data
  router.get('/user/:user_address', async (req, res, next) => {
    db.query('SELECT * FROM Users' + suffix + ' ' +
      'WHERE address = "' + req.params.user_address + '";',
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).json({status: 'error', error: error});
        } else {
          res.status(200).json(results);
        }
      })

  });

  // Gets proposed product by the current user (displays it in the proposal page)
  router.get('/get_my_proposals/:user_address', async (req, res, next) => {
    db.query('SELECT *, UNIX_TIMESTAMP(start_date) as start_date_timestamp, UNIX_TIMESTAMP(end_date) as end_date_timestamp FROM productInfos' + suffix + ' ' +
      'INNER JOIN variousDatas' + suffix + ' ON productInfos' + suffix + '.id = variousDatas' + suffix + '.id ' +
      'INNER JOIN labels' + suffix + ' ON productInfos' + suffix + '.id = labels' + suffix + '.id ' +
      'INNER JOIN nutriments' + suffix + ' ON productInfos' + suffix + '.id = nutriments' + suffix + '.id ' +
      'INNER JOIN additives' + suffix + ' ON productInfos' + suffix + '.id = additives' + suffix + '.id ' +
      'INNER JOIN ingredients' + suffix + ' ON productInfos' + suffix + '.id = ingredients' + suffix + '.id ' +
      'WHERE (status = "NEW" OR status = "IN_MODIFICATION") AND address_proposer = "' + req.params.user_address + '";',
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).json({status: 'error', error: error});
        } else {
          res.status(200).json(results);
        }
      })

  });


  ////////////////////////////////////////////////////// DELETE QUERIES /////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////// ONLY FOR DEV PURPOSE //////////////////////////////////////////////////////////////

  router.delete('/delete_users' + suffix + '', async (req, res, next) => {
    insertFunction('DELETE FROM Users' + suffix + '', res);
  });

  router.delete('/delete_voters' + suffix + '', async (req, res, next) => {
    insertFunction('DELETE FROM Voters' + suffix + '', res);
  });

  router.delete('/delete_additives' + suffix + '', async (req, res, next) => {
    insertFunction('DELETE FROM additives' + suffix + '', res);
  });

  router.delete('/delete_ingredients' + suffix + '', async (req, res, next) => {
    insertFunction('DELETE FROM ingredients' + suffix + '', res);
  });

  router.delete('/delete_labels' + suffix + '', async (req, res, next) => {
    insertFunction('DELETE FROM labels' + suffix + '', res);
  });

  router.delete('/delete_nutriments' + suffix + '', async (req, res, next) => {
    insertFunction('DELETE FROM nutriments' + suffix + '', res);
  });

  router.delete('/delete_variousDatas' + suffix + '', async (req, res, next) => {
    insertFunction('DELETE FROM variousDatas' + suffix + '', res);
  });

  router.delete('/delete_productInfos' + suffix + '', async (req, res, next) => {
    insertFunction('DELETE FROM productInfos' + suffix + '', res);
  });

  router.delete('/delete_alternatives' + suffix + '', async (req, res, next) => {
    insertFunction('DELETE FROM alternatives' + suffix + '', res);
  });

  router.put('/reset_auto_increment_Users', async (req, res, next) => {
    insertFunction('ALTER TABLE Users' + suffix + ' AUTO_INCREMENT = 1', res);
  });

  router.put('/reset_auto_increment_Voters', async (req, res, next) => {
    insertFunction('ALTER TABLE Voters' + suffix + ' AUTO_INCREMENT = 1', res);
  });

  router.put('/reset_auto_increment_additives', async (req, res, next) => {
    insertFunction('ALTER TABLE additives' + suffix + ' AUTO_INCREMENT = 1', res);
  });

  router.put('/reset_auto_increment_ingredients', async (req, res, next) => {
    insertFunction('ALTER TABLE ingredients' + suffix + ' AUTO_INCREMENT = 1', res);
  });

  router.put('/reset_auto_increment_labels', async (req, res, next) => {
    insertFunction('ALTER TABLE labels' + suffix + ' AUTO_INCREMENT = 1', res);
  });

  router.put('/reset_auto_increment_nutriments', async (req, res, next) => {
    insertFunction('ALTER TABLE nutriments' + suffix + ' AUTO_INCREMENT = 1', res);
  });

  router.put('/reset_auto_increment_variousDatas', async (req, res, next) => {
    insertFunction('ALTER TABLE variousDatas' + suffix + ' AUTO_INCREMENT = 1', res);
  });

  router.put('/reset_auto_increment_productInfos', async (req, res, next) => {
    insertFunction('ALTER TABLE productInfos' + suffix + ' AUTO_INCREMENT = 1', res);
  });

  router.put('/reset_auto_increment_alternatives', async (req, res, next) => {
    insertFunction('ALTER TABLE alternatives' + suffix + ' AUTO_INCREMENT = 1', res);
  });

  //
  async function insertFunction(myQuery, res) {
    db.query(myQuery,
      (error) => {
        if (error) {
          console.log(error);
          res.status(500).json({status: 'error', error: error});
        } else {
          console.log('DONE');
          res.status(200).json({status: 'ok'});
        }
      })
  }

  function filters(req, query){
    if (req.params.inputValue !== '*') {
      query += '"%' + req.params.inputValue + '%" ';
    } else {
      query += '"%"';
    }

    if (req.params.alphabetical_name === true) {
      query += 'AND ORDER BY product_name ASC';
    }

    if (req.params.date_order === true) {
      query += 'AND ORDER BY end_date ASC';
    }

    query += ';';

    return query;
  }


  return router;


}

module.exports = createRouter;
