import dotenv from 'dotenv';
dotenv.config();

const url = `${process.env.VITE_SUPABASE_URL}/auth/v1/signup`;
const key = process.env.VITE_SUPABASE_ANON_KEY;

async function createAdmin() {
  console.log("Creating admin account via REST API...");
  
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'apikey': key,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: 'jvnashley@gmail.com',
      password: '$A6013413901a',
      data: {
        username: 'jvnashley',
        full_name: 'Admin',
        is_admin: true
      }
    })
  });
  
  const data = await res.json();
  
  if (data.user) {
    console.log("✅ Admin account created successfully!");
    console.log("User ID:", data.user.id);
  } else {
    console.error("Error creating account:", data);
  }
}

createAdmin();
