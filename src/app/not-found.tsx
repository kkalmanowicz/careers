import Link from "next/link";

export default function NotFound() {
  return (
    <main style={{ fontFamily: "monospace", padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <h1>404 — Not Found</h1>
      <p>This agent role doesn&apos;t exist or has been filled.</p>
      <p>
        <Link href="/en">← Browse all agent careers</Link>
      </p>
    </main>
  );
}
