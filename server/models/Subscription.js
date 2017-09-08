module.exports = (sequelize, DataTypes) => {
  let Subscription = sequelize.define('Subscription', {
    id: { type: DataTypes.TEXT, primaryKey: true, allowNull: false, unique: true },
    title: DataTypes.TEXT,
    url: DataTypes.TEXT,
    thumbnail_url: DataTypes.TEXT
  })

  Subscription.associate = (models) => {
    Subscription.belongsToMany(models.Tag, {
      through: 'TagSubscription',
      onDelete: 'no action',
      onUpdate: 'no action'
    })
  }

  return Subscription
}
