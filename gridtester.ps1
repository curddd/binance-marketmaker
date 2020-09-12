
For($A=0.1; $A -lt 0.2; $A=$A+0.02){
    For($k=0.01; $k -lt 0.02; $k=$k+0.02){
        For($sigma=0.005; $sigma -lt 0.011; $sigma=$sigma+0.002){
            node backtester.js $A $k $sigma
        }
    }
}