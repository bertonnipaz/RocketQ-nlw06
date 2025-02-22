const Database = require("../db/config")

module.exports = {
    async create(req, res) {
        const db = await Database()
        const pass = req.body.password
        let roomId
        let isRoom = true

        while (isRoom) {

            // criando o id da sala de forma randômica (string)
            for (var i = 0; i < 6; i++) {
                i == 0 ? roomId = Math.floor(Math.random() * 10).toString() :
                    roomId += Math.floor(Math.random() * 10).toString()
            }

            // verificar se esse numero já existe
            const roomsExistIds = await db.all(`SELECT id FROM rooms`)

            isRoom = roomsExistIds.some(roomExistId => roomExistId === roomId)

            if (!isRoom) {
                // inseri a sala no banco
                await db.run(`INSERT INTO rooms (
                id,
                pass   
            ) VALUES (
                ${parseInt(roomId)},
                ${pass}
            )`)
            }
        }

        await db.close()

        res.redirect(`/room/${roomId}`)
    },

    async open(req, res) {
        const db = await Database()
            //pegando o id da room da url
        const roomId = req.params.room

        // const isIncorrect = req.params.isIncorrect == "isIncorrect" ? true : false

        const questions = await db.all(`SELECT * FROM questions WHERE room = ${roomId} and read = 0`)
        const questionsRead = await db.all(`SELECT * FROM questions WHERE room = ${roomId} and read = 1`)
        let isNoQuestions
        if (questions.length == 0) {
            if (questionsRead == 0) {
                isNoQuestions = true
            }
        }
        res.render("room", { roomId: roomId, questions: questions, questionsRead: questionsRead, isNoQuestions: isNoQuestions })
    },

    async enter(req, res) {

        const db = await Database()
        let roomId = req.body.roomId
        const roomsExistIds = await db.all(`SELECT id FROM rooms`)
        let isRoom
        
        isRoom = roomsExistIds.some(roomExistId => roomExistId.id == roomId)
        console.log(isRoom)
        if(isRoom){
            res.redirect(`/room/${roomId}`)
        }else{
            res.render("noroom")
        }


    }
}