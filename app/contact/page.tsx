import { getSanityPageContent } from "@/lib/sanity.queries";
import ContactForm from "./ContactForm";

export default async function ContactPage() {
  const sanityPage = await getSanityPageContent("contact").catch(() => null);
  const hero = {
    eyebrow:    sanityPage?.contactHero?.eyebrow    ?? "Get In Touch",
    heading:    sanityPage?.contactHero?.heading    ?? "Start a Project",
    subheading: sanityPage?.contactHero?.subheading ?? "Tell us about your community, your timeline, and your vision. We'll tell you which surface system brings it to life.",
  };

  return <ContactForm {...hero} />;
}
