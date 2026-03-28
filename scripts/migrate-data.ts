#!/usr/bin/env ts-node

import sequelize from '../src/config/database';
import { Post } from '../src/models/Post';
import { Product } from '../src/models/Product';
import { HomeVideo } from '../src/models/HomeVideo';
import { HighlightVideo } from '../src/models/HighlightVideo';
import { ContactMessage } from '../src/models/ContactMessage';
import { PAGE_KEYS } from '../src/constants/seo';
import fs from 'fs';
import path from 'path';
import { Logger } from '../src/lib';

async function migrate() {
  try {
    Logger.info('🚀 Starting data migration from pevent_sql.sql...');

    // Test database connection
    await sequelize.authenticate();
    Logger.info('✅ Database connection established.');

    const sqlPath = path.join(__dirname, '../pevent_sql.sql');
    if (!fs.existsSync(sqlPath)) {
      Logger.error(`❌ SQL file not found at ${sqlPath}`);
      process.exit(1);
    }

    const sqlContent = fs.readFileSync(sqlPath, 'utf8');

    // // 1. Migrate Contact Messages
    // await migrateTable(sqlContent, 'contact', async (data) => {
    //   await (ContactMessage as any).create({
    //     id: parseInt(data.id),
    //     name: data.full_name || data.phone || 'Anonymous',
    //     email: data.email || '',
    //     phone: data.phone || '',
    //     message: data.comment || '',
    //     isRead: data.mark === '1' || data.show === '1',
    //     createdAt: data.time ? new Date(parseInt(data.time) * 1000) : new Date(),
    //     updatedAt: data.time ? new Date(parseInt(data.time) * 1000) : new Date(),
    //   });
    // });
    // Logger.info('✅ Contact Messages migrated.');

    // // 2. Migrate Posts (news)
    // await migrateTable(sqlContent, 'news', async (data) => {
    //   await (Post as any).create({
    //     id: parseInt(data.id),
    //     title_vi: data.title || '',
    //     slug: data.alias || `post-${data.id}`,
    //     content_vi: data.content || '',
    //     media: data.image || '',
    //     status: (data.publish_status || 'published').toUpperCase() as any,
    //     publishAt: data.scheduled_at ? new Date(parseInt(data.scheduled_at) * 1000) : (data.time ? new Date(parseInt(data.time) * 1000) : null),
    //     createdAt: data.time ? new Date(parseInt(data.time) * 1000) : new Date(),
    //     updatedAt: data.time_update ? new Date(parseInt(data.time_update) * 1000) : new Date(),
    //   });
    // });
    // Logger.info('✅ Posts (news) migrated.');

    // // 3. Migrate Products
    // await migrateTable(sqlContent, 'product', async (data) => {
    //   const categoryId = parseInt(data.category_id);
    //   const productType = categoryId === 58 ? PAGE_KEYS.SOUND_LIGHT : PAGE_KEYS.RENTAL;
      
    //   let allImages: string[] = [];
    //   if (data.image) allImages.push(data.image);
    //   if (data.multi_image) {
    //     try {
    //       // Check if it's a JSON array or comma separated
    //       if (data.multi_image.startsWith('[') && data.multi_image.endsWith(']')) {
    //         const extra = JSON.parse(data.multi_image);
    //         if (Array.isArray(extra)) allImages = [...allImages, ...extra];
    //       } else if (data.multi_image.includes(',')) {
    //         allImages = [...allImages, ...data.multi_image.split(',')];
    //       } else {
    //         allImages.push(data.multi_image);
    //       }
    //     } catch (e) {
    //       allImages.push(data.multi_image);
    //     }
    //   }
    //   // Filter empty and duplicates
    //   allImages = Array.from(new Set(allImages.map(img => img.trim()).filter(img => !!img)));

    //   await (Product as any).create({
    //     id: parseInt(data.id),
    //     name_vi: data.name || '',
    //     slug: data.alias || `product-${data.id}`,
    //     content_vi: data.contents || data.detail || data.description || '',
    //     price: parseFloat(data.price || '0'),
    //     images: allImages,
    //     isActive: data.active !== '0',
    //     productType: productType as any,
    //     createdAt: data.time ? new Date(parseInt(data.time) * 1000) : new Date(),
    //     updatedAt: new Date(),
    //   });
    // });
    // Logger.info('✅ Products migrated.');

    // 4. Migrate Videos
    await migrateTable(sqlContent, 'video', async (data) => {
      const videoData = {
        id: parseInt(data.id),
        title_vi: data.name || '',
        url: data.link_video2 || data.link_video || '',
        thumbnail: data.image || '',
        isActive: data.active !== '0',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      if (data.home === '1') {
        await (HighlightVideo as any).create({
          ...videoData,
          orderIndex: parseInt(data.sort || '0'),
        });
      } else {
        await (HomeVideo as any).create(videoData);
      }
    });
    Logger.info('✅ Videos migrated.');

    Logger.info('\n🎉 Migration completed successfully!');

  } catch (error) {
    Logger.error(`❌ Migration failed: ${error}`);
    console.error(error);
  } finally {
    await sequelize.close();
  }
}

/**
 * Helper to parse INSERT INTO statements for a given table
 */
async function migrateTable(sql: string, tableName: string, insertFn: (data: any) => Promise<void>) {
  // Use a more robust regex to find the start and end of INSERT INTO
  // We'll find INSERT INTO and then find the semicolon that is NOT inside a string
  const startRegex = new RegExp(`INSERT INTO \`${tableName}\` \\((.*?)\\) VALUES`, 'g');
  let match;

  while ((match = startRegex.exec(sql)) !== null) {
    const columns = match[1].split(',').map(c => c.trim().replace(/`/g, ''));
    const startIdx = startRegex.lastIndex;
    
    // Find the terminating semicolon for this INSERT statement
    let endIdx = -1;
    let inString = false;
    for (let i = startIdx; i < sql.length; i++) {
      if (sql[i] === "'" && sql[i-1] !== '\\') {
        inString = !inString;
      }
      if (!inString && sql[i] === ';') {
        endIdx = i;
        break;
      }
    }

    if (endIdx === -1) continue;

    const valuesPart = sql.substring(startIdx, endIdx);
    const records = splitValues(valuesPart);

    for (const record of records) {
      if (!record.trim()) continue;
      const values = parseValues(record);
      const data: any = {};
      columns.forEach((col, i) => {
        if (col) {
          data[col] = values[i];
        }
      });

      try {
        await insertFn(data);
      } catch (err: any) {
        // Ignore duplicate ID errors if we run multiple times
        if (err.name !== 'SequelizeUniqueConstraintError') {
          Logger.warn(`⚠️ Warning: Failed to insert record ID ${data.id} in ${tableName}: ${err.message}`);
        }
      }
    }
  }
}

function splitValues(valuesPart: string): string[] {
  const records: string[] = [];
  let currentRecord = '';
  let inString = false;
  let parenLevel = 0;

  for (let i = 0; i < valuesPart.length; i++) {
    const char = valuesPart[i];
    if (char === "'" && valuesPart[i-1] !== '\\') {
      inString = !inString;
    }

    if (!inString) {
      if (char === '(') parenLevel++;
      if (char === ')') parenLevel--;
      
      if (parenLevel === 0 && char === ',') {
        if (currentRecord.trim()) records.push(currentRecord.trim());
        currentRecord = '';
        continue;
      }
    }
    currentRecord += char;
  }
  if (currentRecord.trim()) records.push(currentRecord.trim());
  return records;
}

function parseValues(record: string): (string | null)[] {
  // Remove outer parentheses
  const valStr = record.trim().replace(/^\(|\)$/g, '');
  const values: (string | null)[] = [];
  let currentVal = '';
  let inString = false;
  let escape = false;

  for (let i = 0; i < valStr.length; i++) {
    const char = valStr[i];

    if (escape) {
      currentVal += char;
      escape = false;
      continue;
    }

    if (char === '\\') {
      escape = true;
      continue;
    }

    if (char === "'") {
      inString = !inString;
      continue;
    }

    if (!inString && char === ',') {
      values.push(formatValue(currentVal));
      currentVal = '';
      continue;
    }

    currentVal += char;
  }
  values.push(formatValue(currentVal));
  return values;
}

function formatValue(val: string): string | null {
  const trimmed = val.trim();
  if (trimmed.toUpperCase() === 'NULL') return null;
  return trimmed;
}

migrate();
