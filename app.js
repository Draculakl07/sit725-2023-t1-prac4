var createError = require('http-errors');
var express = require('express');
var path = require('path');
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://admin:admin@cluster1.k2sdsy1.mongodb.net/?retryWrites=true&w=majority";
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const port = process.env.PORT;
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

//mongodb setup
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let collection; // Declare collection in the global scope

async function runDB() {
    try {
      await client.connect();
      collection = client.db().collection('Cats');
    } catch(err) {
        console.error(err)
    }
}




function insertCat(cat,callback){
  collection.insertOne(cat,callback);
}



app.listen(port,()=>{
  console.log("App listening to : " ,port)
  runDB().catch(console.dir);
})

app.get('/', (req, res, next) => {
  getAllCats((err, cards) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error occurred');
    }
    res.render('index', { cards });
  })
})

app.post('/api/cat',(req,res,next) =>{
  let cat = req.body;
  //console.log(cat)
  insertCat(cat,(err,result) =>{
      if(!err){
          res.json({statusCode:201,data:result,messsage:'success'})
      }
  })
})

function getAllCats(callback){
  collection.find({}).toArray(callback);
}

app.get('/api/cat',(req,res,next)=>{
  getAllCats((err,result) =>{``
      //console.log(result)
      if(!err){
          cardList = result;
          //console.log(cardList)
          res.json({statusCode:200,data:result,message:'success'})
      }
  })
});

module.exports = app;
