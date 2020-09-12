const EventEmitter = require('events')

const Database = require('./database')
const Quote = require('./quote-maker')
const Stats = require('./stats')

const emitter = new EventEmitter()

let A = 1
let k = 0.01
let gamma = 0.005
let sigma = 3
let ticksize = 0.0001
let symbol = 'LINKUSDT'

let money = 0
let inventory = 0
let ask = null
let bid = null
let askv = 0
let bidv = 0
let quoteSize = 1
let fee = 0.001
let feesPaid = 0

let lastTicker = null

function resetStats(){
    money = 0
    inventory = 0
    ask = null
    bid = null
    askv = 0
    bidv = 0
    feesPaid = 0
}

function dumpStats(){
    let tmp = {
        A: A,
        k: k,
        gamma: gamma,
        worth: money+inventory*bid,
        inv: inventory,
        feesPaid: feesPaid
    }
    if(true || tmp.worth > 0)
        console.log(tmp)
}

function processTicker(ticker){
    if(lastTicker!=null && (lastTicker.bestBid==ticker.bestBid && lastTicker.bestAsk == ticker.bestAsk))
        return
    lastTicker = ticker
    
    sigma = Stats.getSigma()
    sigma = 100
    let quote = Quote.getQuotes(inventory, A, k, gamma,sigma)
    let mid = (parseFloat(ticker.bestAsk)+parseFloat(ticker.bestBid))/2
    bid = mid - quote.bid*ticksize
    ask = mid + quote.ask*ticksize
    bidv = askv = quoteSize

}


function processTrade(trade){
    let traded = false

    if(bidv > 0 && trade.p < bid){
        let bought = Math.max(trade.q, bidv)
        money -= bought * bid
        inventory += bought
        bidv -= bought
        traded = true
        feesPaid += bought * bid * fee
    }
    if(askv > 0 && trade.p > ask){
        let sold = Math.max(trade.q, askv)
        money += sold * ask
        inventory -= sold
        askv -= sold
        traded = true
        feesPaid += sold * ask * fee
    }
}

emitter.on('trade', (trade)=>{
    processTrade(trade)
})

emitter.on('bookTicker', (ticker)=>{
    processTicker(ticker)
})

emitter.on('db_finish', ()=>{
    //console.log(inventory*bid+money, money, inventory, feesPaid)
    dumpStats()
})


/*
console.log(12*fee)
for(let i=0; i<=10; i++){
    let quotes = Quote.getQuotes(i, A,k,gamma,100)
    console.log(quotes.bid*ticksize, quotes.ask*ticksize, (quotes.ask+quotes.bid)*ticksize)
}
*/


let myArgs = process.argv.slice(2);
A = myArgs[0]
k = myArgs[1]
gamma = myArgs[2]

Stats.init(emitter, 30, ticksize)
Database.init(emitter, true)
Database.playbackAll('LINKUSDT', [])

