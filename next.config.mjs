/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      
      remotePatterns: [
        {
          protocol: "https",
          hostname: "res.cloudinary.com",
          pathname: "/**",
        },
        {
          protocol: "https",
          hostname: "via.placeholder.com", // Add this pattern
          pathname: "/**",
        },
        
           // Add the external domains here
      
        
        
      ],
      minimumCacheTTL: 60,
    },
  };
  
  export default nextConfig;
  














  
  