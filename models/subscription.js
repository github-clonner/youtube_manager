module.exports = (sequelize, DataTypes) => {
  let Subscription = sequelize.define('Subscription', {
    id: { type: DataTypes.TEXT, primaryKey: true },
    title: DataTypes.TEXT,
    url: DataTypes.TEXT,
    thumbnail_url: DataTypes.TEXT
  })

  Subscription.associate = (models) => {
    Subscription.belongsToMany(models.Tag, { through: 'TagSubscription' })
  }

  return Subscription
}
