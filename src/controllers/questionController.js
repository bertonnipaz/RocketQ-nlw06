const Database = require('../db/config')

module.exports = {


    async action(req, res) {
        const db = await Database()
        const roomId = req.params.room
        const questionId = req.params.question
        const action = req.params.action
        const password = req.body.password

        // verificar se a senhora está correta
        // pegando os dados da sala com id correspondente e conferindo a senha 
        const verifyRoom = await db.get(`SELECT * FROM rooms WHERE id = ${roomId}`)
        if (verifyRoom.pass == password) {
            if (action == "delete") {

                await db.run(`DELETE FROM questions WHERE id = ${questionId}`)

            } else if (action == "check") {

                await db.run(`UPDATE questions SET read = 1 WHERE id = ${questionId}`)
            }
            res.redirect(`/room/${roomId}`)
        } else {
            // isIncorrect = true
            res.render("passincorrect",{roomId : roomId})
            
        }
    },

    async create(req, res) {
        const db = await Database()
        const question = req.body.question
        const roomId = req.params.room

        await db.run(`
        INSERT INTO questions (
            title,
            read,
            room   
        ) VALUES (
            "${question}",
            0,
            ${roomId}
        )`)
        res.redirect(`/room/${roomId}`)

    }


    // incorrectPass(req, res) {
    //     const roomId = req.params.room

    // }

}