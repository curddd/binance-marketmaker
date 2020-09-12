const sqlite3 = require('sqlite3').verbose()


const Database = {

    eventEmitter: null,
    db: null,
    init: function(eventEmitter, playback=false){
        this.eventEmitter = eventEmitter
        if(!playback)
            this.db = new sqlite3.Database('./store.db')
        else
            this.db = new sqlite3.Database('./playback.db')
        this.createTables()
        this.eventEmitter.on('to_db', (symbol, table, data)=>{
            this.insertData(symbol,table,data)
        })
    
    },
    createTables: function(){
        this.db.run("CREATE TABLE IF NOT EXISTS raw_data(id INTEGER PRIMARY KEY AUTOINCREMENT,"
        + "symbol TEXT,"
        + "table_name TEXT,"
        + "raw_data TEXT,"
        + "timestamp REAL)")
    },

    insertData: function(symbol, table, data){
        timestamp = Date.now()
        this.db.run("INSERT INTO raw_data(symbol,table_name,raw_data,timestamp) VALUES(?,?,?,?)", 
        [symbol,table, JSON.stringify(data), timestamp])
        console.log(timestamp)
    },
    
    playbackAll: function(symbol, tables){
        sql = "SELECT * FROM raw_data WHERE symbol LIKE ? ORDER BY timestamp ASC"
        let i = 0
        this.db.each(sql, [symbol], (err, row)=>{

            let data = JSON.parse(row.raw_data)

            switch(row.table_name){
                case 'bookTickers':
                    this.eventEmitter.emit('bookTicker', data)  
                    break
                case 'trade':
                    this.eventEmitter.emit('trade', data)
                    break
            }
            if(i%10000 == 0 )
                this.eventEmitter.emit('db_finish')
            i++
        })
    }
}

module.exports = Database