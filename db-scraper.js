const Binance = require('node-binance-api');
const EventEmitter = require('events')

const API = require('./api')
const Database = require('./database');



const binance = new Binance().options();
const emitter = new EventEmitter()

Database.init(emitter)
API.init(binance,emitter,['bookTickers', 'trades'],"LINKUSDT")
