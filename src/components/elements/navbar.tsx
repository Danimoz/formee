import Link from "next/link";
import { Button } from "../ui/button";

export default function Navbar() {
  return (
    <header className="sticky top-0 py-4 border-b border-border/40 bg-white z-10">
      <div className="md:container mx-4 md:mx-auto flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Formee</h1>
        </div>
        <nav className="flex items-center gap-2 md:gap-4 max-w-full">
          <Link href="/dashboard">
            <Button variant='ghost' className="text-sm font-normal">Dashboard</Button>
          </Link>
          <Link href="/dashboard/create">
            <Button className="rounded-full text-sm font-normal">Create Form</Button>
          </Link>
        </nav>
      </div>
    </header>
  )
}