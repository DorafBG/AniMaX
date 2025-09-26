"use client"
import Image from "next/image"

type AnimeCardProps = {
  title: string
  image: string
  rating: number
}

export default function AnimeCard({ title, image, rating }: AnimeCardProps) {
  const stars = Array(5).fill(0)

  return (
    <div className="flex flex-col items-center w-40">
      <Image
        src={image}
        alt={title}
        width={160}
        height={220}
        className="rounded-md shadow-lg"
      />
      <h3 className="mt-2 text-white font-medium">{title}</h3>
      <div className="flex mt-1">
        {stars.map((_, i) => (
          <span key={i} className={i < rating ? "text-yellow-400" : "text-gray-500"}>
            ★
          </span>
        ))}
      </div>
    </div>
  )
}
