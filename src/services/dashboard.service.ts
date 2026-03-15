import { Product, Post, HighlightVideo, NewsletterSubscriber } from '@/models';
import { POST_STATUS } from '@/constants';
import { Op } from 'sequelize';

export const dashboardService = {
  getOverviewData: async () => {
    const [
      products,
      posts,
      highlightVideos,
      subscribers,
      activeProducts,
      inactiveProducts,
      publishedPosts,
      draftPosts,
      scheduledPosts,
      recentProducts,
      recentSubscribers
    ] = await Promise.all([
      Product.count(),
      Post.count(),
      HighlightVideo.count(),
      NewsletterSubscriber.count(),
      Product.count({ where: { isActive: true } }),
      Product.count({ where: { isActive: false } }),
      Post.count({ where: { status: POST_STATUS.PUBLISHED } }),
      Post.count({ where: { status: POST_STATUS.DRAFT } }),
      Post.count({ where: { status: POST_STATUS.SCHEDULED } }),
      Product.findAll({
        attributes: ['id', 'name_vi', 'price', 'slug', 'isActive', 'createdAt'],
        order: [['createdAt', 'DESC']],
        limit: 5,
      }),
      NewsletterSubscriber.findAll({
        attributes: ['id', 'email', 'isActive', 'createdAt'],
        order: [['createdAt', 'DESC']],
        limit: 5,
      }),
    ]);

    return {
      products,
      posts,
      highlightVideos,
      subscribers,
      productStats: {
        active: activeProducts,
        inactive: inactiveProducts,
      },
      postStats: {
        published: publishedPosts,
        draft: draftPosts,
        scheduled: scheduledPosts,
      },
      recentProducts,
      recentSubscribers,
    };
  },

  getYearlyChartData: async () => {
    const currentYear = new Date().getFullYear();
    const startDate = new Date(`${currentYear}-01-01T00:00:00.000Z`);
    const endDate = new Date(`${currentYear}-12-31T23:59:59.999Z`);

    const whereClause = {
      createdAt: {
        [Op.gte]: startDate,
        [Op.lte]: endDate,
      },
    };

    // To ensure compatibility across different SQL dialects, we can fetch the IDs and createdAt
    // or use sequelize.fn. Using basic sequelize.fn('MONTH') might only work on MySQL/Postgres.
    // Given we want to avoid raw queries, we can pull data and aggregate in memory if data isn't huge,
    // or try using literal. I'll use a straightforward grouping if possible.
    
    // Instead of raw sql which could break, we can fetch all records of this year with only attributes we need
    const [productsRaw, postsRaw, subscribersRaw] = await Promise.all([
      Product.findAll({
        attributes: ['createdAt'],
        where: whereClause,
      }),
      Post.findAll({
        attributes: ['createdAt'],
        where: whereClause,
      }),
      NewsletterSubscriber.findAll({
        attributes: ['createdAt'],
        where: whereClause,
      }),
    ]);

    // Initialize arrays with 0 for 12 months (0-11)
    const productMonthly = Array(12).fill(0);
    const postMonthly = Array(12).fill(0);
    const subscriberMonthly = Array(12).fill(0);

    productsRaw.forEach((item) => {
      const month = new Date(item.createdAt).getMonth();
      productMonthly[month]++;
    });

    postsRaw.forEach((item) => {
      const month = new Date(item.createdAt).getMonth();
      postMonthly[month]++;
    });

    subscribersRaw.forEach((item) => {
      const month = new Date(item.createdAt).getMonth();
      subscriberMonthly[month]++;
    });

    return {
      barChart: {
        products: productMonthly,
        posts: postMonthly,
      },
      lineChart: {
        subscribers: subscriberMonthly,
      },
    };
  },
};
