module.exports = (sequelize, DataTypes) => {
  let Subscription = sequelize.define('Subscription', {
    id: { type: DataTypes.STRING(50), primaryKey: true, unique: true },
    title: DataTypes.STRING(100),
    url: DataTypes.STRING(50),
    thumbnail_url: DataTypes.STRING(50)
  })

  Subscription.associate = (models) => {
    Subscription.belongsToMany(models.Tag, {
      through: 'TagSubscription'
    })
  }

  return Subscription
}
