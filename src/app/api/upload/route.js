import { NextResponse } from 'next/server';
import formidable from 'formidable';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Disable the default body parser to handle form data
export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper function to parse form data
const parseForm = async (req) => {
  return new Promise((resolve, reject) => {
    const form = formidable({
      keepExtensions: true,
      multiples: true,
    });

    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
};

export async function POST(request) {
  try {
    // Get the request object
    const reqObj = await request.clone();
    
    // Parse the form data
    const { fields, files } = await parseForm(reqObj);
    
    // Get the type from the fields (e.g., 'blog', 'profile', 'project')
    const type = fields.type[0] || 'general';
    
    // Get the file from the files object
    const file = files.file[0];
    
    // Upload the file to Cloudinary
    const result = await cloudinary.uploader.upload(file.filepath, {
      folder: `portfolio/${type}`,
      resource_type: 'auto',
    });
    
    // Remove the temporary file
    fs.unlinkSync(file.filepath);
    
    // Return the Cloudinary URL and other details
    return NextResponse.json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
    }, { status: 200 });
    
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({
      error: 'Failed to upload image',
      details: error.message,
    }, { status: 500 });
  }
} 