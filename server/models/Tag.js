module.exports = (sequelize, DataTypes) => {
  let Tag = sequelize.define('Tag', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING(25) }
  })

  Tag.associate = models => {
    Tag.belongsToMany(models.Subscription, {
      through: models.TagSubscription,
      onDelete: 'no action',
      onUpdate: 'no action'
    })
  }

  return Tag
}
