const expressjwt = require('express-jwt')

function authjwt() {
  const secret = process.env.secret
  return expressjwt({
    secret,
    algorithms: ['HS256'],
  }).unless({
    //non token urls
    path: [
      { url: /\/api\/product(.*)/, methods: ['GET', 'OPTIONS'] }, //regx url for multiurl
      { url: /\/api\/category(.*)/, methods: ['GET', 'OPTIONS'] },
      { url: /\/api\/reset/, methods: ['POST', 'OPTIONS'] }, 
      { url: /\/api\/customer/, methods: ['POST', 'OPTIONS'] }, 
      '/api/staff/login',
      '/api/customer/login',
      // { url: /(.*)/ }, //all urls
    ],
  })
}

module.exports = authjwt
