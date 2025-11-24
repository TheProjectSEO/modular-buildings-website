-- =====================================================
-- Seed Data for Modular Buildings CMS
-- Schema: modular-buildings.co
-- =====================================================

-- =====================================================
-- INSERT OFFICE BUILDING TYPES
-- =====================================================
DO $$
DECLARE
    office_type_id UUID;
    classroom_type_id UUID;
    industry_type_id UUID;
    location_type_id UUID;
    product_type_id UUID;
    static_type_id UUID;
BEGIN
    -- Get page type IDs
    SELECT id INTO office_type_id FROM "Modular-buildings.co".page_types WHERE slug = 'modular-office-building';
    SELECT id INTO classroom_type_id FROM "Modular-buildings.co".page_types WHERE slug = 'modular-classrooms';
    SELECT id INTO industry_type_id FROM "Modular-buildings.co".page_types WHERE slug = 'industries';
    SELECT id INTO location_type_id FROM "Modular-buildings.co".page_types WHERE slug = 'location';
    SELECT id INTO product_type_id FROM "Modular-buildings.co".page_types WHERE slug = 'products';
    SELECT id INTO static_type_id FROM "Modular-buildings.co".page_types WHERE slug = 'static';

    -- =====================================================
    -- MODULAR OFFICE BUILDING PAGES
    -- =====================================================

    -- Main Office Building Page
    INSERT INTO "Modular-buildings.co".pages (page_type_id, title, slug, excerpt, hero_title, hero_subtitle, status, meta_title, meta_description)
    VALUES (
        office_type_id,
        'Modular Office Buildings',
        'modular-office-building',
        'Premium modular office building solutions for businesses of all sizes.',
        'Modular Office Buildings',
        'Fast, affordable, and customizable office solutions for your business',
        'published',
        'Modular Office Buildings | Premium Portable Office Solutions',
        'Discover our range of modular office buildings. Single-wide, double-wide, and multi-complex options available. Fast delivery and installation nationwide.'
    ) ON CONFLICT DO NOTHING;

    -- Office Building Types
    INSERT INTO "Modular-buildings.co".pages (page_type_id, title, slug, parent_slug, excerpt, hero_title, status, meta_title, meta_description)
    VALUES
        (office_type_id, 'Single-Wide Modular Offices', 'single-wide', 'modular-office-building', 'Compact and efficient single-wide modular office solutions.', 'Single-Wide Modular Offices', 'published', 'Single-Wide Modular Offices | Compact Office Solutions', 'Space-efficient single-wide modular offices perfect for small teams and temporary needs.'),
        (office_type_id, 'Double-Wide Modular Offices', 'double-wide', 'modular-office-building', 'Spacious double-wide modular office buildings for growing teams.', 'Double-Wide Modular Offices', 'published', 'Double-Wide Modular Offices | Spacious Office Buildings', 'Expansive double-wide modular offices with more space for larger teams and operations.'),
        (office_type_id, 'Multi-Complex Modular Offices', 'multi-complexes', 'modular-office-building', 'Large-scale multi-complex modular office solutions for enterprises.', 'Multi-Complex Modular Offices', 'published', 'Multi-Complex Modular Offices | Enterprise Office Solutions', 'Custom multi-complex modular office buildings for large organizations and campuses.'),
        (office_type_id, 'Sales Offices', 'sales-offices', 'modular-office-building', 'Professional sales offices for real estate and retail businesses.', 'Modular Sales Offices', 'published', 'Sales Offices | Professional Modular Sales Centers', 'Attractive modular sales offices perfect for real estate developments and retail locations.')
    ON CONFLICT DO NOTHING;

    -- =====================================================
    -- MODULAR CLASSROOMS PAGES
    -- =====================================================

    -- Main Classrooms Page
    INSERT INTO "Modular-buildings.co".pages (page_type_id, title, slug, excerpt, hero_title, hero_subtitle, status, meta_title, meta_description)
    VALUES (
        classroom_type_id,
        'Modular Classrooms',
        'modular-classrooms',
        'Quality modular classroom solutions for educational institutions.',
        'Modular Classrooms',
        'Flexible and affordable educational spaces for schools and universities',
        'published',
        'Modular Classrooms | Portable Classroom Buildings',
        'High-quality modular classrooms for K-12 schools and universities. Quick installation, comfortable learning environments.'
    ) ON CONFLICT DO NOTHING;

    -- Classroom Types
    INSERT INTO "Modular-buildings.co".pages (page_type_id, title, slug, parent_slug, excerpt, hero_title, status, meta_title, meta_description)
    VALUES
        (classroom_type_id, 'Single Classrooms', 'single', 'modular-classrooms', 'Individual modular classroom units for flexible learning spaces.', 'Single Modular Classrooms', 'published', 'Single Modular Classrooms | Individual Learning Spaces', 'Single modular classroom buildings perfect for temporary or permanent educational needs.'),
        (classroom_type_id, 'Double-Wide Classrooms', 'double-wide', 'modular-classrooms', 'Larger double-wide classroom buildings with more capacity.', 'Double-Wide Modular Classrooms', 'published', 'Double-Wide Classrooms | Expanded Learning Spaces', 'Spacious double-wide modular classrooms for larger class sizes and collaborative learning.'),
        (classroom_type_id, 'Multi-Complex Classrooms', 'multi-complexes', 'modular-classrooms', 'Multi-unit classroom complexes for complete educational facilities.', 'Multi-Complex Classrooms', 'published', 'Multi-Complex Classrooms | Complete Educational Buildings', 'Comprehensive multi-complex modular classroom buildings for full educational campuses.'),
        (classroom_type_id, 'Classroom Restrooms', 'restrooms', 'modular-classrooms', 'Modular restroom facilities for educational campuses.', 'Modular Classroom Restrooms', 'published', 'Classroom Restrooms | Modular Restroom Buildings', 'Clean and accessible modular restroom facilities designed for educational environments.'),
        (classroom_type_id, 'Classroom Kitchens', 'kitchens', 'modular-classrooms', 'Modular kitchen facilities for school cafeterias and food service.', 'Modular Classroom Kitchens', 'published', 'Classroom Kitchens | School Kitchen Buildings', 'Commercial-grade modular kitchen buildings for educational food service operations.')
    ON CONFLICT DO NOTHING;

    -- =====================================================
    -- INDUSTRY PAGES
    -- =====================================================

    -- Main Industries Page
    INSERT INTO "Modular-buildings.co".pages (page_type_id, title, slug, excerpt, hero_title, hero_subtitle, status, meta_title, meta_description)
    VALUES (
        industry_type_id,
        'Industries We Serve',
        'industries',
        'Modular building solutions tailored for every industry.',
        'Industries We Serve',
        'Custom modular buildings for construction, healthcare, education, government, and more',
        'published',
        'Industries | Modular Buildings for Every Sector',
        'Discover how our modular buildings serve construction, medical, government, education, and religious organizations.'
    ) ON CONFLICT DO NOTHING;

    -- Industry Pages
    INSERT INTO "Modular-buildings.co".pages (page_type_id, title, slug, parent_slug, excerpt, hero_title, status, meta_title, meta_description)
    VALUES
        (industry_type_id, 'Construction Industry', 'construction', 'industries', 'Modular buildings for construction sites and contractors.', 'Construction Industry Solutions', 'published', 'Construction Modular Buildings | Job Site Offices', 'Durable modular buildings for construction sites. Field offices, break rooms, and more.'),
        (industry_type_id, 'Medical & Healthcare', 'medical', 'industries', 'Medical-grade modular buildings for healthcare facilities.', 'Medical & Healthcare Buildings', 'published', 'Medical Modular Buildings | Healthcare Facilities', 'Specialized modular buildings for clinics, hospitals, and healthcare providers.'),
        (industry_type_id, 'Government', 'government', 'industries', 'Modular buildings for government agencies and public services.', 'Government Building Solutions', 'published', 'Government Modular Buildings | Public Sector Facilities', 'Compliant modular buildings for federal, state, and local government agencies.'),
        (industry_type_id, 'Education', 'education', 'industries', 'Educational modular buildings for schools and universities.', 'Education Building Solutions', 'published', 'Education Modular Buildings | School Facilities', 'Quality modular buildings for K-12 schools, colleges, and educational institutions.'),
        (industry_type_id, 'Religious Organizations', 'religion', 'industries', 'Modular buildings for churches, temples, and religious facilities.', 'Religious Building Solutions', 'published', 'Religious Modular Buildings | Church & Temple Buildings', 'Versatile modular buildings for churches, temples, and places of worship.')
    ON CONFLICT DO NOTHING;

    -- =====================================================
    -- LOCATION PAGES (States)
    -- =====================================================

    -- Main Location Page
    INSERT INTO "Modular-buildings.co".pages (page_type_id, title, slug, excerpt, hero_title, hero_subtitle, status, meta_title, meta_description)
    VALUES (
        location_type_id,
        'Service Locations',
        'location',
        'Modular building services available across the United States.',
        'Our Service Locations',
        'Fast delivery and installation across all 50 states',
        'published',
        'Service Locations | Nationwide Modular Building Delivery',
        'Find modular building services in your state. We serve Texas, California, Florida, and all 50 states.'
    ) ON CONFLICT DO NOTHING;

    -- State Pages
    INSERT INTO "Modular-buildings.co".pages (page_type_id, title, slug, parent_slug, excerpt, hero_title, status, meta_title, meta_description, custom_fields)
    VALUES
        (location_type_id, 'Texas', 'texas', 'location', 'Modular buildings in Texas - serving Houston, Dallas, Austin, and more.', 'Modular Buildings in Texas', 'published', 'Texas Modular Buildings | TX Portable Buildings', 'Leading modular building provider in Texas. Serving Houston, Dallas, San Antonio, Austin, and all major cities.', '{"state_code": "TX", "region": "South", "major_cities": ["Houston", "Dallas", "San Antonio", "Austin", "Fort Worth"]}'),
        (location_type_id, 'California', 'california', 'location', 'Modular buildings in California - serving LA, San Diego, San Francisco, and more.', 'Modular Buildings in California', 'published', 'California Modular Buildings | CA Portable Buildings', 'Premium modular buildings in California. Serving Los Angeles, San Diego, San Francisco, and statewide.', '{"state_code": "CA", "region": "West", "major_cities": ["Los Angeles", "San Diego", "San Jose", "San Francisco", "Fresno"]}'),
        (location_type_id, 'Florida', 'florida', 'location', 'Modular buildings in Florida - serving Miami, Tampa, Orlando, and more.', 'Modular Buildings in Florida', 'published', 'Florida Modular Buildings | FL Portable Buildings', 'Quality modular buildings in Florida. Serving Miami, Tampa, Jacksonville, Orlando, and statewide.', '{"state_code": "FL", "region": "Southeast", "major_cities": ["Jacksonville", "Miami", "Tampa", "Orlando", "St. Petersburg"]}'),
        (location_type_id, 'New York', 'new-york', 'location', 'Modular buildings in New York - serving NYC, Buffalo, Rochester, and more.', 'Modular Buildings in New York', 'published', 'New York Modular Buildings | NY Portable Buildings', 'Modular building solutions in New York. Serving NYC metro area and all regions.', '{"state_code": "NY", "region": "Northeast", "major_cities": ["New York City", "Buffalo", "Rochester", "Yonkers", "Syracuse"]}'),
        (location_type_id, 'Ohio', 'ohio', 'location', 'Modular buildings in Ohio - serving Columbus, Cleveland, Cincinnati, and more.', 'Modular Buildings in Ohio', 'published', 'Ohio Modular Buildings | OH Portable Buildings', 'Reliable modular buildings in Ohio. Serving Columbus, Cleveland, Cincinnati, and statewide.', '{"state_code": "OH", "region": "Midwest", "major_cities": ["Columbus", "Cleveland", "Cincinnati", "Toledo", "Akron"]}'),
        (location_type_id, 'Pennsylvania', 'pennsylvania', 'location', 'Modular buildings in Pennsylvania - serving Philadelphia, Pittsburgh, and more.', 'Modular Buildings in Pennsylvania', 'published', 'Pennsylvania Modular Buildings | PA Portable Buildings', 'Modular building provider in Pennsylvania. Serving Philadelphia, Pittsburgh, and all regions.', '{"state_code": "PA", "region": "Northeast", "major_cities": ["Philadelphia", "Pittsburgh", "Allentown", "Erie", "Reading"]}'),
        (location_type_id, 'Illinois', 'illinois', 'location', 'Modular buildings in Illinois - serving Chicago and statewide.', 'Modular Buildings in Illinois', 'published', 'Illinois Modular Buildings | IL Portable Buildings', 'Top modular buildings in Illinois. Serving Chicago metro and all regions.', '{"state_code": "IL", "region": "Midwest", "major_cities": ["Chicago", "Aurora", "Naperville", "Joliet", "Rockford"]}'),
        (location_type_id, 'Georgia', 'georgia', 'location', 'Modular buildings in Georgia - serving Atlanta and statewide.', 'Modular Buildings in Georgia', 'published', 'Georgia Modular Buildings | GA Portable Buildings', 'Quality modular buildings in Georgia. Serving Atlanta metro and all regions.', '{"state_code": "GA", "region": "Southeast", "major_cities": ["Atlanta", "Augusta", "Columbus", "Macon", "Savannah"]}'),
        (location_type_id, 'North Carolina', 'north-carolina', 'location', 'Modular buildings in North Carolina - serving Charlotte, Raleigh, and more.', 'Modular Buildings in North Carolina', 'published', 'North Carolina Modular Buildings | NC Portable Buildings', 'Modular building solutions in North Carolina. Serving Charlotte, Raleigh, and statewide.', '{"state_code": "NC", "region": "Southeast", "major_cities": ["Charlotte", "Raleigh", "Greensboro", "Durham", "Winston-Salem"]}'),
        (location_type_id, 'Michigan', 'michigan', 'location', 'Modular buildings in Michigan - serving Detroit and statewide.', 'Modular Buildings in Michigan', 'published', 'Michigan Modular Buildings | MI Portable Buildings', 'Dependable modular buildings in Michigan. Serving Detroit metro and all regions.', '{"state_code": "MI", "region": "Midwest", "major_cities": ["Detroit", "Grand Rapids", "Warren", "Sterling Heights", "Ann Arbor"]}')
    ON CONFLICT DO NOTHING;

    -- =====================================================
    -- STATIC PAGES
    -- =====================================================

    INSERT INTO "Modular-buildings.co".pages (page_type_id, title, slug, excerpt, hero_title, status, meta_title, meta_description)
    VALUES
        (static_type_id, 'About Us', 'about', 'Learn about Modular Buildings Co and our commitment to quality.', 'About Modular Buildings Co', 'published', 'About Us | Modular Buildings Co', 'Learn about Modular Buildings Co, our history, mission, and commitment to quality modular building solutions.'),
        (static_type_id, 'Contact Us', 'contact', 'Get in touch with our team for quotes and inquiries.', 'Contact Us', 'published', 'Contact Us | Get a Quote | Modular Buildings Co', 'Contact Modular Buildings Co for quotes, questions, and support. Call or email our team today.'),
        (static_type_id, 'Blog', 'blog', 'Industry insights, tips, and news about modular buildings.', 'Our Blog', 'published', 'Blog | Modular Building News & Insights', 'Stay updated with the latest news, tips, and insights about modular buildings and portable structures.'),
        (static_type_id, 'Careers', 'careers', 'Join our team and build your career with us.', 'Careers at Modular Buildings Co', 'published', 'Careers | Jobs at Modular Buildings Co', 'Explore career opportunities at Modular Buildings Co. Join our team of modular building experts.'),
        (static_type_id, 'Financing', 'financing', 'Flexible financing options for your modular building project.', 'Financing Options', 'published', 'Financing | Modular Building Payment Options', 'Explore flexible financing options for your modular building. Lease, rent-to-own, and purchase programs available.'),
        (static_type_id, 'Installation Services', 'installation', 'Professional installation services for modular buildings.', 'Installation Services', 'published', 'Installation Services | Professional Setup', 'Expert modular building installation services. Site preparation, delivery, and complete setup.'),
        (static_type_id, 'Maintenance Services', 'maintenance', 'Keep your modular building in top condition.', 'Maintenance Services', 'published', 'Maintenance Services | Building Care', 'Comprehensive maintenance services for modular buildings. Repairs, upgrades, and preventive care.')
    ON CONFLICT DO NOTHING;

    RAISE NOTICE 'Seed data inserted successfully!';
END $$;
