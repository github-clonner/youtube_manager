module.exports = (sequelize, DataTypes) => {
  let SubscriptionInfo = sequelize.define('SubscriptionInfo', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    tag_id: { type: DataTypes.INTEGER },
    subscription_id: { type: DataTypes.STRING(50) }
  })

  return SubscriptionInfo
}
