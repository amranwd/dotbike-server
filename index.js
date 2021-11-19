const { MongoClient } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();

const ObjectId = require('mongodb').ObjectId;

const port = process.env.PORT || 5000;

// middlewear
app.use(cors());
app.use(express.json());



// Replace the uri string with your MongoDB deployment's connection string.
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.navt1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri);

async function run() {
    try {
        await client.connect();
        const database = client.db('dotBike');
        const productsCollection = database.collection('products');
        const cartsCollection = database.collection('carts');
        const leadsCollection = database.collection('leads');
        const usersCollection = database.collection('users');


        // app.get('/appointments', verifyToken, async (req, res) => {
        //     const email = req.query.email;
        //     const date = req.query.date;

        //     const query = { email: email, date: date }

        //     const cursor = appointmentsCollection.find(query);
        //     const appointments = await cursor.toArray();
        //     res.json(appointments);
        // })

        // app.get('/appointments/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: ObjectId(id) };
        //     const result = await appointmentsCollection.findOne(query);
        //     res.json(result);
        // })


        // get products
        // app.get('/products', async (req, res) => {
        //     const email = req.body.email;
        //     const query = { email: email }
        //     const cursor = productsCollection.find(query);
        //     const products = await cursor.toArray();

        //     res.send(products);
        // })


        // get products
        app.get('/products', async (req, res) => {
            const cursor = productsCollection.find({});
            const products = await cursor.toArray();

            res.send(products);
        })

        // get users email
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }

            res.json({ admin: isAdmin });
        })

        // single prodcut 
        app.get('/products/:id', async (req, res) => {
            const mela_id = req.params.id;
            const query = { _id: ObjectId(mela_id) };
            const meal = await productsCollection.findOne(query);

            res.send(meal);
        })
        // post products
        app.post('/products', async (req, res) => {
            const product = req.body;
            const result = await productsCollection.insertOne(product);
            res.json(result)
        });

        // update products
        app.put('/products/:id', async (req, res) => {
            const id = req.params.id;
            const updateUser = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    title: updateUser.title,
                    description: updateUser.description,
                    price: updateUser.price,
                    img: updateUser.img,

                },
            };
            const result = await productsCollection.updateOne(filter, updateDoc, options);

            res.json(result);
        })

        // delete products
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productsCollection.deleteOne(query);

            res.json(result);
        })

        // cart POST DATA
        app.post('/carts', async (req, res) => {
            const cart = req.body;
            const result = await cartsCollection.insertOne(cart);
            res.send(result)
        });

        app.get('/carts', async (req, res) => {
            const email = req.body.email;
            const query = { email: email };
            const cursor = cartsCollection.find(query);
            const products = await cursor.toArray();

            res.send(products);
            // const cursor = cartsCollection.find({});
            // const products = await cursor.toArray();

            // res.send(products);
        });

        // delete api
        app.delete('/carts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: id };
            const result = await cartsCollection.deleteOne(query);

            res.json(result);
        })


        // post users
        app.post('/users', async (req, res) => {
            const product = req.body;
            const result = await usersCollection.insertOne(product);
            res.json(result)
        });



        // update users
        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.eamil };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, options);

            res.json(result);
        })

        // update users
        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const updateDoc = { $set: { role: 'admin' } };
            const result = await usersCollection.updateOne(filter, updateDoc);

            res.json(result);
        })



        //  post email post
        app.post('/leads', async (req, res) => {
            const lead = req.body;
            const result = await leadsCollection.insertOne(lead);
            res.json(result)
        });



    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Hello World from Dot Bike Server!!')
})

app.listen(port, () => {
    console.log(`DoBike Server listening at http://localhost:${port}`)
})