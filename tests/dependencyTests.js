'use strict'

const Buffer = require('safe-buffer').Buffer
const cnUtil = require('turtlecoin-cryptonote-util')
const multiHashing = require('turtlecoin-multi-hashing')
const assert = require('assert')

// turtlecoin-multi-hashing tests

const testData = new Buffer('0100fb8e8ac805899323371bb790db19218afd8db8e3755d8b90f39b3d5506a9abce4fa912244500000000ee8146d49fa93ee724deb57d12cbc6c6f3b924d946127c7a97418f9348828f0f02', 'hex')

var cryptonight_v0 = new Buffer('1b606a3f4a07d6489a1bcd07697bd16696b61c8ae982f61a90160f4e52828a7f', 'hex')
var cryptonight_v1 = new Buffer('c9fae8425d8688dc236bcdbc42fdb42d376c6ec190501aa84b04a4b4cf1ee122', 'hex')
var cryptonight_lite_v0 = new Buffer('28a22bad3f93d1408fca472eb5ad1cbe75f21d053c8ce5b3af105a57713e21dd', 'hex')
var cryptonight_lite_v1 = new Buffer('87c4e570653eb4c2b42b7a0d546559452dfab573b82ec52f152b7ff98e79446f', 'hex')

var cn_v0_hash = multiHashing['cryptonight'](testData)
var cn_v1_hash = multiHashing['cryptonight'](testData, 1)
var cn_lite_v0_hash = multiHashing['cryptonight-lite'](testData, 0)
var cn_lite_v1_hash = multiHashing['cryptonight-lite'](testData, 1)

console.log('[#1] Cryptonight v0: ', cn_v0_hash.toString('hex'))
console.log('[#2] Cryptonight v1: ', cn_v1_hash.toString('hex'))
console.log('[#3] Cryptonight Lite v0: ', cn_lite_v0_hash.toString('hex'))
console.log('[#4] Cryptonight Lite v1: ', cn_lite_v1_hash.toString('hex'))

assert.deepEqual(cryptonight_v0, cn_v0_hash)
assert.deepEqual(cryptonight_v1, cn_v1_hash)
assert.deepEqual(cryptonight_lite_v0, cn_lite_v0_hash)
assert.deepEqual(cryptonight_lite_v1, cn_lite_v1_hash)

// turtlecoin-cryptonote-util tests

const validAddressPrefix = 3914525
const address = new Buffer('TRTLuxN6FVALYxeAEKhtWDYNS9Vd9dHVp3QHwjKbo76ggQKgUfVjQp8iPypECCy3MwZVyu89k1fWE2Ji6EKedbrqECHHWouZN6g')

var addressPrefix = cnUtil.address_decode(address)

console.log('[#5] Address Prefix: ', addressPrefix)

assert.deepEqual(validAddressPrefix, addressPrefix)