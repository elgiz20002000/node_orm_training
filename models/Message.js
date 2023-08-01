const sequelize = require('../util/database')
const Sequelize = require('sequelize')


const Message = sequelize.define('message', {
    id:{
        type:Sequelize.INTEGER,
        allowNull: false,
        autoIncrement:true,
        primaryKey:true
    },
    name:{
        type:Sequelize.STRING,
        allowNull: false,
    },
    companyName:{
        type:Sequelize.STRING,
        allowNull: false,
    },
    email:{
        type:Sequelize.STRING,
        allowNull: false,
    },
    phoneNumber:{
        type:Sequelize.STRING,
        allowNull: false,
    },
    message:{
        type:Sequelize.TEXT,
        allowNull: false,
    },

})


module.exports = Message