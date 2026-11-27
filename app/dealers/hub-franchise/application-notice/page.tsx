import type { Metadata } from "next";
import schema from "@/infra/cpanel-hub-franchise/application-schema.json";

export const metadata: Metadata = {
  title: "Hub Franchise Privacy Notice and Application Terms",
  alternates: { canonical: "/dealers/hub-franchise/application-notice" },
};

const clauses = [
  {
    en: "Privacy notice",
    si: "පෞද්ගලිකත්ව නිවේදනය",
    text: "RedCat, operated by Idea Innovations (Pvt) Limited, collects the contact, location, business, investment, premises, transport and declaration details you submit. Authorized franchise staff use them to assess applications, arrange interviews and verification, and contact you about your application.",
    translation: "Idea Innovations (Pvt) Limited විසින් මෙහෙයවන RedCat, ඔබ යොමු කරන සම්බන්ධතා, ස්ථානය, ව්‍යාපාරය, ආයෝජනය, ගොඩනැගිලි, ප්‍රවාහනය සහ ප්‍රකාශය පිළිබඳ තොරතුරු රැස් කරයි. අවසර ලත් කණ්ඩායම අයදුම්පත් ඇගයීමට, සම්මුඛ පරීක්ෂණ සහ තහවුරු කිරීම් සැලසුම් කිරීමට සහ ඔබ හා සම්බන්ධ වීමට එම තොරතුරු භාවිත කරයි.",
  },
  {
    en: "Access and retention",
    si: "ප්‍රවේශය සහ රඳවා තබා ගැනීම",
    text: "Submissions are stored on RedCat’s application hosting service. RedCat keeps them while reviewing the application and as needed to follow up, resolve disputes or meet legal obligations. Contact RedCat to ask about retention, request a copy, correct your details or ask for deletion. Include your application reference if you have it.",
    translation: "අයදුම්පත් RedCat හි අයදුම්පත් සත්කාරක සේවාවේ ගබඩා වේ. අයදුම්පත සලකා බලන අතරතුර සහ පසු විපරම්, ආරවුල් විසඳීම හෝ නීතිමය බැඳීම් සඳහා අවශ්‍ය කාලය තුළ ඒවා රඳවා තබා ගනී. රඳවා තබන කාලය දැන ගැනීමට, පිටපතක් ඉල්ලීමට, තොරතුරු නිවැරදි කිරීමට හෝ මකා දැමීමට RedCat අමතන්න. යොමු අංකය තිබේ නම් එය සඳහන් කරන්න.",
  },
  {
    en: "Franchise application terms",
    si: "ව්‍යාපාරික නියෝජිත අයදුම්පත් කොන්දේසි",
    text: "Submit accurate information to the best of your knowledge. RedCat may ask you to verify your answers and supporting details during its review. Submission begins the assessment and creates no franchise agreement, reservation or obligation to pay. Any franchise offer is subject to approval and a separate agreement.",
    translation: "ඔබ දන්නා පරිදි නිවැරදි තොරතුරු යොමු කරන්න. සමාලෝචනයේදී RedCat ඔබේ පිළිතුරු හා අදාළ තොරතුරු තහවුරු කරන ලෙස ඉල්ලා සිටිය හැක. අයදුම්පත යොමු කිරීමෙන් ඇගයීම ආරම්භ වන අතර ගිවිසුමක්, වෙන් කිරීමක් හෝ ගෙවීමේ බැඳීමක් ඇති නොවේ. ඕනෑම ව්‍යාපාරික නියෝජිත පිරිනැමීමක් අනුමැතියට සහ වෙනම ගිවිසුමකට යටත් වේ.",
  },
];

export default function ApplicationNotice() {
  return (
    <article className="mx-auto max-w-3xl space-y-8 px-5 py-12 sm:py-20">
      <header className="border-b border-ink/20 pb-6">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">Hub Franchise Privacy Notice and Application Terms</h1>
        <p lang="si" className="mt-3 text-lg font-bold">පෞද්ගලිකත්ව නිවේදනය සහ අයදුම්පත් කොන්දේසි</p>
        <p className="mt-3 text-sm text-ink/70">Version {schema.termsVersion}</p>
      </header>
      {clauses.map((clause) => (
        <section key={clause.en} className="space-y-3 leading-relaxed">
          <h2 className="text-xl font-bold">{clause.en} <span lang="si" className="block text-base text-ink/75">{clause.si}</span></h2>
          <p>{clause.text}</p>
          <p lang="si">{clause.translation}</p>
        </section>
      ))}
      <a href="/contact" className="inline-flex min-h-12 items-center font-bold underline underline-offset-4">Contact RedCat <span lang="si" className="ml-2">RedCat අමතන්න</span></a>
    </article>
  );
}
