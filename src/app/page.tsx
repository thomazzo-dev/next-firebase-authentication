import Link from "next/link";

export default function Home() {
  return (
    <div className="w-full">
      <header className="flex items-center justify-between h-16 shadow-black w-full px-2 py-4">
        <h1>authentication ex</h1>
        <div className="flex items-center gap-4">
          <Link href="/sign-in">
            <button className="btn btn-primary">sign in</button>
          </Link>
          <Link href={"/sign-up"}>
            <button className="btn btn-secondary">sign up</button>
          </Link>
        </div>
      </header>
    </div>
  );
}
