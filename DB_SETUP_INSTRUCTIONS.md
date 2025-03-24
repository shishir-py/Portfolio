# Database Setup Instructions

This document provides step-by-step instructions for setting up the database and deploying your portfolio application with persistent data storage.

## Step 1: Create a MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and sign up for a free account
2. Create a new project (e.g., "Portfolio")
3. Create a free shared cluster
4. Set up database access:
   - Create a database user with a secure password
   - Remember these credentials for your connection string
5. Set up network access:
   - Add your current IP address
   - Add `0.0.0.0/0` to allow access from any location (required for Vercel deployment)

## Step 2: Get Your MongoDB Connection String

1. Click on "Connect" for your cluster
2. Select "Connect your application"
3. Copy the connection string (it will look like `mongodb+srv://username:<password>@clustername.mongodb.net/?retryWrites=true&w=majority`)
4. Replace `<password>` with your database user's password

## Step 3: Set Up Cloudinary for Image Uploads

1. Create a [Cloudinary account](https://cloudinary.com/users/register/free) (free tier available)
2. From your Cloudinary dashboard, get your:
   - Cloud name
   - API Key
   - API Secret

## Step 4: Update Environment Variables

Update your `.env.local` file with the following variables:

```
# MongoDB Connection String
MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/your_database?retryWrites=true&w=majority

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Admin credentials (for local development only)
NEXT_PUBLIC_ADMIN_USERNAME=your_admin_username
NEXT_PUBLIC_ADMIN_PASSWORD=your_secure_password

# EmailJS Configuration (for contact form)
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_USER_ID=your_user_id
```

## Step 5: Deploy to Vercel

1. Push your code to a GitHub repository
2. Go to [Vercel](https://vercel.com) and sign up/sign in
3. Create a new project by importing your GitHub repository
4. In the project settings, add all the environment variables from your `.env.local` file
5. Deploy the project

## Step 6: Initialize Your Database

After deploying, you'll need to set up your initial data:

1. Login to your admin dashboard with your admin credentials (`/dashboard`)
2. Create your first blog post, project, and update your profile information
3. These will be stored in your MongoDB database

## Updating Admin Credentials

To update your admin credentials after initial setup:

1. Login to your admin dashboard
2. Navigate to the profile section
3. Change your username and password
4. Update these credentials in your Vercel environment variables

## Notes on Data Security

- Your admin credentials are stored securely in the database (hashed, not plaintext)
- Blog posts, profile data, and project information are all stored in MongoDB
- Images are stored in Cloudinary with secure URL access

## Troubleshooting

If you encounter issues:

1. Check your MongoDB connection string is correct in the environment variables
2. Verify your Cloudinary credentials are correct
3. Check Vercel logs for any deployment errors
4. Ensure your MongoDB network access settings allow connections from Vercel

For further assistance, contact support or refer to the documentation for [MongoDB Atlas](https://docs.atlas.mongodb.com/) and [Cloudinary](https://cloudinary.com/documentation). 