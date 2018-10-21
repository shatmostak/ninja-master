exports.listener = async function (res, req) {
  var listener = new Promise((resolve, reject) => {
    var ret = req.body
    var ren = JSON.parse(ret.Entity)
    resolve({
      cwNum: ret.ID,
      siteName: ren.siteName
    })
    reject('Error, not a valid ConnectWise Number')
  })
  return await listener
}
