const QuoteMaker = {
    
    getQuotes: function(inv,A,k,gamma,sigma){
        bid = (1/gamma)*Math.log2(1+gamma/k) + ((2*inv+1)/2) * Math.sqrt(((sigma**2*gamma)/2*k*A)*(1+gamma/k)**(1+k/gamma))
        ask = (1/gamma)*Math.log2(1+gamma/k) - ((2*inv-1)/2) * Math.sqrt(((sigma**2*gamma)/2*k*A)*(1+gamma/k)**(1+k/gamma))
        return {bid:bid, ask:ask}
    }
}

module.exports = QuoteMaker