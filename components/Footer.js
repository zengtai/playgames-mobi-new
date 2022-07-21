import Link from "next/link";

export default function Footer(params) {
  return (
    <>
      <footer>
        <nav>
          <Link href={`/t/privacy-policy`}>Privacy Policy</Link>
          <Link href={`/t/terms-of-use`}>Terms of Use</Link>
        </nav>
        <p>Copyright &copy; {new Date().getFullYear()}</p>
      </footer>
    </>
  );
}
