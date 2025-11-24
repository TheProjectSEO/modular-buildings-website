#!/usr/bin/env node

/**
 * Setup Karmod database with sample data
 * Run with: node setup-database.js
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://qyjzqzqqjimittltttph.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5anpxenFxamltaXR0bHR0dHBoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwNTk5OTksImV4cCI6MjA3NjYzNTk5OX0.YQA0wSqdri73o6WW4-BZl0i8oKlMNcj702nAZvWkR9o';

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDatabase() {
  console.log('🚀 Setting up Karmod database...\n');

  try {
    // Insert product categories
    console.log('📁 Creating product categories...');
    const categories = [
      { name: 'Containers', slug: 'containers', description: 'Container solutions for various applications', sort_order: 1, is_active: true },
      { name: 'Kiosks', slug: 'kiosks', description: 'Modular kiosk structures', sort_order: 2, is_active: true },
      { name: 'Modular Homes', slug: 'modular-homes', description: 'Residential modular buildings', sort_order: 3, is_active: true },
      { name: 'Prefabricated Buildings', slug: 'prefabricated-buildings', description: 'Complete prefab building solutions', sort_order: 4, is_active: true },
      { name: 'Steel Frame Houses', slug: 'steel-frame-houses', description: 'Light gauge steel frame structures', sort_order: 5, is_active: true },
      { name: 'Modular Cabins', slug: 'modular-cabins', description: 'Cabin structures for various uses', sort_order: 6, is_active: true }
    ];

    const { data: catData, error: catError } = await supabase
      .from('product_categories')
      .upsert(categories, { onConflict: 'slug' })
      .select();

    if (catError) {
      console.error('❌ Error creating categories:', catError.message);
    } else {
      console.log(`✅ Created ${categories.length} categories\n`);
    }

    // Insert products
    console.log('📦 Creating products...');
    const products = [
      {
        title: 'Prefabricated Office 560 m²',
        slug: 'prefabricated-office-560-m2',
        category: 'prefabricated-buildings',
        subcategory: 'prefabricated-offices',
        description: '2-storey prefabricated office with high quality standards',
        total_area: 560,
        floor_count: 2,
        completion_days: 32,
        specifications: {
          total_area: '560 m²',
          floor_count: 2,
          ceiling_height: '3m',
          type: 'Office Building'
        },
        features: ['High quality construction', 'Fast installation', 'Energy efficient', 'Customizable layout'],
        is_published: true,
        is_featured: true
      },
      {
        title: 'Modular School Buildings 1840 m²',
        slug: 'modular-school-buildings-1840-m2',
        category: 'prefabricated-buildings',
        subcategory: 'modular-school-buildings',
        description: 'Pre-fabricated Medical Faculty Building – Fast and Reliable Education Solutions',
        total_area: 1840,
        floor_count: 2,
        completion_days: 45,
        specifications: {
          total_area: '1840 m²',
          classrooms: 14,
          students: 900,
          laboratories: 4,
          floor_count: 2
        },
        features: ['14 classrooms', '900 student capacity', '4 laboratories', 'Administrative facilities', 'Safety certified'],
        is_published: true,
        is_featured: true
      },
      {
        title: 'Container Office 20ft',
        slug: 'container-office-20ft',
        category: 'containers',
        subcategory: null,
        description: 'Portable container office solution with modern amenities',
        total_area: 14,
        floor_count: 1,
        completion_days: 5,
        specifications: {
          length: '6m',
          width: '2.4m',
          height: '2.6m'
        },
        features: ['Portable', 'Quick installation', 'Durable', 'Weatherproof'],
        is_published: true,
        is_featured: true
      },
      {
        title: 'Modular Cabin for Construction Sites',
        slug: 'modular-cabin-construction',
        category: 'modular-cabins',
        subcategory: null,
        description: 'Durable modular cabin perfect for construction site offices',
        total_area: 18,
        floor_count: 1,
        completion_days: 3,
        specifications: {
          length: '6m',
          width: '3m',
          height: '2.8m'
        },
        features: ['Weather resistant', 'Insulated', 'Quick setup', 'Mobile'],
        is_published: true,
        is_featured: false
      }
    ];

    const { data: prodData, error: prodError } = await supabase
      .from('products')
      .upsert(products, { onConflict: 'slug' })
      .select();

    if (prodError) {
      console.error('❌ Error creating products:', prodError.message);
    } else {
      console.log(`✅ Created ${products.length} products\n`);
    }

    // Insert project
    console.log('🏗️  Creating projects...');
    const projects = [
      {
        title: 'Prefabricated Office - Arnavutköy Project',
        slug: 'prefabricated-office-arnavutkoy',
        category: 'Office Buildings',
        location: 'Arnavutköy, Istanbul',
        country: 'Turkey',
        city: 'Istanbul',
        completion_days: 32,
        total_area: 560,
        description: '2-storey prefabricated office building completed in Arnavutköy, Istanbul',
        features: ['560 m² total area', '2 floors', 'Completed in 32 days', 'Modern design', 'Energy efficient'],
        is_featured: true,
        is_published: true
      }
    ];

    const { data: projData, error: projError } = await supabase
      .from('projects')
      .upsert(projects, { onConflict: 'slug' })
      .select();

    if (projError) {
      console.error('❌ Error creating projects:', projError.message);
    } else {
      console.log(`✅ Created ${projects.length} project\n`);
    }

    console.log('✅ Database setup complete!\n');
    console.log('Next steps:');
    console.log('1. Refresh your browser at http://localhost:3004');
    console.log('2. You should now see categories and products on the homepage');
    console.log('3. Navigate to /category/containers to see product listings\n');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

setupDatabase();
