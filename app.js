'use strict';
const app = require('koa')();
const router = require('koa-router')();
const bodyParser = require('koa-body')();
const fs = require('fs');
const path = require('path');
const extname = path.extname;

const rt = require('rethinkdbdash')({
  db: 'timings'
});

const dbTables = {
  'v1': 'v1_base',
  'v2': 'v2_images',
  'v3': 'v3_gzip',
  'v4': 'v4_cache',
  'v5': 'v5_css',
  'v6': 'v6_js',
  'v7': 'v7_optimum',
  'v8': 'v8_optimum_2'
};

router.get('/timings', function *(next) {
    const path = __dirname + '/data.txt';
    const fstat = yield stat(path);

    if (fstat.isFile()) {
        this.type = extname(path);
        this.body = fs.createReadStream(path);
    } else {
        this.body = this.headers['user-agent'];
    }
});

router.get(
    '/timings/:id',
    function *(next) {
        try {
            this.body = yield rt
                .table( dbTables[this.params.id] )
                .orderBy({index:'time'})
                .run()
                .then(function(result){
                    return result;
                });
        }
        catch(e) {
            this.status = 500;
            this.body = e.message;
        }
        yield next;
    }
);

router.post('/timings', bodyParser, function *(next) {
        yield next;
        // capture posted timing information
        let obj = JSON.parse( Object.keys(this.request.body)[0] );
        // capture the timestamp and user-agent string
        let data = {
            time: new Date(),
            ua: this.headers['user-agent'],
            data: obj
        };
        fs.appendFile('data.txt', JSON.stringify(data) + ',\n', function (err) {
            if (err) throw err;
            this.status = 200;
            this.body = yield render('OK');
        });
    });

router.post('/timings/:id', bodyParser, function *(next) {

        try {
            // get the database table name
            let tableName = dbTables[this.params.id];
            // parse the data object
            let data = JSON.parse( Object.keys(this.request.body)[0] );
            // add a time field: output will be sorted by date/time
            data['time'] = new Date();
            // add user-agent string to identify browser
            data['ua'] = this.headers['user-agent'];
            // insert data into table
            let result = yield rt.table( tableName ).insert( data );
            // send 200 response
            this.status = 200;
            this.body = 'OK';
        }
        catch(e) {
            this.status = 500;
            this.body = e.message;
        }
        yield next;
    });

app.use(router.routes());

if (!module.parent)
    app.listen(3000);

function stat(file) {
    return function (done) {
        fs.stat(file, done);
    };
}
