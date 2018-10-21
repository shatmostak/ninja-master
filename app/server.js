//declarations and requirements
//rest api related requires
const https = require('https')
const http = require('http')
const bodyParser = require('body-parser')

//modularization related requires
const path = require('path')
const listener = require('./listener.js')
const getOrderNums = require('./getOrderNums.js')

//server related requires and setup
const express = require('express')
const port = process.env.PORT || 3000
const app = express()

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.listen(port, () => {
  console.log('server up on ' + port)
})
app.get('/',function(req, res){
})

//listening for cw webhook sent to us on status
app.post('/',function(req, res){
  //to-do write an error code back to cw on errors, probably 500 or 400something
  res.writeHead(200, {"Content-Type": "text/html"})
  res.end('Thanks')
  const ninja = async function() {
    //listener was here
    let data = await listener.listener(res, req)
    data = await getOrderNums.getOrderNums(data)
    data = await getShipInfos.getShipInfos(data)
    console.log(data);
    // data = await getProductIds(data)
    // post(data)
  }()
  ninja.then((data) => {
    console.log('completed')
  }).catch((e) => {
    console.log(e)
  })
})
