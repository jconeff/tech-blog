const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const bcrypt = require('bcrypt');

// create User model
class User extends Model {
    // set up method to run on instance data to check password
    checkPassword(loginPw) {
        return bcrypt.compareSync(loginPw, this.password);
    }
};

// define table columns and configuration
User.init(
    {
        // TABLE COLUMN DEFINITIONS
        // define an id column
        id: {
            // use the special Sequelize DataTypes object to provide type of data
            type: DataTypes.INTEGER,
            // defines NOT NULL
            allowNull: false,
            // defines primary key
            primaryKey: true,
            // turn on auto increment
            autoIncrement: true
        },
        // define a username column
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // define an email column
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            // there cannot be duplicate email values in this table
            unique: true,
            // if allowNull is false, run data through validation before creating the table data
            validate: {
                isEmail: true
            }
        },
        // define a password column
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                // password must be at least four characters long
                len: [4]
            }
        }
    },
    {
        // TABLE CONFIGURATION OPTIONS HERE
        hooks: {
            async beforeCreate(newUserData) {
                newUserData.password = await bcrypt.hash(newUserData.password, 10);
                    return newUserData;
            },
            async beforeUpdate(updatedUserData) {
                updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
                return updatedUserData;
            }
        },
        // pass in sequlize connection
        sequelize,
        // don't automatically create timestamp fields
        timestamps: false,
        // don't pluralize name of database table
        freezeTableName: true,
        // use underscores
        underscored: true,
        // model name stays lowercase
        modelName: 'user'
    }
);

module.exports = User;