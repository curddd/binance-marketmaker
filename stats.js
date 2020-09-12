const Stats = {
    changedPrices: [],
    lookback: 30,
    ticksize: 0.5,
    eventEmitter: null,
    allTrades: [],
    init: function(eventEmitter,lookback,ticksize){
        this.lookback = lookback
        this.ticksize = ticksize
        this.eventEmitter = eventEmitter

        
        this.eventEmitter.on('trade', (trades)=>this.feedTrades(trades))
    },
    reset: function(){
        this.allTrades = []
    },
    
    getStandardDeviation(array){
        let n = array.length
        if(n==0)
            return 0
        avg = 0
        array.forEach(i => avg+=i)
        avg = avg/n

        sum = 0
        array.forEach(i => sum+=(avg-i)**2)
        return Math.sqrt(sum/n)
    },

    getSigma: function(){
        let toLookAt = this.changedPrices.slice(Math.max(this.changedPrices.length-this.lookback,0))
        let sigma = this.getStandardDeviation(toLookAt)
        return sigma/this.ticksize
    },

    feedTrades: function(trades){
        this.allTrades.push(trades)
        trades = this.allTrades.slice(Math.min(2000,this.allTrades.length))
        let lastPrice = 0
        let toSave = []
        trades.forEach((trade)=>{
            let price = parseFloat(trade['p'])
            if(price!=lastPrice){
                toSave.push(price)
            }
            lastPrice = price
        })
        this.changedPrices = toSave
    }
}

module.exports = Stats

/*
1599293817106
{
  e: 'trade',
  E: 1599293817497,
  s: 'LINKUSDT',
  t: 40054208,
  p: '12.57250000',
  q: '58.89000000',
  b: 609516110,
  a: 609516141,
  T: 1599293817496,
  m: true,
  M: true
}
159929381827

*/