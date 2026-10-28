import mongoose from 'mongoose';
import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { CategoryModel } from '../modules/categories/category.model.js';
import { UserModel } from '../modules/users/user.model.js';
import { ProductModel } from '../modules/products/product.model.js';
import { ProductVersionModel } from '../modules/products/productVersion.model.js';
import { hashPassword } from '../common/utils/password.js';
import { logger } from '../config/logger.js';
import {
  USER_ROLES,
  SELLER_STATUS,
  USER_STATUS,
  PRODUCT_TYPES,
  PRODUCT_STATUS,
} from '@devshelf/shared';

const SAMPLE_CATEGORIES = [
  {
    name: 'Source Code & Starters',
    slug: 'source-code',
    description: 'Full-stack production boilerplates, SaaS starters, and backend microservices',
    icon: 'Code2',
  },
  {
    name: 'E-books & Guides',
    slug: 'ebooks',
    description: 'Deep-dive developer architectural guides, system design books, and roadmaps',
    icon: 'BookOpen',
  },
  {
    name: 'UI Kits & Design Systems',
    slug: 'ui-kits',
    description: 'Figma templates, Tailwind UI kits, dashboard designs, and icon sets',
    icon: 'Layout',
  },
  {
    name: 'Courses & Masterclasses',
    slug: 'courses',
    description: 'Project-based video courses and comprehensive technical curricula',
    icon: 'GraduationCap',
  },
  {
    name: 'Developer Tools & CLI',
    slug: 'dev-tools',
    description: 'DevOps scripts, automation CLI tools, Docker stacks, and plugins',
    icon: 'Terminal',
  },
];

async function seed() {
  try {
    await connectDatabase();
    logger.info('Seeding database with initial marketplace data...');

    // 1. Seed Categories
    for (const cat of SAMPLE_CATEGORIES) {
      await CategoryModel.findOneAndUpdate({ slug: cat.slug }, cat, { upsert: true });
    }
    logger.info('Categories seeded.');

    // 2. Seed Creator Seller
    const sellerEmail = 'creator@devshelf.io';
    let seller = await UserModel.findOne({ email: sellerEmail });
    if (!seller) {
      seller = await UserModel.create({
        name: 'Alex Rivera',
        email: sellerEmail,
        passwordHash: await hashPassword('DevshelfCreator123!'),
        role: USER_ROLES.USER,
        sellerStatus: SELLER_STATUS.APPROVED,
        status: USER_STATUS.ACTIVE,
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces',
        bio: 'Senior Full-Stack Architect & Open-Source Creator with 10+ years building high-throughput web applications.',
      });
      logger.info(`Creator seller account created: ${sellerEmail}`);
    }

    // 3. Seed Sample Products
    const sourceCodeCategory = await CategoryModel.findOne({ slug: 'source-code' });
    const ebooksCategory = await CategoryModel.findOne({ slug: 'ebooks' });
    const uiKitsCategory = await CategoryModel.findOne({ slug: 'ui-kits' });

    if (sourceCodeCategory && seller) {
      const sampleProducts = [
        {
          sellerId: seller._id,
          title: 'HyperSaaS — Ultimate MERN Full-Stack Boilerplate',
          slug: 'hypersaas-ultimate-mern-boilerplate',
          description:
            'A production-ready multi-tenant SaaS starter kit featuring Express TypeScript, React Vite, Tailwind CSS, authentication, Razorpay subscriptions, and role-based access control out of the box.',
          categoryId: sourceCodeCategory._id,
          productType: PRODUCT_TYPES.SOURCE_CODE,
          priceInPaise: 199900, // Rs. 1,999
          currency: 'INR',
          thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=500&fit=crop',
          previewUrls: [
            'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=700&fit=crop',
            'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=700&fit=crop',
          ],
          status: PRODUCT_STATUS.PUBLISHED,
          averageRating: 4.9,
          reviewCount: 28,
          tags: ['React', 'Node.js', 'Express', 'MongoDB', 'SaaS'],
          currentVersion: '1.2.0',
        },
        {
          sellerId: seller._id,
          title: 'System Design for Senior Engineers (Interactive Edition)',
          slug: 'system-design-senior-engineers-interactive',
          description:
            'Comprehensive 320-page architectural deep dive covering distributed caching, event-driven microservices, database partitioning, idempotency patterns, and real-world high-scale case studies.',
          categoryId: ebooksCategory?._id || sourceCodeCategory._id,
          productType: PRODUCT_TYPES.EBOOK,
          priceInPaise: 79900, // Rs. 799
          currency: 'INR',
          thumbnailUrl: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777f?w=800&h=500&fit=crop',
          previewUrls: [
            'https://images.unsplash.com/photo-1532012164546-f432f2e3777f?w=1200&h=700&fit=crop',
          ],
          status: PRODUCT_STATUS.PUBLISHED,
          averageRating: 4.8,
          reviewCount: 42,
          tags: ['System Design', 'Architecture', 'Microservices', 'Ebook'],
          currentVersion: '2.0.0',
        },
        {
          sellerId: seller._id,
          title: 'ApexUI — Modern Dark-Mode Dashboard UI Kit',
          slug: 'apexui-modern-dark-mode-dashboard-ui-kit',
          description:
            'Handcrafted Tailwind CSS & React component library tailored for analytics dashboards, crypto apps, and developer portals. Includes 45+ charts, tables, and modal components.',
          categoryId: uiKitsCategory?._id || sourceCodeCategory._id,
          productType: PRODUCT_TYPES.UI_KIT,
          priceInPaise: 129900, // Rs. 1,299
          currency: 'INR',
          thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop',
          previewUrls: [
            'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=700&fit=crop',
          ],
          status: PRODUCT_STATUS.PUBLISHED,
          averageRating: 5.0,
          reviewCount: 17,
          tags: ['Figma', 'React', 'Tailwind', 'UI Kit'],
          currentVersion: '1.0.0',
        },
      ];

      for (const prod of sampleProducts) {
        const p = await ProductModel.findOneAndUpdate({ slug: prod.slug }, prod, {
          upsert: true,
          new: true,
        });

        // Add version records
        await ProductVersionModel.findOneAndUpdate(
          { productId: p._id, version: p.currentVersion },
          {
            productId: p._id,
            version: p.currentVersion,
            changelog: 'Initial public production release with complete assets and documentation.',
            storageKey: `products/seed/${prod.slug}-v${p.currentVersion}.zip`,
            originalFilename: `${prod.slug}.zip`,
            fileSizeBytes: 14500000,
          },
          { upsert: true }
        );
      }
      logger.info('Sample products and initial versions seeded.');
    }

    logger.info('Database seeding completed successfully.');
    await disconnectDatabase();
    process.exit(0);
  } catch (error) {
    logger.error({ err: error }, 'Seeding failed');
    process.exit(1);
  }
}

seed();
