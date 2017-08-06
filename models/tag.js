module.exports = (sequelize, DataTypes) => {
    var Tag = sequelize.define("Tag", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        title: {
            type: DataTypes.TEXT
        }
    })
}