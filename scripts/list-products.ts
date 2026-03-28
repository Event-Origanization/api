import sequelize from '../src/config/database';
import { Product } from '../src/models/Product';

async function listProducts() {
  await sequelize.authenticate();
  const products = await Product.findAll({ attributes: ['id', 'name_vi'] });
  console.log('Migrated Products:');
  products.forEach(p => console.log(`- ID: ${p.id}, Name: ${p.get('name_vi')}`));
  await sequelize.close();
}

listProducts();
