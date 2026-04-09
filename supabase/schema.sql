-- Digital Gift Box Generator - Supabase Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create gifts table
CREATE TABLE gifts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  sender_name VARCHAR(100) NOT NULL,
  receiver_name VARCHAR(100) NOT NULL,
  message TEXT,
  theme VARCHAR(50) NOT NULL DEFAULT 'birthday',
  password_hash VARCHAR(255),
  unlock_date TIMESTAMP WITH TIME ZONE,
  is_opened BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create gift_items table
CREATE TABLE gift_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  gift_id UUID NOT NULL REFERENCES gifts(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('message', 'image', 'video', 'voice', 'coupon')),
  content_text TEXT,
  media_url TEXT,
  caption VARCHAR(255),
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_gifts_created_at ON gifts(created_at DESC);
CREATE INDEX idx_gift_items_gift_id ON gift_items(gift_id);
CREATE INDEX idx_gift_items_position ON gift_items(gift_id, position);

-- Enable Row Level Security
ALTER TABLE gifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE gift_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for gifts
CREATE POLICY "Anyone can view gifts" ON gifts
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert gifts" ON gifts
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update gifts" ON gifts
  FOR UPDATE
  USING (true);

-- RLS Policies for gift_items
CREATE POLICY "Anyone can view gift items" ON gift_items
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert gift items" ON gift_items
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update gift items" ON gift_items
  FOR UPDATE
  USING (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add trigger for updated_at
CREATE TRIGGER update_gifts_updated_at BEFORE UPDATE ON gifts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing (optional)
-- INSERT INTO gifts (title, sender_name, receiver_name, message, theme)
-- VALUES 
--   ('Happy Birthday!', 'John', 'Jane', 'Wishing you a wonderful birthday!', 'birthday'),
--   ('I Love You', 'Alex', 'Sam', 'You are my everything ❤️', 'love'),
--   ('Best Friends Forever', 'Mike', 'Tom', 'Thanks for being an awesome friend!', 'friendship'),
--   ('Congratulations!', 'Mom', 'Graduate', 'So proud of you!', 'celebration');

