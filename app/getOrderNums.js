const https = require('https')
exports.getOrderNums = async function (data) {
  var getOrderNums = new Promise((resolve, reject) => {
      var options = {
        "hostname": "esquaredcommunications.infopluswms.com",
        "path": "/infoplus-wms/api/v2.0/order/search?filter=customerOrderNo%20like%20'%25" + data.cwNum + "%25'",
        "method": "GET",
        "headers": {
          "Accept": "application/json",
          "x-cw-usertype": "integrator",
          "API-Key": "DB09B74EEB89D56C5450BD1E8E378190B0E737DDF880754CD47ED839BB149B87",
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
    return await getOrderNums
  }
