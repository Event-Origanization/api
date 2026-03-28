import sequelize from '../src/config/database';
import { Product } from '../src/models/Product';

async function spotCheck() {
  await sequelize.authenticate();
  const product = await Product.findOne({ where: { id: 261 } });
  console.log('Product 261 Spot Check:');
  console.log(JSON.stringify(product, null, 2));
  await sequelize.close();
}

spotCheck();
