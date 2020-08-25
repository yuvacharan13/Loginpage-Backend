const express = require("express");
const mongodb = require('mongodb');
const app = express();
const url = "mongodb://localhost:27017";
const cors = require('cors');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 4040;
var ObjectId = require('mongodb').ObjectID;
var Pusher = require('pusher');
app.use(cors());
app.use(bodyParser.json())

var pusher = new Pusher({
    appId: '1060448',
    key: '9d16191c9e964e53eaa9',
    secret: 'ea372aa3200988b5cbf9',
    cluster: 'ap2',
    encrypted: true
  });
  

app.get('/', async (req,res) => { 
    try {
        res.send("Login Page Task");
    }
    catch (error) {
        res.status(500).json({
            message: "Something Went Wrong"
        })
    }
})

app.get('/fetch', async (req,res) => {
    try{
        const client = await mongodb.connect(url, {useUnifiedTopology: true});
        const db = await client.db("loginpage");
        const data = await db.collection("loginpagedata").find().toArray();
        const data1 = await db.collection("loginpagedata").find();
        console.log(data1);
        await client.close();
        res.json({
            status: data[0]
        })
    }
    catch (error) {
        res.status(500).json({
            message: "Something Went Wrong"
        })
    }
})

app.put('/update/:id', async (req, res) => {
    const status = req.body.status;
    console.log(req.params.id);
    try {
        const client = await mongodb.connect(url, {useUnifiedTopology: true});
        const db = await client.db("loginpage");
        var myquery = { "id": 1 };
        var newvalues = { $set: status  };
        const data = await db.collection("loginpagedata").updateOne(myquery,newvalues);
        pusher.trigger('my-channel', 'my-event', {
            status
          });
        await client.close();
        res.json({
            message: "added"
        })
        console.log(req.params.id);
        console.log(status)
    } catch (err) {
        res.json({
            message: err.message
        })
    }
})


app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});