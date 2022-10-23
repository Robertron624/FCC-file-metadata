var express = require('express');
var cors = require('cors');
require('dotenv').config()
const bodyParser = require('body-parser');
const  fileUpload = require('express-fileupload');
const morgan = require('morgan');
const _ = require("lodash")

var app = express();

app.use(cors());
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(morgan("dev"))

app.use(fileUpload({
  createParentPath: true
}))

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

/*
Response object: 

{
  "name": "174857.png",
  "type": "image/png",
  "size": 5823
}

*/

app.post("/api/fileanalyse",(req, res) => {
  try{
    if(!req.files){
      res.send({
        status: false,
        message: "No file uploaded"
      })
    }
    else{

      let image = req.files.upfile

      image.mv('./uploads/' + image.name)

      res.send({
          name: image.name,
          type: image.mimetype,
          size: image.size
      })
    }
  }
  catch(err){
    console.log("ERROR -> ", err)
    res.status(500).send({error: err})
  }
})


const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});
