module.exports = (sequelize, DataTypes) => {
    let Subscription = sequelize.define('Subscription', {
        id: { type: DataTypes.INTEGER, primaryKey: true },
        title: DataTypes.TEXT,
        url: DataTypes.TEXT,
        thumbnail_url: DataTypes.TEXT,
        description: DataTypes.TEXT
    })

    Subscription.associate = (models) => { 
        Subscription.belongsToMany(models.Tag, { through: 'TagSubscription' })
    }

    return Subscription
}