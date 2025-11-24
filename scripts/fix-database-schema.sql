-- Fix missing columns in projects table
-- Run this in Supabase SQL Editor

-- Check if is_published column exists, if not add it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'projects' AND column_name = 'is_published'
    ) THEN
        ALTER TABLE projects ADD COLUMN is_published BOOLEAN DEFAULT true;
    END IF;
END $$;

-- Check if is_featured column exists, if not add it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'projects' AND column_name = 'is_featured'
    ) THEN
        ALTER TABLE projects ADD COLUMN is_featured BOOLEAN DEFAULT false;
    END IF;
END $$;

-- Check if completion_date column exists, if not add it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'projects' AND column_name = 'completion_date'
    ) THEN
        ALTER TABLE projects ADD COLUMN completion_date DATE;
    END IF;
END $$;

-- Update existing projects to be published by default
UPDATE projects SET is_published = true WHERE is_published IS NULL;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_projects_published ON projects(is_published);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(is_featured);
