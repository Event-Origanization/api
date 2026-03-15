import sequelize from "@/config/database";

// Import models
import { User } from "./User";
import { Product } from "./Product";
import { Post } from "./Post";
import { HighlightVideo } from "./HighlightVideo";
import { HomeVideo } from "./HomeVideo";
import { NewsletterSubscriber } from "./NewsletterSubscriber";
import { WebsiteConfig } from "./WebsiteConfig";
import { SeoMeta } from "./SeoMeta";

// Initialize associations after all models are loaded
const initializeAssociations = () => {
  // User createdBy and updatedBy associations to User
  // User.belongsTo(User, {
  //   foreignKey: "createdBy",
  //   as: "creator",
  // });

  // User.belongsTo(User, {
  //   foreignKey: "updatedBy",
  //   as: "updater",
  // });
};

// Initialize associations
initializeAssociations();

// Export models
export {
  User,
  Product,
  Post,
  HighlightVideo,
  HomeVideo,
  NewsletterSubscriber,
  WebsiteConfig,
  SeoMeta,
};

// Export sequelize instance
export default sequelize;
