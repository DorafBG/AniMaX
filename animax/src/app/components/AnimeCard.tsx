"use client";
import Image from "next/image";
import Link from "next/link";

type AnimeCardProps = {
  id: number;
  title: string;
  image: string;
  rating: number;
};

export default function AnimeCard({ id, title, image, rating }: AnimeCardProps) {
  const stars = Array(5).fill(0);
  const numericRating = rating ? Number(rating) : 0;
  const starsRating = (numericRating / 10) * 5;

  return (
    <Link
      href={`/anime/${id}`}
      className="
        flex flex-col items-center 
        w-44 cursor-pointer transition-transform duration-300 
        hover:scale-105
      "
    >
      <div
        className="
          relative w-[180px] h-[260px] 
          overflow-hidden rounded-md shadow-lg
        "
      >
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
      </div>

      <h3 className="mt-2 text-white font-medium text-center line-clamp-2">
        {title}
      </h3>

      <div className="flex items-center mt-1 gap-1">
        <div className="flex">
          {stars.map((_, i) => (
            <span
              key={i}
              className={i < Math.round(starsRating) ? "text-yellow-400" : "text-gray-500"}
            >
              ★
            </span>
          ))}
        </div>
        <span className="text-gray-400 text-sm ml-1">
          {numericRating > 0 ? numericRating.toFixed(1) : "N/A"}/10
        </span>
      </div>
    </Link>
  );
}
