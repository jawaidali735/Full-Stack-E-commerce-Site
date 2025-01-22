"use client"

import { useState, useEffect } from "react";
import { client } from "@/sanity/lib/client";
import { FaStar } from "react-icons/fa";
import { Product } from "../../sanity.types";

// Define the review type
interface Review {
  _id: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ReviewProps {
  product: Product;
}

const StarReview = ({ product }: ReviewProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const reviewsQuery = `*[_type == "review" && productId._ref == $productId] | order(createdAt desc) {
      _id,
      name,
      rating,
      comment,
      createdAt
    }`;

    // Fetch initial reviews
    const fetchReviews = async () => {
      const fetchedReviews = await client.fetch(reviewsQuery, {
        productId: product._id,
      });
      setReviews(fetchedReviews);
    };

    fetchReviews();

    // Real-time updates for reviews
    const subscription = client.listen(
      '*[_type == "review" && productId._ref == $productId]',
      { productId: product._id }
    ).subscribe((update: any) => { // Using `any` for now to allow mutationType
      if (update.mutationType === "create") {
        setReviews((prevReviews) => [update.document, ...prevReviews]);
      }
    });

    // Cleanup the subscription when the component unmounts
    return () => {
      subscription.unsubscribe();
    };
  }, [product._id]);

  const totalRatings = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = reviews.length ? totalRatings / reviews.length : 0;

  return (
    <div>
      <div className="flex items-center space-x-2 text-[#FFC416]">
        {[...Array(5)].map((_, i) => (
          <FaStar
            key={i}
            className={
              i < Math.round(averageRating)
                ? "text-yellow-500"
                : "text-gray-300"
            }
          />
        ))}
        <p className="text-[#151875] font-josefin">
          ({reviews.length}) {/* Number of reviews */}
        </p>
      </div>
    </div>
  );
};

export default StarReview;
