import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@sanity/client';

// Initialize the Sanity client
const client = createClient({
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'lfo3c88d',
  useCdn: false,  // Set to false when working with write operations like create
  token: process.env.SANITY_API_TOKEN ,
});

export default async function createComment(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { _id, name, email, comment } = JSON.parse(req.body);

  // Ensure all necessary fields are provided
  if (!name || !email || !comment || !_id) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Fetch the post to ensure it exists
  const post = await client.fetch(
    `*[_type == "post" && _id == $id][0]`,
    { id: _id }
  );

  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  try {
    // Create a new comment document in Sanity
    await client.create({
      _type: 'comment', // Ensure this matches your Sanity schema
      post: {
        _type: 'reference',
        _ref: _id, // Reference the post by its ID
      },
      name,
      email,
      comment,
      approved: false,  // Set to false by default for manual approval later
    });

    console.log('Comment Submitted');
    return res.status(200).json({ message: 'Comment Submitted!' });
  } catch (err) {
    console.error('Error submitting comment:', err);
    return res.status(500).json({ message: 'Could not submit comment', error: err });
  }
}
