import { GetStaticProps } from 'next';
import React, { useState } from 'react';
import { PortableText } from '@portabletext/react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { sanityClient, urlFor } from '../../sanity';
import { Post } from '../../typings';
import { useForm, SubmitHandler } from 'react-hook-form';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';

interface Props {
  post: Post;
}

type Inputs = {
  _id: string;
  name: string;
  email: string;
  comment: string;
};

const PostPage = ({ post }: Props) => {
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    fetch('/api/createComment', {
      method: 'POST',
      body: JSON.stringify(data),
    })
      .then(() => {
        setSubmitted(true);
      })
      .catch(() => {
        setSubmitted(false);
      });
  };

  return (
    <div>
      <Header />
      {/* Main Image */}
      <img
        className="w-full h-96 object-cover"
        src={urlFor(post.mainImage).url()!}
        alt="coverImage"
      />

      {/* Article */}
      <div className="max-w-3xl mx-auto mb-10">
        <article className="w-full mx-auto p-5 bg-secondaryColor/10">
          <h1 className="font-titleFont font-medium text-[32px] text-primary border-b-[1px] border-b-cyan-800 mt-10 mb-3">
            {post.title}
          </h1>
          <h2 className="font-bodyFont text-[18px] text-gray-500 mb-2">
            {post.description}
          </h2>
          <div className="flex items-center gap-2">
            {/* Author Image */}
            <img
              className="rounded-full w-12 h-12 object-cover bg-red-400"
              src={urlFor(post.author.image).url()}
              alt="authorImg"
            />
            <p className="font-bodyFont text-base">
              Blog post by{' '}
              <span className="font-bold text-secondaryColor">
                {post.author.name}
              </span>{' '}
              - Published at {new Date(post.publishedAt).toLocaleDateString()}
            </p>
          </div>
          <div className="mt-10">
            <PortableText
              value={post.body}
              components={{
                types: {
                  image: ({ value }: { value: SanityImageSource }) => {
                    if (!value?.asset?._ref) {
                      console.error('Invalid image value:', value);
                      return null;
                    }
                    return (
                      <img
                        src={urlFor(value).url()!}
                        alt={value.alt || 'Blog Image'}
                        className="w-full h-auto my-4 rounded-md object-cover"
                      />
                    );
                  },
                },
                block: {
                  normal: ({ children }: { children: React.ReactNode }) => (
                    <p className="text-base font-bodyFont">{children}</p>
                  ),
                },
                marks: {
                  link: ({ value, children }: { value: { href: string }; children: React.ReactNode }) => (
                    <a
                      href={value.href}
                      className="text-cyan-500 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {children}
                    </a>
                  ),
                },
              }}
            />
          </div>
        </article>

        <hr className="max-w-lg my-5 mx-auto border-[1px] border-secondaryColor" />

        <div>
          <p className="text-xs text-secondaryColor uppercase font-titleFont font-bold">
            Enjoyed this article?
          </p>
          <h3 className="font-titleFont text-3xl font-bold">
            Leave a comment below!
          </h3>
          <hr className="py-3 mt-2" />
          {/* Form */}
          <input {...register('_id')} type="hidden" value={post._id} />
          <form onSubmit={handleSubmit(onSubmit)} className="mt-7 flex flex-col gap-6">
            <label className="flex flex-col">
              <span className="font-titleFont font-semibold text-base">Name</span>
              <input
                {...register('name', { required: true })}
                className="text-base placeholder:text-sm border-b-[1px] border-secondaryColor py-1 px-4 outline-none focus-within:shadow-xl shadow-secondaryColor"
                type="text"
                placeholder="Enter your name"
              />
            </label>

            <label className="flex flex-col">
              <span className="font-titleFont font-semibold text-base">Email</span>
              <input
                {...register('email', { required: true })}
                className="text-base placeholder:text-sm border-b-[1px] border-secondaryColor py-1 px-4 outline-none focus-within:shadow-xl shadow-secondaryColor"
                type="email"
                placeholder="Enter your email"
              />
            </label>

            <label className="flex flex-col">
              <span className="font-titleFont font-semibold text-base">Comment</span>
              <textarea
                {...register('comment', { required: true })}
                className="text-base placeholder:text-sm border-b-[1px] border-secondaryColor py-1 px-4 outline-none focus-within:shadow-xl shadow-secondaryColor"
                placeholder="Enter your comment"
                rows={6}
              />
            </label>

            <button
              className="w-full bg-bgColor text-white text-base font-titleFont font-semibold tracking-wider uppercase py-2 rounded-sm hover:bg-secondaryColor duration-300"
              type="submit"
            >
              Submit
            </button>
          </form>

          {/* Comments */}
          <div className="w-full flex flex-col p-10 my-10 mx-auto shadow-bgColor shadow-lg space-y-2">
            <h3 className="text-3xl font-titleFont font-semibold">Comments</h3>
            <hr />
            {post.comments.map((comment) => (
              <div key={comment._id}>
                <p>
                  <span className="text-secondaryColor">{comment.name}</span>{' '}
                  {comment.comment}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PostPage;

export const getStaticPaths = async () => {
  const query = `*[_type == "post"]{
    _id,
    slug {
      current
    }
  }`;

  const posts = await sanityClient.fetch(query);
  const paths = posts.map((post: Post) => ({
    params: { slug: post.slug.current },
  }));

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = `*[_type == "post" && slug.current == $slug][0]{
    _id,
    publishedAt,
    title,
    author -> {
      name,
      image
    },
    "comments":*[_type == "comment" && post._ref == ^._id && approved == true],
    description,
    mainImage,
    slug,
    body
  }`;

  const post = await sanityClient.fetch(query, { slug: params?.slug });

  if (!post) {
    return { notFound: true };
  }

  return {
    props: { post },
    revalidate: 60,
  };
};
