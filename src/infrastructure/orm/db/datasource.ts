import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  password: 'postgres',
  username: 'postgres',
  database: 'NewProject',
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/infrastructure/orm/db/migrations/*.js'],
  synchronize: false,
  logging: true,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
