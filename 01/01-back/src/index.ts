import express, { Request, Response } from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
//create express app
const app = express()

app.use(cors())
app.use(bodyParser.json())


const port = process.env.PORT || 5005


let videos = [
    {id: 1, title: 'About JS - 01', author: 'it-incubator.eu'},
    {id: 2, title: 'About JS - 02', author: 'it-incubator.eu'},
]

app.get('/', (req: Request, res: Response ) => {
    res.send('Hello: World!!!!')

})

app.get('/videos', (req: Request, res: Response ) => {
    res.send(videos) //res.json = res.send
})

app.post('/videos', (req: Request, res: Response) => {
    const videosLength = videos.length
    const newVideo = {
        id: +(new Date()),
        title: req.body.title,
        author: 'it-incubator.eu'
    }
    videos.push(newVideo)
    if (videosLength > videos.length)
    {
        res.status(201).send(newVideo)
    }else {
        res.status(400).send({
            "data": {},
            "errorsMessages": [
                {
                    "message": "The Title field is required.",
                    "field": "title"
                }
            ],
            "resultCode": 1
        })
    }
})

app.get('/videos/:id', (req: Request, res: Response ) => {
    const id = +req.params.id
    if (id){
        const video = videos.find(v=> v.id === id)
        if(video) { //(!!video)
            res.send(video)//res.json = res.send
        }
        else res.send(404)
    }else {
        res.send(404)
    }
})

app.put('/videos/videos/:id', (req: Request, res: Response ) => {
    const id = +req.params.id
    function isNumeric(id: any) {
        return !isNaN(parseFloat(id)) && isFinite(id);
    }
    if(!id || !isNumeric(id)){
        return res.send(400)
    }
    const video = videos.find(v => v.id === id)
    if (video) {
        //реализация Димыча
        // const video = videos.find(v=> v.id === id)
        // if(video){
        //     video.title = req.body.title
        //     res.send(videos)
        // }else res.send(videos)

        videos = videos.map(v => {
            if (v.id === id) {
                return {...v, title: req.body.title}
            }else return v
        })
        res.sendStatus(204)
    }else res.send(404)
})

app.delete('/videos/:id', (req: Request, res: Response ) => {
    const id = +req.params.id
    if (id) {
        let newVideos = videos.filter(v => v.id !== id)
        if (newVideos.length< videos.length){
            videos = newVideos
            res.send(204)
        }else  res.send(404)
    }else  res.send(404)
})



//start app
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
