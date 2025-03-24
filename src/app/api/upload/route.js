import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  try {
    if (!process.env.CLOUDINARY_CLOUD_NAME || 
        !process.env.CLOUDINARY_API_KEY || 
        !process.env.CLOUDINARY_API_SECRET) {
      return NextResponse.json(
        { error: 'Cloudinary credentials are not configured' },
        { status: 500 }
      );
    }

    // Get the form data from the request
    const formData = await request.formData();
    const file = formData.get('file');
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Convert the file to base64
    const fileBuffer = await file.arrayBuffer();
    const fileBase64 = Buffer.from(fileBuffer).toString('base64');
    const fileDataUrl = `data:${file.type};base64,${fileBase64}`;

    // Get the upload type (profile, project, blog, etc.)
    const uploadType = formData.get('type') || 'general';
    
    // Configure upload options
    const uploadOptions = {
      folder: `portfolio/${uploadType}`,
      resource_type: 'auto',
      overwrite: true,
    };

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        fileDataUrl,
        uploadOptions,
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
    });

    // Return the upload result with image URL
    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Error uploading file to Cloudinary' },
      { status: 500 }
    );
  }
} 