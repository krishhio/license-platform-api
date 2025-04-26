module.exports = (sequelize, DataTypes) => {
    const HardwareCode = sequelize.define('hardware_code', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      license_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      code: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
      },
      description: {
        type: DataTypes.STRING(255),
        allowNull: true
      }
    }, {
      tableName: 'hardware_code',
      timestamps: false  // si no tienes columnas createdAt y updatedAt
    });
  
    return HardwareCode;
  };
  