import sequelize from '../src/config/database';
import { Post } from '../src/models/Post';
import { Product } from '../src/models/Product';
import { HomeVideo } from '../src/models/HomeVideo';
import { HighlightVideo } from '../src/models/HighlightVideo';
import { ContactMessage } from '../src/models/ContactMessage';

async function check() {
  await sequelize.authenticate();
  const posts = await Post.count();
  const products = await Product.count();
  const homeVideos = await HomeVideo.count();
  const highlightVideos = await HighlightVideo.count();
  const contacts = await ContactMessage.count();

  console.log('Migration Stats:');
  console.log(`- Posts: ${posts}`);
  console.log(`- Products: ${products}`);
  console.log(`- Home Videos: ${homeVideos}`);
  console.log(`- Highlight Videos: ${highlightVideos}`);
  console.log(`- Contact Messages: ${contacts}`);

  await sequelize.close();
}

check();
