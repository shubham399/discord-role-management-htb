const redisURL = process.env.REDIS_URL;
var redis = require("redis");
const client = redis.createClient(redisURL);

const set = function(key, value) {
  return client.set(key, value, redis.print);
}
const setex = function (key,value,ttl){
return client.set(key, value, 'EX', ttl);
}
const get = function(key, cb) {
  client.get(key, cb);
}
const clean = () =>{
  client.end(true);
}

exports.redis = client;
exports.set = set;
exports.get = get;
exports.setex = setex;
exports.clean = clean;
