const initData = [
    { time: new Date(), from: 'A', to: 'B', amount: 20 },
    { time: '2018-02-01 10:10:10', from: 'B', to: 'A', amount: 10 },
    { time: 1533780213184, from: 'A', to: 'B', amount: 50 },
    { time: new Date('2012-11-02'), from: 'A', to: 'B', amount: 5 },
    { time: 'not a date', from: 'B', to: 'A', amount: 20 },
    { time: null, from: 'A', to: 'B', amount: 20 }
]

const mongoose = require('mongoose')

const TransferSchemal = new mongoose.Schema({}, {
    strict: false
})

const Transfer = mongoose.model('Transfer', TransferSchemal)

const uri = 'mongodb://localhost:27017,localhost:27018,localhost:27019/txn';


(async function start() {
    const db = await mongoose.connect(uri, { replicaSet: 'rs', useNewUrlParser: true })
    await Transfer.remove();
    const data =  await Transfer.insertMany(initData);
    console.log(`Insert ${data.length} records`)
    const records = await Transfer.countDocuments({ from: 'A' });
    console.log(`Total ${records} records`);
    process.exit();
})()