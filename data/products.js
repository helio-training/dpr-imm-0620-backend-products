// Import Mongo Connection Package(s)
// const MongoClient = require('mongodb').MongoClient;
// const ObjectID = require('mongodb').ObjectID;
const { ObjectID, MongoClient } = require('mongodb'); // Alternative to above
const assert = require('assert');

// Setup Database Objects
const url = process.env.DB_URL;
const db_name = process.env.DB_NAME;
const col_name = process.env.COL_NAME;
const options = {
    useUnifiedTopology: true
}

const readProducts = () => {
    const iou = new Promise((resolve, reject) => {
        MongoClient.connect(url, options, (err, client) => {
            assert.equal(err, null);

            const db = client.db(db_name);
            const collection = db.collection(col_name);
            collection.find({}).toArray((err, docs) => {
                assert.equal(err, null);
                resolve(docs);
                client.close();
            })
        });
    });
    return iou;
}

const readProductByID = (id) => {
    const iou = new Promise((resolve, reject) => {
        MongoClient.connect(url, options, (err, client) => {
            assert.equal(err, null);

            const db = client.db(db_name);
            const collection = db.collection(col_name);
            collection.find({ _id: new ObjectID(id) }).toArray((err, docs) => {
                assert.equal(err, null);
                resolve(docs[0]);
                client.close();
            })
        });
    });
    return iou;
}

const createProduct = (product) => {
    const iou = new Promise((resolve, reject) => {
        MongoClient.connect(url, options, (err, client) => {
            assert.equal(err, null);
            const db = client.db(db_name);
            const collection = db.collection(col_name);
            collection.insertOne(product, (err, result) => {
                assert.equal(err, null);
                resolve(result.ops[0]);
                client.close();
            });
        });
    });
    return iou;
}

const upsertProduct = (id, product) => {
    const iou = new Promise((resolve, reject) => {
        MongoClient.connect(url, options, (err, client) => {
            assert.equal(err, null);
            const db = client.db(db_name);
            const collection = db.collection(col_name);
            collection.findAndModify({ _id: new ObjectID(id) },
                null,
                { $set: { ...product } },
                { upsert: true },
                (err, result) => {
                    assert.equal(err, null);
                    readProductByID(id)
                        .then(product => resolve(product))
                        .then(() => client.close());
                }
            );
        });
    });
    return iou;
}

module.exports = {
    readProducts, // With Syntactic Sugar
    // readProducts : readProducts, // Without Syntactic Sugar
    createProduct,
    upsertProduct,
}