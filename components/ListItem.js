import Link from "next/link";
import Image from "./Image";
export default function ListItem({ item }) {
  return (
    <>
      <li>
        <Link href={`/game/${item.slug}`}>
          <a>
            <Image alt={item.title} />
            <h2>{item.title}</h2>
            <div>
              <span>{item.category}</span>
            </div>
          </a>
        </Link>
      </li>
    </>
  );
}
