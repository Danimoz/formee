import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import Link from "next/link";
import { featuresList } from "./page.constants";
import Navbar from "@/components/elements/navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <section className="md:container mx-4 md:mx-auto px-8 py-20">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="space-y-6">
              <h1 className="text-4xl font-medium md:text-6xl">Create forms with just prompts</h1>
              <p className="mt-4 text-lg md:text-xl max-w-[90%] text-muted-foreground leading-relaxed">
                Transform your ideas into interactive forms using simple language. Engage your respondents with a conversational experience.
              </p>
              <div className="flex flex-col gap-4 md:flex-row md:gap-6">
                <Link href="/create">
                  <Button size='lg' className="rounded-full text-base">Get Started</Button>
                </Link>
                <Link href="/examples">
                  <Button size='lg' variant='outline' className="rounded-full text-base">Examples</Button>
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="max-w-md w-full overflow-hidden rounded-2xl space-y-4 p-6 bg-background shadow-lg">
                <div className="flex items-center gap-2">
                  <span className="rounded-full h-8 w-8 bg-primary text-primary-foreground flex justify-center items-center">AI</span>
                  <div className="rounded-lg bg-muted p-3">
                    <p>How do you rate our services on a scale of 1-5?</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-muted p-3">
                    <p>I&apos;ll give it a 5! The service was excellent.</p>
                  </div>
                  <span className="rounded-full h-8 w-8 bg-primary text-primary-foreground flex justify-center items-center">U</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full h-8 w-8 bg-primary text-primary-foreground flex justify-center items-center">AI</span>
                  <div className="rounded-lg bg-muted p-3">
                    <p>Great! What aspects of our product quality impressed you the most?</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Input className="rounded-full h-12" placeholder="Type your response here" disabled />
                  <Button size='icon' className="rounded-full h-11 w-11 disabled">
                    <Send />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="py-20 bg-accent/30">
          <div className="md:container mx-4 md:mx-auto px-8">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold md:text-4xl">Features</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Everything you need to create engaging forms and collect meaningful responses.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-12">
              {featuresList.map((feature, index) => (
                <div key={index} className="rounded-2xl bg-background p-8 space-y-3 shadow-sm">
                  <div className="bg-accent text-primary p-3 rounded-full inline-flex justify-center items-center">{feature.icon}</div>
                  <h3 className="text-xl font-medium">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="md:container mx-4 md:mx-auto rounded-3xl bg-primary p-12 text-center text-primary-foreground">
            <h2 className="text-3xl font-medium mb-4 sm:text-4xl">Ready to transform your forms?</h2>
            <p className="text-primary-foreground/90 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of businesses that use Formee to create engaging forms and collect meaningful responses.
            </p>
            <div className="flex justify-center">
              <Button size='lg' variant='secondary' className="rounded-full text-base">
                <Link href='/dashboard'>Try for free</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
