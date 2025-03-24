import './globals.css';
import { Montserrat } from 'next/font/google';
import Header from './components/Header';
import Footer from './components/Footer';
import { Metadata } from 'next';
import { connectToDatabase } from '../lib/mongodb';

const montserrat = Montserrat({ 
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

// Define default metadata
const defaultMetadata = {
  title: 'Tara Prasad Pandey - Data Analyst Portfolio',
  description: 'Professional portfolio showcasing data analytics projects, skills and experience',
};

// Default profile data as fallback
const defaultProfile = {
  name: 'Tara Prasad Pandey',
  title: 'Data Analyst',
  bio: 'Results-driven Data Analyst specializing in automation, machine learning models, and data visualization with advanced skills in Python, SQL, and Power BI.',
  imageUrl: '/images/profile/admin-profile.jpg'
};

// Helper function to serialize MongoDB documents
function serializeDocument(doc: any) {
  if (!doc) return null;
  
  return Object.fromEntries(
    Object.entries(doc).map(([key, value]) => {
      // Convert ObjectId to string
      if (key === '_id') {
        return [key, value.toString()];
      }
      // Handle nested objects (if any)
      if (value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
        return [key, serializeDocument(value)];
      }
      // Handle arrays (if any)
      if (Array.isArray(value)) {
        return [key, value.map(item => 
          typeof item === 'object' && item !== null ? serializeDocument(item) : item
        )];
      }
      // Regular values
      return [key, value];
    })
  );
}

// Fetch profile data for metadata
async function getProfileData() {
  try {
    // Server component can directly connect to database
    const { db } = await connectToDatabase();
    
    if (!db) {
      console.warn('Database connection not available, using default profile');
      return defaultProfile;
    }
    
    const profile = await db.collection('profile').findOne({});
    
    // Serialize the MongoDB document to plain JavaScript object
    const serializedProfile = profile ? serializeDocument(profile) : defaultProfile;
    return serializedProfile;
  } catch (error) {
    console.error('Error fetching profile data:', error);
    return defaultProfile;
  }
}

// Generate metadata dynamically
export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfileData();
  
  if (!profile) {
    return defaultMetadata;
  }
  
  return {
    title: `${profile.name} - ${profile.title} Portfolio`,
    description: profile.bio?.substring(0, 160) || defaultMetadata.description,
    openGraph: {
      title: `${profile.name} - ${profile.title}`,
      description: profile.bio?.substring(0, 160) || defaultMetadata.description,
      images: [profile.imageUrl],
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getProfileData();
  
  return (
    <html lang="en" className={montserrat.variable}>
      <body className="flex flex-col min-h-screen bg-white">
        <Header profile={profile} />
        <main className="flex-grow">{children}</main>
        <Footer profile={profile} />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // This script ensures localStorage is available for client components
              // that might still try to access profile_data
              if (typeof window !== 'undefined') {
                window.addEventListener('load', async () => {
                  try {
                    // Fetch current profile data from API and store in localStorage
                    const res = await fetch('/api/profile');
                    if (res.ok) {
                      const data = await res.json();
                      localStorage.setItem('profile_data', JSON.stringify(data));
                    }
                  } catch (e) {
                    console.error('Error syncing profile data to localStorage:', e);
                  }
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
