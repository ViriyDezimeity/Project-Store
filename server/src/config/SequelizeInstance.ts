import { Sequelize } from 'sequelize';

class SequelizeInstance {
  private static instance: Sequelize;

  private constructor() {}

  private static createInstance(): void {
    const dbHost = process.env.DB_HOST || '';
    const dbName = process.env.DB_NAME || '';
    const dbUserName = process.env.DB_USER_NAME || '';
    const dbPassword = process.env.DB_PASSWORD || '';

    SequelizeInstance.instance = new Sequelize(dbName, dbUserName, dbPassword, {
      host: dbHost,
      dialect: 'postgres',
      logging: false,
    });
  }

  public static getSequelizeInstance(): Sequelize {
    if (!SequelizeInstance.instance) {
      this.createInstance();
    }

    return SequelizeInstance.instance;
  }

  public static async checkConnection(): Promise<void> {
    if (!SequelizeInstance.instance) {
      this.createInstance();
    }

    if (SequelizeInstance.instance) {
      await SequelizeInstance.instance
        .authenticate()
        .then(() => {
          console.log('Connection has been established successfully.');
        })
        .catch((error) => {
          throw error;
        });
    }
  }
}

export default SequelizeInstance;
