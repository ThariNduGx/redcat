import type { Metadata } from "next";
import schema from "@/infra/cpanel-hub-franchise/point-application-schema.json";

export const metadata: Metadata = {
  title: "Point Franchise Privacy Notice and Application Terms",
  alternates: { canonical: "/dealers/point/application-notice" },
};

export default function PointApplicationNotice() {
  return (
    <article className="mx-auto max-w-3xl space-y-6 px-5 py-12 leading-relaxed">
      <header className="border-b border-ink/15 pb-5">
        <h1 className="text-3xl leading-tight font-extrabold tracking-tight sm:text-5xl">Point Franchise Privacy Notice and Application Terms</h1>
        <p lang="si" className="mt-2 font-bold">Point ව්‍යාපාරික නියෝජිත පෞද්ගලිකත්ව නිවේදනය සහ අයදුම්පත් කොන්දේසි</p>
        <p className="mt-2 text-sm text-ink/70">Version {schema.termsVersion}</p>
      </header>
      <section className="space-y-2">
        <h2 className="text-xl font-bold">Privacy notice <span lang="si" className="block text-base">පෞද්ගලිකත්ව නිවේදනය</span></h2>
        <p>RedCat, operated by Idea Innovations (Pvt) Limited, collects your contact, location, business and investment answers to review your application and contact you about the next stage. Authorized reviewers may collect additional qualification details, premises photos, identity documents, bank statements and business registration documents during the qualification stage. RedCat keeps the information while reviewing your application and as needed for follow-up, disputes or legal obligations.</p>
        <p lang="si">Idea Innovations (Pvt) Limited විසින් මෙහෙයවන RedCat, ඔබේ අයදුම්පත සමාලෝචනය කිරීමට සහ ඊළඟ අදියර ගැන ඔබ අමතන්නට සම්බන්ධතා, ස්ථානය, ව්‍යාපාරය සහ ආයෝජනය පිළිබඳ තොරතුරු රැස් කරයි. ලියාපදිංචියෙන් පසු අවසර ලත් කණ්ඩායම සුදුසුකම් ඇගයීමේදී අමතර තොරතුරු, ව්‍යාපාරික ස්ථානයේ ඡායාරූප, හැඳුනුම් ලේඛන, බැංකු වාර්තා සහ ව්‍යාපාර ලියාපදිංචි ලේඛන රැස් කළ හැකිය. අයදුම්පත සමාලෝචනය සහ අවශ්‍ය පසු විපරම්, ආරවුල් හෝ නීතිමය බැඳීම් සඳහා තොරතුරු තබා ගනී.</p>
      </section>
      <section className="space-y-2">
        <h2 className="text-xl font-bold">Application terms <span lang="si" className="block text-base">අයදුම්පත් කොන්දේසි</span></h2>
        <p>Provide accurate information. Point preferences are subject to location verification and approval. Registration creates no reservation, franchise agreement or payment obligation. A franchise offer requires separate approval and an agreement.</p>
        <p lang="si">නිවැරදි තොරතුරු සපයන්න. කැමති Point ස්ථාන තහවුරු කිරීම සහ අනුමැතියට යටත් වේ. ලියාපදිංචියෙන් වෙන් කිරීමක්, ව්‍යාපාරික ගිවිසුමක් හෝ ගෙවීමේ බැඳීමක් ඇති නොවේ. පිරිනැමීමකට වෙනම අනුමැතියක් සහ ගිවිසුමක් අවශ්‍ය වේ.</p>
      </section>
      <p>To request access, correction or deletion, contact RedCat with your application reference.</p>
      <p lang="si">තොරතුරු ලබා ගැනීම, නිවැරදි කිරීම හෝ මකා දැමීම ඉල්ලීමට යොමු අංකය සමඟ RedCat අමතන්න.</p>
      <a href="/contact" className="inline-flex min-h-12 items-center font-bold underline underline-offset-4">Contact RedCat <span lang="si" className="ml-2">RedCat අමතන්න</span></a>
    </article>
  );
}
