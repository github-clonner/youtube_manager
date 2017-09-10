module.exports = (sequelize, DataTypes) => {
  let Tag = sequelize.define('Tag', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false, unique: true },
    title: { type: DataTypes.STRING(25) }
  })

  Tag.associate = models => {
    Tag.belongsToMany(models.Subscription, { through: 'TagSubscription' })
  }

  return Tag
}
