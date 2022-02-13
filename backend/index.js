const express=require('express')
const connetToMongo=require('./db')
const cors=require('cors')

const app =express()
const port=5000

app.use(cors())
app.use(express.json())

connetToMongo()

app.use('/api/v1/auth',require('./routes/auth'))
app.use('/api/v1/price',require('./routes/pricelist'))



app.listen(port,()=>{
    console.log(`My Project is running on port ${port}`)
})