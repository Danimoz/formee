import { auth } from "@/auth";
import SettingsForm from "./form";
import { redirect } from "next/navigation";

export default async function Settings() {
  const session = await auth()
  if (!session) redirect('/login')
    
  return (
    <section className="container md:mx-auto mx-4">
      <h1 className="text-2xl font-bold">Settings</h1>
      <SettingsForm />
    </section>
  )
}