const mongoose = require('mongoose')

const TransferSchemal = new mongoose.Schema({}, {
    strict: false
})

const Transfer = mongoose.model('Transfer', TransferSchemal)

const uri = 'mongodb://localhost:27017,localhost:27018,localhost:27019/txn';


(async function start() {
    const db = await mongoose.connect(uri, { replicaSet: 'rs', useNewUrlParser: true })
    const data = await Transfer.aggregate([
        // 取出字段数据
        { $project: {
            from: 1,
            to: 1,
            amount: 1,
            // 通过$convert梳理数据，统一数据格式
            time: { $convert: {
                input: '$time',
                to: 'date',
                onError: {
                    $concat: ['Could not convert', { $toString: '$timestamp'}, ' to type date']
                },
                onNull: 'Missing timestamp'
            }}
        }},
        // 去除时间正确的记录
        {
            $match: {
                time: { '$type': 'date'}
            }
        },
        // 一月份统计转账总和，以及次数
        {
            $group: {
                _id: { account: '$from', year: {$year: '$time'}, month: { $month: '$time'} },
                sum: { $sum: '$acount' },
                count: { $sum: 1 }
            }
        }
    ])
    console.log(data);
})()