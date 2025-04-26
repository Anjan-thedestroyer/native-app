import express from 'express'
import cors from 'cors'

const app = express()
const PORT = 4000
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors());

app.get('/api', (req, res) => {
    console.log(req, res);

})
app.listen(PORT, () => {
    console.log('app is running in :', PORT);

})