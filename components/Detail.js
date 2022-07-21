import Link from "next/link";

import Image from "./Image";

export default function Detail({ item }) {
  return (
    <>
      <Image id={item.id} alt={item.title} />
      <h1>{item.title}</h1>
      <div>
        <span>{item.category}</span>
      </div>
      <div>{item.description}</div>
      <Link href={item.game_url}>
        <a>Play Now</a>
      </Link>
    </>
  );
}
