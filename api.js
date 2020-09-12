
const API = {

    binance: null,
    eventEmitter: null,
    symbol:null,
    init: function(binance, eventEmitter, channels, symbol){
        this.binance = binance
        this.eventEmitter = eventEmitter
        this.symbol = symbol
        this.subscribeChannels(channels)
    },

    subscribeChannels: function(channels){

        if(channels.includes('miniTicker')){
            this.binance.websockets.miniTicker(markets => {
                if(markets[this.symbol] !== undefined){
                    console.log(markets[this.symbol])
                    this.eventEmitter.emit('to_db', this.symbol, 'miniTicker', markets[this.symbol])
                }  
            })
        }
        if(channels.includes('trades')){
            this.binance.websockets.trades([this.symbol], (trades) => {
                //let {e:eventType, E:eventTime, s:symbol, p:price, q:quantity, m:maker, a:tradeId} = trades;
                //console.info(symbol+" trade update. price: "+price+", quantity: "+quantity+", maker: "+maker);
                this.eventEmitter.emit('to_db', this.symbol, 'trade', trades)
                this.eventEmitter.emit('trade', trades)
              });
        }
        if(channels.includes('bookTickers')){
            this.binance.websockets.bookTickers( this.symbol, (ticker)=>{
                this.eventEmitter.emit('to_db', this.symbol, 'bookTickers', ticker)
                this.eventEmitter.emit('bookTicker', ticker)  
            });
        }
    }
}

module.exports = API