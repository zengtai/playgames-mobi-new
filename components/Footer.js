import Link from "next/link";
import { SITE_META } from "../lib/constants";

export default function Footer(params) {
  return (
    <>
      <footer>
        <nav>
          <Link href={`/t/privacy-policy`}>Privacy Policy</Link>
          <Link href={`/t/terms-of-use`}>Terms of Use</Link>
        </nav>
        <p>
          Copyright &copy; {new Date().getFullYear()} {SITE_META.name}. All
          Rights Reserved.
        </p>
      </footer>
    </>
  );
}
