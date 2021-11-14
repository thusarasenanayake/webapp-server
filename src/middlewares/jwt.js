const expressjwt = require('express-jwt');

function authjwt(){
    const secret = process.env.secret;
    return expressjwt({
        secret,
        algorithms: ['HS256'],
        isRevoked: isRevoked    //expressjwt method for check user's role
    }).unless({
        //non token urls
        path:[
            // {url:/\/api\/product(.*)/, methods:[ 'GET', 'OPTIONS']},    //regx url for multiurl
            // {url:/\/api\/category(.*)/, methods:[ 'GET', 'OPTIONS']},   //regx url for multiurl
            // '/api/users/login',
            // '/api/users',
            {url:/(.*)/,}
        ]
    })
}
async function isRevoked(req, payload, done){
    if(!payload.isAdmin){
        done(null,true)
    }
        done();
}
module.exports = authjwt;