const express = require('express');
const router = express.Router();
const {
    readProducts,
    createProduct, 
    upsertProduct
} = require('../../data/products');

/* GET Product listing. */
router.get('/', (req, res, next) => {
    readProducts().then(data => {
        res.send(data);
    });
});

/* POST Product creation. */
router.post('/', (req, res, next) => {
    const body = req.body;
    createProduct(body).then(data => {
        res.send(data);
    });
});

/* PUT Product upsert. */
router.put('/:id', (req, res, next) => {
    const body = req.body;
    const id = req.params.id;
    upsertProduct(id, body).then(data => {
        res.send(data);
    });
});

module.exports = router;
