-- ============================================================
-- Supabase Database Schema for LCA Driver App
-- ============================================================
-- Run this SQL in your Supabase SQL editor to create the tables
-- https://app.supabase.com/project/[YOUR_PROJECT]/sql/new
-- ============================================================

-- Create missions table
CREATE TABLE IF NOT EXISTS missions (
  id BIGINT PRIMARY KEY,
  driver TEXT NOT NULL,
  plate TEXT,
  date TEXT NOT NULL,
  dayStartTs BIGINT NOT NULL,
  dayEndTs BIGINT,
  completed BOOLEAN DEFAULT FALSE,
  stops JSONB DEFAULT '[]'::jsonb,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id BIGINT PRIMARY KEY,
  "from" TEXT NOT NULL,
  fromName TEXT,
  "to" TEXT NOT NULL,
  toLabel TEXT,
  text TEXT NOT NULL,
  ts BIGINT NOT NULL,
  "read" BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_missions_driver ON missions(driver);
CREATE INDEX IF NOT EXISTS idx_missions_date ON missions(date);
CREATE INDEX IF NOT EXISTS idx_missions_completed ON missions(completed);
CREATE INDEX IF NOT EXISTS idx_messages_ts ON messages(ts DESC);
CREATE INDEX IF NOT EXISTS idx_messages_from ON messages("from");
CREATE INDEX IF NOT EXISTS idx_messages_to ON messages("to");

-- Enable Row Level Security (optional but recommended)
ALTER TABLE missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create public read policy for missions
CREATE POLICY "missions_public_read" ON missions
  FOR SELECT USING (true);

-- Create public insert policy for missions
CREATE POLICY "missions_public_insert" ON missions
  FOR INSERT WITH CHECK (true);

-- Create public update policy for missions
CREATE POLICY "missions_public_update" ON missions
  FOR UPDATE USING (true) WITH CHECK (true);

-- Create public read policy for messages
CREATE POLICY "messages_public_read" ON messages
  FOR SELECT USING (true);

-- Create public insert policy for messages
CREATE POLICY "messages_public_insert" ON messages
  FOR INSERT WITH CHECK (true);

-- Create public update policy for messages
CREATE POLICY "messages_public_update" ON messages
  FOR UPDATE USING (true) WITH CHECK (true);