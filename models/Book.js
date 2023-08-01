const sequelize = require('../util/database')
const Sequelize = require('sequelize')


const Book = sequelize.define('Book', {
    id:{
        type:Sequelize.INTEGER,
        allowNull: false,
        autoIncrement:true,
        primaryKey:true
    },
    photoLink:{
        type:Sequelize.TEXT,
        allowNull: false,
    },
    name: {
        type:Sequelize.STRING,
        allowNull:false,
    },
    writerName:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    price:{
        type:Sequelize.FLOAT,
        allowNull: false,
    }
})


module.exports = Book