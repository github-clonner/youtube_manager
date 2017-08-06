module.exports = (sequelize, DataTypes) => {
    let Tag = sequelize.define('Tag', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        title: { type: DataTypes.TEXT }
    })

    Tag.associate = models => {
        Tag.belongsToMany(models.Subscription, { through: 'TagSubscription' })
    }

    return Tag
}