const express = require('express');
const cors = require('cors');

const port = process.env.PORT || 5000;

const app = express()


//middleWares
app.use(cors())
app.use(express.json())

//dotenv
require('dotenv').config()

//jwt
let jwt = require('jsonwebtoken');

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oth2isl.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect(); //todo remove when deploy to vercel

        const eventsCollection = client.db('volunteer-network').collection('events')

        //jwt
        //access token generating
        app.post('/jwt', (req,res)=>{
            const user = req.body;
            const token = jwt.sign(user,process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1h'})
            res.send({token});
        })


        // event CRUD 

        //READ (get) all data
        app.get('/events', async (req, res) => {
            const result = await eventsCollection.find({}).toArray()
            res.send(result);
        })









        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);










app.get('/', (req, res) => {
    res.send('volunteer network running')
})


app.listen(port, () => {
    console.log(`volunteer network running at port ${port}`);
})










