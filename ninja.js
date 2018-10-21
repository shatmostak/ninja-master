const https = require('https')
const http = require('http')
const express = require('express')
const bodyParser = require('body-parser')
const port = process.env.PORT || 3001

var app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.listen(port, () => {
  console.log('server up on ' + port)
})
app.get('/',function(req, res){
})
app.post('/',function(req, res){
  //to-do write an error code back to cw on errors, probably 500 or 400something
  res.writeHead(200, {"Content-Type": "text/html"})
  res.end('Thanks')
  //#todo break this into app file
  const ninja = async function() {
    var listener = new Promise((resolve, reject) => {
      var ret = req.body
      var ren = JSON.parse(ret.Entity)
      resolve({
        cwNum: ret.ID,
        siteName: ren.siteName
      })
      reject('Error, not a valid ConnectWise Number')
    })
    var getIpNum = (data) => {
       return new Promise((resolve, reject) => {
         https://esquaredcommunications.infopluswms.com/infoplus-wms/api/v2.0/order/search?filter=customerOrderNo%20like%20'%25598862%25'

        var options = {
          "hostname": "esquaredcommunications.infopluswms.com",
          "path": "/infoplus-wms/api/v2.0/order/search?filter=customerOrderNo%20like%20'%25" + data.cwNum + "%25'",
          "method": "GET",
          "headers": {
            "Accept": "application/json",
            "x-cw-usertype": "integrator",
            "API-Key": "8235E84358CE290DFBE6B8197875E5A46D0E143CA02722351F919222439D96EE",
            "Cache-Control": "no-cache",
            "Content-Type": "application/json"
          }
        }
        var req = https.request(options, function (res) {
          var chunks = []
          res.on("data", function (chunk) {
            chunks.push(chunk)
          })
          res.on("end", function () {
            var body = Buffer.concat(chunks)
            var order = JSON.parse(body.toString())
            data.orderNums = []
            for (i=0; i<order.length; i++) {
              data.orderNums.push(order[i].orderNo)
            }
            resolve(data)
            reject("No Paired InfoPlus Order")
          })
        })
        req.write(JSON.stringify({ id: 0,
          description: 'maxLength = 100',
          url: 'Sample string',
          objectId: 0,
          type: 'Sample string',
          level: 'Sample string',
          memberId: 0,
          inactiveFlag: 'false' }))
          req.end()
      })
    }
    var getShipInfos = (data) => {
      data.shipInfos = []
      return new Promise((resolve, reject) => {
        data.orderNums.forEach(function (order) {
         var options = {
           "hostname": "esquaredcommunications.infopluswms.com",
           "path": "/infoplus-wms/api/v2.0/parcelShipment/search?filter=orderNo%20eq%20" + order,
           "method": "GET",
           "headers": {
             "Accept": "application/json",
             "x-cw-usertype": "integrator",
             "API-Key": "8235E84358CE290DFBE6B8197875E5A46D0E143CA02722351F919222439D96EE",
             "Cache-Control": "no-cache",
             "Content-Type": "application/json"
           }
         }
         var req = https.request(options, function (res) {
           var chunks = []
           res.on("data", function (chunk) {
             chunks.push(chunk)
           })
           res.on("end", function () {
             body = Buffer.concat(chunks)
             var ship = JSON.parse(body.toString())

             for (i=0; i<ship.length; i++) {
               data.shipInfos.push(ship[i])
             }

             if (data.shipInfos === undefined || data.shipInfos.length === 0) {
               reject("No Ship Info")
             }
             resolve(data)
           })
         })
         req.write(JSON.stringify({ id: 0,
          description: 'maxLength = 100',
          url: 'Sample string',
          objectId: 0,
          type: 'Sample string',
          level: 'Sample string',
          memberId: 0,
          inactiveFlag: 'false' }))
          req.end()
        })
      })
    }

    var getProductIds = (data) => {
       return new Promise((resolve, reject) => {
         var options = {
           "hostname": "connect.e2cc.com",
           "path": "/v4_6_release/apis/3.0/service/tickets/" + data.cwNum + "/products",
           "method": "GET",
           "headers": {
             "Accept": "application/json",
             "x-cw-usertype": "integrator",
             "Authorization": "Basic RVNRVUFSRUQrdXJURzFVN0RjNWVCYnVoNTpCaEEzdU1PY05sR0pwUGlH",
             "Cache-Control": "no-cache",
             "Content-Type": "application/json"
           }
         }
         var req = https.request(options, function (res) {
           var chunks = []
           res.on("data", function (chunk) {
             chunks.push(chunk)
           })
           res.on("end", function () {
            body = Buffer.concat(chunks)
            productIds = JSON.parse(body.toString())
            data.productIds = []
            let productDescrips = []
            for (i=0; i<productIds.length; i++) {
               data.productIds.push(productIds[i].id)
               productDescrips.push(productIds[i].description)
            }
            for (i=0; i<data.shipInfos.length; i++) {
              if (!data.shipInfos[i].chargedFreightAmount) {
                data.orderNums.splice(i,1)
                data.shipInfos.splice(i,1)
              }
            }

            function exists(elem) {
              return elem.includes("Shipping")
            }
            var doneShipInfos = productDescrips.filter(exists)
            if (data.shipInfos === undefined || data.shipInfos.length === 0) {
              reject("get product call failed")
            } else if (data.shipInfos.length === doneShipInfos.length) {
              reject("stopping, ship costs already done on this ticket")
            } else {
              resolve(data)
            }
            })
         })
         req.write(JSON.stringify({ id: 0,
          description: 'maxLength = 100',
          url: 'Sample string',
          objectId: 0,
          type: 'Sample string',
          level: 'Sample string',
          memberId: 0,
          inactiveFlag: 'false' }))
          req.end()
        })
    }
    var post = (data) => {
      //start of sequenceget
      const productIds = data.productIds

      function asyncFunctionCall (productId) {
        return new Promise(resolve => {
          var options = {
            "hostname": "connect.e2cc.com",
            "path": "/v4_6_release/apis/3.0/procurement/products/" + productId,
            "method": "GET",
            "headers": {
              "Accept": "application/json",
              "x-cw-usertype": "integrator",
              "Authorization": "Basic RVNRVUFSRUQrdXJURzFVN0RjNWVCYnVoNTpCaEEzdU1PY05sR0pwUGlH",
              "Cache-Control": "no-cache",
              "Content-Type": "application/json"
            }
          };
          var req = https.request(options, function (res) {
            var chunks = [];

            res.on("data", function (chunk) {
              chunks.push(chunk);
            });

            res.on("end", function () {
              var body = Buffer.concat(chunks);
              var ticket = JSON.parse(body.toString());
              resolve(ticket.sequenceNumber);
            });
          });
          req.write(JSON.stringify({ id: 0,
            description: 'maxLength = 100',
            url: 'Sample string',
            objectId: 0,
            type: 'Sample string',
            level: 'Sample string',
            memberId: 0,
            inactiveFlag: 'false'
          }));
          req.end();
        });
      }

      function write(productIds) { // gets called one after another
        const promises = []
        productIds.forEach(productId => promises.push(asyncFunctionCall(productId)))
        return Promise.all(promises);
      }

      let p = Promise.resolve();
      p = p.then(() => {
        return write(productIds);
      });

      p.then((num) => {
        let seqNum = Math.max(...num) + 1
        for (i=0; i<data.shipInfos.length; i++) {

          var options = {
             "hostname": "connect.e2cc.com",
             "path": "/v4_6_release/apis/3.0/procurement/products",
             "method": "POST",
             "headers": {
               "Accept": "application/json",
               "x-cw-usertype": "integrator",
               "Authorization": "Basic RVNRVUFSRUQrdXJURzFVN0RjNWVCYnVoNTpCaEEzdU1PY05sR0pwUGlH",
               "Cache-Control": "no-cache",
               "Content-Type": "application/json"
             }
           }
           var req = https.request(options, function (res) {
             var chunks = []

             res.on("data", function (chunk) {
               chunks.push(chunk)
             })

             res.on("end", function () {
               body = Buffer.concat(chunks)
               var result = JSON.parse(body.toString())
             })
           })
           req.write(JSON.stringify(
             {
             catalogItem: {
                  "id": 760,
                  "identifier": "Shipping",
                  "_info": {
                      "catalog_href": "https://connect.e2cc.com/v4_6_release/apis/3.0/procurement/catalog/760`"
                  }
                },
              ticket: {
                    "id": data.cwNum,
                    "summary": "Shipping",
                    "_info": {
                        "ticket_href": "https://connect.e2cc.com/v4_6_release/apis/3.0/service/tickets/" + data.cwNum,
                    }
                  },
             description: 'Shipping Cost for IP order ' + data.orderNums[i],
             sequenceNumber: seqNum + i,
             quantity: 1,
             price: (data.shipInfos[i].chargedFreightAmount + 1) + ((data.shipInfos[i].chargedFreightAmount + 1)/4),
             cost: 0,
             discount: 0,
             billableOption: 'Billable',
             locationId: 2,
             businessUnitId: 15,
             taxableFlag: false,
             dropshipFlag: false,
             specialOrderFlag: false,
             phaseProductFlag: false,
             cancelledFlag: false,
             quantityCancelled: 0,
             customerDescription: "Carrier :" + data.shipInfos[i].parcelAccountNo.replace(/[0-9]/g, '') + " " + "Tracking Number: " + data.shipInfos[i].trackingNo + " " + "Site: " + data.siteName,
             productSuppliedFlag: false,
             subContractorAmountLimit: 0,
             warehouse: 'eSquared Office Ste J-17',
             warehouseBin: 'Tempe Office Ste J-17',
             listPrice: 0,
             company:
              { id: 2,
                identifier: 'eSquared',
                name: 'eSquared Communications Consulting',
                _info: { company_href: 'https://connect.e2cc.com/v4_6_release/apis/3.0/company/companies/2' } },
             productClass: 'Agreement',
             needToPurchaseFlag: false,
             _info: { lastUpdated: '2018-08-25T19:41:04Z', updatedBy: 'mshostak' } }))
           req.end()
         }
      })


     }
     let data = await listener
     data = await getIpNum(data)
     data = await getShipInfos(data)
     data = await getProductIds(data)
     post(data)
     console.log(data);
   }()
   ninja.then((data) => {
     console.log('completed')
   }).catch((e) => {
     console.log(e)
   })
 })
