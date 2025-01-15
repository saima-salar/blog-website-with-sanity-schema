import { createClient } from "next-sanity";
import createImageUrlBuilder from "@sanity/image-url";

// Configuration for the Sanity client
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'lfo3c88d'; // Ensure these are strings
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'; // Ensure these are strings
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-01-01'; // Ensure this follows YYYY-MM-DD format

export const config = {
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // Use the CDN for faster, cache-enabled responses
};

// Initialize the client
export const sanityClient = createClient(config);

// Generate image URLs
export const urlFor = (source) => {
  return createImageUrlBuilder(config).image(source);
};
