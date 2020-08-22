const express = require('express');

function createRouter(db) {

  const router = express.Router();

  router.post('/add_user/:user_address', async (req, res, next) => {
    insertFunction('INSERT INTO Users_SC (address) VALUES ("' + req.params.user_address + '")', res);
  });

  router.post('/add_vote/:all_hash/:product_code/:user_address', async (req, res, next) => {
    insertFunction('INSERT INTO Voters_SC (product_code, address, all_hash, type) VALUES (' + req.params.product_code + ',"' + req.params.user_address + '","' + req.params.all_hash + '", "Product")', res);
  });

  router.post('/add_vote_alternative/:all_hash/:product_code/:product_code_alternative/:user_address/:opinion', async (req, res, next) => {
    insertFunction('INSERT INTO Voters_SC (product_code, address, all_hash, product_code_alternative, opinion, type) VALUES (' + req.params.product_code + ',"' + req.params.user_address + '","' + req.params.all_hash + '",' + req.params.product_code_alternative + ',' + req.params.opinion + ', "Alternative")', res);
  });

  router.post('/add_labels/:labels_hash/:labels', async (req, res, next) => {
    insertFunction('INSERT INTO labels_SC (labels_hash, labels) VALUES ("' + req.params.labels_hash + '","' + req.params.labels + '")', res);
  });

  router.post('/add_additives/:additives_hash/:additives', async (req, res, next) => {
    insertFunction('INSERT INTO additives_SC (additives_hash, additives) VALUES ("' + req.params.additives_hash + '","' + req.params.additives + '")', res);
  });

  router.post('/add_ingredients/:ingredients_hash/:ingredients', async (req, res, next) => {
    insertFunction('INSERT INTO ingredients_SC (ingredients_hash, ingredients) VALUES ("' + req.params.ingredients_hash + '","' + req.params.ingredients + '")', res);
  });

  router.post('/add_nutriments/:nutriments_hash/:nutriments', async (req, res, next) => {
    const nutriments = JSON.parse(req.params.nutriments);
    db.query('INSERT INTO nutriments_SC (nutriments_hash, energy, energy_kcal, proteines, carbohydrates, salt, sugar, fat, saturated_fat, fiber, sodium) VALUES(?,?,?,?,?,?,?,?,?,?,?)',
      [req.params.nutriments_hash, nutriments.energy, nutriments.energy_kcal, nutriments.proteines, nutriments.carbohydrates, nutriments.salt, nutriments.sugar, nutriments.fat, nutriments.saturated_fat, nutriments.fiber, nutriments.sodium],
      (error) => {
        if (error) {
          console.log(error);
          res.status(500).json({status: 'error', error: error});
        } else {
          res.status(200).json({status: 'ok'});
          console.log('DONE NUTRIMENTS');
        }
      })

  });

  router.post('/add_various_data/:variousDatas_hash/:product_code/:product_name/:product_type/:quantity/:packaging', async (req, res, next) => {
    db.query('INSERT INTO variousDatas_SC (variousDatas_hash, product_code, product_name, product_type, quantity, packaging) VALUES(?,?,?,?,?,?)',
      [req.params.variousDatas_hash, req.params.product_code, req.params.product_name, req.params.product_type, req.params.quantity, req.params.packaging],
      (error) => {
        if (error) {
          console.log(error);
          res.status(500).json({status: 'error', error: error});
        } else {
          res.status(200).json({status: 'ok'});
          console.log('DONE NUTRIMENTS');
        }
      })

  });

  router.post('/add_product_infos/:all_hash/:address_proposer/:start_date/:end_date/:status', async (req, res, next) => {
    db.query('INSERT INTO productInfos_SC (all_hash, address_proposer, start_date, end_date, status) VALUES(?,?,FROM_UNIXTIME(?),FROM_UNIXTIME(?),?)',
      [req.params.all_hash, req.params.address_proposer, req.params.start_date, req.params.end_date, req.params.status],
      (error) => {
        if (error) {
          console.log(error);
          res.status(500).json({status: 'error', error: error});
        } else {
          res.status(200).json({status: 'ok'});
          console.log('DONE PRODUCT_INFOS');
        }
      })

  });

  router.post('/add_alternative/:product_code_target/:product_code_alternative', async (req, res, next) => {
    db.query('INSERT INTO alternatives_SC (product_code_target, product_code_alternative) VALUES(?,?)',
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

  router.put('/new_vote/:product_code/:opinion', async (req, res, next) => {
    let query;
    if (Boolean(req.params.opinion) === true) {
      query = 'UPDATE productInfos_SC INNER JOIN variousDatas_SC ON productInfos_SC.id = variousDatas_SC.id SET productInfos_SC.for_votes = productInfos_SC.for_votes + 1 WHERE variousDatas_SC.product_code = ' + req.params.product_code + ';';
    } else {
      query = 'UPDATE productInfos_SC INNER JOIN variousDatas_SC ON productInfos_SC.id = variousDatas_SC.id SET productInfos_SC.against_votes = productInfos_SC.against_votes + 1 WHERE variousDatas_SC.product_code = ' + req.params.product_code + ';';
    }
    insertFunction(query, res);

  });

  router.put('/new_vote_alternative/:product_code/:product_code_alternative/:opinion/:prev_opinion', async (req, res, next) => {
    const  query = 'UPDATE alternatives_SC SET for_votes = IF(' + req.params.opinion + ' = 1, for_votes + 1, IF(' + req.params.prev_opinion + ' = 1, for_votes - 1, for_votes), SET against_votes =  IF(' + req.params.opinion + ' = -1, against_votes + 1,  IF(' + req.params.prev_opinion + ' = -1, against_votes - 1, against_votes)) WHERE product_code = ' + req.params.product_code + ' AND product_code_alternative = ' + req.params.product_code_alternative + ';';
    insertFunction(query, res);

  });

  router.put('/end_vote/:product_code/:for_votes/:against_votes/:lastVerificationDate', async (req, res, next) => {
    const query = 'UPDATE productInfos_SC INNER JOIN variousDatas_SC ON productInfos_SC.id = variousDatas_SC.id SET productInfos_SC.status = IF(' + req.params.for_votes + ' >= ' + req.params.against_votes + ', "ACCEPTED", "REFUSED"), lastVerificationDate = FROM_UNIXTIME(' + req.params.lastVerificationDate + ') WHERE variousDatas_SC.product_code = ' + req.params.product_code + ' AND (productInfos_SC.status = "NEW" OR productInfos_SC.status = "IN_MODIFICATION");';
    insertFunction(query, res);
  });

  router.put('/verification/:product_code/:lastVerificationDate', async (req, res, next) => {
    const query = 'UPDATE productInfos_SC INNER JOIN variousDatas_SC ON productInfos_SC.id = variousDatas_SC.id SET lastVerificationDate = FROM_UNIXTIME(' + req.params.lastVerificationDate + ') WHERE variousDatas_SC.product_code = ' + req.params.product_code + ' AND productInfos_SC.status = "ACCEPTED";';
    insertFunction(query, res);
  });

  router.put('/accepted_to_modified/:product_code', async (req, res, next) => {
    const query = 'UPDATE productInfos_SC INNER JOIN variousDatas_SC ON productInfos_SC.id = variousDatas_SC.id SET lastVerificationDate = NULL, productInfos_SC.status = "MODIFIED" WHERE variousDatas_SC.product_code = ' + req.params.product_code + ' AND productInfos_SC.status = "ACCEPTED";';
    insertFunction(query, res);
  });

  router.get('/votable_products/', async (req, res, next) => {
    db.query("SELECT *, UNIX_TIMESTAMP(start_date) as start_date_timestamp, UNIX_TIMESTAMP(end_date) as end_date_timestamp FROM productInfos_SC INNER JOIN variousDatas_SC ON productInfos_SC.id = variousDatas_SC.id INNER JOIN labels_SC ON productInfos_SC.id = labels_SC.id INNER JOIN nutriments_SC ON productInfos_SC.id = nutriments_SC.id INNER JOIN additives_SC ON productInfos_SC.id = additives_SC.id INNER JOIN ingredients_SC ON productInfos_SC.id = ingredients_SC.id WHERE status = 'NEW' OR status = 'IN_MODIFICATION';",
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).json({status: 'error', error: error});
        } else {
          res.status(200).json(results);
        }
      })

  });

  router.get('/get_alternative_voter_for_product/:user_address/:product_code', async (req, res, next) => {
    db.query('SELECT * FROM Voters_SC WHERE product_code = ' + req.params.product_code + ' AND address =  ' + req.params.user_address + ' AND type = "Alternative";',
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).json({status: 'error', error: error});
        } else {
          res.status(200).json(results);
        }
      })

  });

  router.get('/get_product/:product_code', async (req, res, next) => {
    db.query("SELECT * FROM variousDatas_SC INNER JOIN productInfos_SC ON productInfos_SC.id = variousDatas_SC.id WHERE status = 'ACCEPTED' AND product_code = " + req.params.product_code + "; ",
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).json({status: 'error', error: error});
        } else {
          res.status(200).json(results);
        }
      })

  });

  router.get('/get_alternatives/:product_code', async (req, res, next) => {
    db.query("SELECT * FROM (SELECT prod2.product_code, prod2.product_name, alt.for_votes, alt.against_votes, productInfos_SC.status FROM alternatives_SC as alt INNER JOIN variousDatas_SC as prod1 ON prod1.product_code = alt.product_code_target INNER JOIN variousDatas_SC as prod2 ON prod2.product_code = alt.product_code_alternative INNER JOIN productInfos_SC ON productInfos_SC.id = prod2.id WHERE prod1.product_code = " + req.params.product_code + " AND (productInfos_SC.status = 'ACCEPTED' OR productInfos_SC.status = 'IN_MODIFICATION') ORDER BY FIELD(productInfos_SC.status, 'ACCEPTED', 'IN_MODIFICATION')) as d GROUP BY d.product_name, d.product_code, d.for_votes;",
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).json({status: 'error', error: error});
        } else {
          res.status(200).json(results);
        }
      })

  });

  router.get('/votable_products/:inputType/:inputValue/:alphabetical_name/:date_order', async (req, res, next) => {
    let query = "SELECT *, UNIX_TIMESTAMP(start_date) as start_date_timestamp, UNIX_TIMESTAMP(end_date) as end_date_timestamp FROM productInfos_SC INNER JOIN variousDatas_SC ON productInfos_SC.id = variousDatas_SC.id INNER JOIN labels_SC ON productInfos_SC.id = labels_SC.id INNER JOIN nutriments_SC ON productInfos_SC.id = nutriments_SC.id INNER JOIN additives_SC ON productInfos_SC.id = additives_SC.id INNER JOIN ingredients_SC ON productInfos_SC.id = ingredients_SC.id WHERE status = 'NEW' OR status = 'IN_MODIFICATION' ";

    switch (req.params.inputType) {
      case 'productCode':
        query += "AND " + req.params.inputType + " LIKE ";
        break;
      case 'label':
        query += "AND labels_SC." + req.params.inputType + " LIKE ";
        break;
      case 'ingredients':
        query += "AND ingredients_SC." + req.params.inputType + " LIKE ";
        break;
      case 'product_type':
        query += "AND variousDatas_SC." + req.params.inputType + " LIKE ";
        break;
      case 'product_name':
        query += "AND variousDatas_SC." + req.params.inputType + " LIKE ";
        break;
    }

    if (req.params.inputValue !== '*') {
      query += "'%" + req.params.inputValue + "%' ";
    } else {
      query += "'%'";
    }

    if (req.params.alphabetical_name === true) {
      query += "AND ORDER BY product_name ASC";
    }

    if (req.params.date_order === true) {
      query += "AND ORDER BY end_date ASC";
    }

    query += ';';


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


  router.get('/accepted_products/', async (req, res, next) => {
    db.query("SELECT *, UNIX_TIMESTAMP(start_date) as start_date_timestamp, UNIX_TIMESTAMP(end_date) as end_date_timestamp FROM productInfos_SC INNER JOIN variousDatas_SC ON productInfos_SC.id = variousDatas_SC.id INNER JOIN labels_SC ON productInfos_SC.id = labels_SC.id INNER JOIN nutriments_SC ON productInfos_SC.id = nutriments_SC.id INNER JOIN additives_SC ON productInfos_SC.id = additives_SC.id INNER JOIN ingredients_SC ON productInfos_SC.id = ingredients_SC.id WHERE (status = 'ACCEPTED' OR status = 'MODIFIED') ORDER BY FIELD(status, 'ACCEPTED', 'MODIFIED'), end_date ASC;",
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).json({status: 'error', error: error});
        } else {
          res.status(200).json(results);
        }
      })

  });

  router.get('/accepted_products/:inputType/:inputValue/:alphabetical_name/:date_order', async (req, res, next) => {
    let query = "SELECT *, UNIX_TIMESTAMP(start_date) as start_date_timestamp, UNIX_TIMESTAMP(end_date) as end_date_timestamp FROM productInfos_SC INNER JOIN variousDatas_SC ON productInfos_SC.id = variousDatas_SC.id INNER JOIN labels_SC ON productInfos_SC.id = labels_SC.id INNER JOIN nutriments_SC ON productInfos_SC.id = nutriments_SC.id INNER JOIN additives_SC ON productInfos_SC.id = additives_SC.id INNER JOIN ingredients_SC ON productInfos_SC.id = ingredients_SC.id WHERE (status = 'ACCEPTED' OR status = 'MODIFIED') ";

    switch (req.params.inputType) {
      case 'product_code':
        query += "AND " + req.params.inputType + " LIKE ";
        break;
      case 'label':
        query += "AND labels_SC." + req.params.inputType + " LIKE ";
        break;
      case 'ingredients':
        query += "AND ingredients_SC." + req.params.inputType + " LIKE ";
        break;
      case 'product_type':
        query += "AND variousDatas_SC." + req.params.inputType + " LIKE ";
        break;
      case 'product_name':
        query += "AND variousDatas_SC." + req.params.inputType + " LIKE ";
        break;
    }

    if (req.params.inputValue !== '*') {
      query += "'%" + req.params.inputValue + "%' ";
    } else {
      query += "'%'";
    }

    if (req.params.alphabetical_name === true) {
      query += "AND ORDER BY product_name ASC";
    }

    if (req.params.date_order === true) {
      query += "AND ORDER BY end_date ASC";
    }

    query += ';';


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


  router.get('/get_product_and_older_version/:product_code', async (req, res, next) => {
    db.query("SELECT *, UNIX_TIMESTAMP(start_date) as start_date_timestamp, UNIX_TIMESTAMP(end_date) as end_date_timestamp FROM productInfos_SC INNER JOIN variousDatas_SC ON productInfos_SC.id = variousDatas_SC.id INNER JOIN labels_SC ON productInfos_SC.id = labels_SC.id INNER JOIN nutriments_SC ON productInfos_SC.id = nutriments_SC.id INNER JOIN additives_SC ON productInfos_SC.id = additives_SC.id INNER JOIN ingredients_SC ON productInfos_SC.id = ingredients_SC.id WHERE (status = 'ACCEPTED' OR status = 'MODIFIED') AND variousDatas_SC.product_code = '" + req.params.product_code + "';",
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).json({status: 'error', error: error});
        } else {
          res.status(200).json(results);
        }
      })

  });

  router.get('/user/:user_address', async (req, res, next) => {
    db.query("SELECT * FROM Users_SC WHERE address = '" + req.params.user_address + "';",
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).json({status: 'error', error: error});
        } else {
          res.status(200).json(results);
        }
      })

  });


  router.get('/get_my_proposals/:user_address', async (req, res, next) => {
    db.query("SELECT *, UNIX_TIMESTAMP(start_date) as start_date_timestamp, UNIX_TIMESTAMP(end_date) as end_date_timestamp FROM productInfos_SC INNER JOIN variousDatas_SC ON productInfos_SC.id = variousDatas_SC.id INNER JOIN labels_SC ON productInfos_SC.id = labels_SC.id INNER JOIN nutriments_SC ON productInfos_SC.id = nutriments_SC.id INNER JOIN additives_SC ON productInfos_SC.id = additives_SC.id INNER JOIN ingredients_SC ON productInfos_SC.id = ingredients_SC.id WHERE (status = 'NEW' OR status = 'IN_MODIFICATION') AND address_proposer = '" + req.params.user_address + "';",
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).json({status: 'error', error: error});
        } else {
          res.status(200).json(results);
        }
      })

  });

  router.delete('/delete_users_SC', async (req, res, next) => {
    insertFunction('DELETE FROM Users_SC', res);
  });

  router.delete('/delete_voters_SC', async (req, res, next) => {
    insertFunction('DELETE FROM Voters_SC', res);
  });

  router.delete('/delete_additives_SC', async (req, res, next) => {
    insertFunction('DELETE FROM additives_SC', res);
  });

  router.delete('/delete_ingredients_SC', async (req, res, next) => {
    insertFunction('DELETE FROM ingredients_SC', res);
  });

  router.delete('/delete_labels_SC', async (req, res, next) => {
    insertFunction('DELETE FROM labels_SC', res);
  });

  router.delete('/delete_nutriments_SC', async (req, res, next) => {
    insertFunction('DELETE FROM nutriments_SC', res);
  });

  router.delete('/delete_variousDatas_SC', async (req, res, next) => {
    insertFunction('DELETE FROM variousDatas_SC', res);
  });

  router.delete('/delete_productInfos_SC', async (req, res, next) => {
    insertFunction('DELETE FROM productInfos_SC', res);
  });

  router.put('/reset_auto_increment_Users', async (req, res, next) => {
    insertFunction('ALTER TABLE Users_SC AUTO_INCREMENT = 1', res);
  });

  router.put('/reset_auto_increment_Voters', async (req, res, next) => {
    insertFunction('ALTER TABLE Voters_SC AUTO_INCREMENT = 1', res);
  });

  router.put('/reset_auto_increment_additives', async (req, res, next) => {
    insertFunction('ALTER TABLE additives_SC AUTO_INCREMENT = 1', res);
  });

  router.put('/reset_auto_increment_ingredients', async (req, res, next) => {
    insertFunction('ALTER TABLE ingredients_SC AUTO_INCREMENT = 1', res);
  });

  router.put('/reset_auto_increment_labels', async (req, res, next) => {
    insertFunction('ALTER TABLE labels_SC AUTO_INCREMENT = 1', res);
  });

  router.put('/reset_auto_increment_nutriments', async (req, res, next) => {
    insertFunction('ALTER TABLE nutriments_SC AUTO_INCREMENT = 1', res);
  });

  router.put('/reset_auto_increment_variousDatas', async (req, res, next) => {
    insertFunction('ALTER TABLE variousDatas_SC AUTO_INCREMENT = 1', res);
  });

  router.put('/reset_auto_increment_productInfos', async (req, res, next) => {
    insertFunction('ALTER TABLE productInfos_SC AUTO_INCREMENT = 1', res);
  });

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


  return router;


}

module.exports = createRouter;
