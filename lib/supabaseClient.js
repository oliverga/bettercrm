import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://xhfhkshqnnyuuoywxjki.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhoZmhrc2hxbm55dXVveXd4amtpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDE5NTYzOTMsImV4cCI6MjAxNzUzMjM5M30.gtXeL7BcInY1y3t7Mf-R0RI63ijuNoc_gQMmbnk1gps";
const supabase = createClient(supabaseUrl, supabaseKey);

export { supabase };
