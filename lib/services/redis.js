'use strict'
const redisURL = process.env.REDIS_URL
const redis = require('redis')
const bluebird = require('bluebird')
bluebird.promisifyAll(redis)
const client = redis.createClient(redisURL)

const set = (key, value) => client.set(key, value, redis.print)
const setex = (key, value, ttl) => client.set(key, value, 'EX', ttl)
const get = key => client.getAsync(key)
const clean = () => client.end(true)

exports.redis = client
exports.set = set
exports.get = get
exports.setex = setex
exports.clean = clean
