import type { Metadata } from "next";
import { Suspense } from "react";
import FranchiseApplicationNotice, { FranchiseNoticeContent } from "@/components/FranchiseApplicationNotice";
import schema from "@/infra/cpanel-hub-franchise/point-application-schema.json";

export const metadata: Metadata = {
  title: "Point Franchise Privacy Notice and Application Terms",
  alternates: { canonical: "/dealers/point/application-notice" },
};

const title = {
  en: "Point Franchise Privacy Notice and Application Terms",
  si: "Point ව්‍යාපාරික නියෝජිත පෞද්ගලිකත්ව නිවේදනය සහ අයදුම්පත් කොන්දේසි"
};
const clauses = [
  {
    en: "Privacy notice",
    si: "පෞද්ගලිකත්ව නිවේදනය",
    text: "RedCat, operated by Idea Innovations (Pvt) Limited, collects your contact, location, business and investment answers to review your application and contact you about the next stage. Authorized reviewers may collect additional qualification details, premises photos, identity documents, bank statements and business registration documents during the qualification stage. RedCat keeps the information while reviewing your application and as needed for follow-up, disputes or legal obligations.",
    translation: "Idea Innovations (Pvt) Limited විසින් මෙහෙයවන RedCat, ඔබේ අයදුම්පත සමාලෝචනය කිරීමට සහ ඊළඟ අදියර ගැන ඔබ අමතන්නට සම්බන්ධතා, ස්ථානය, ව්‍යාපාරය සහ ආයෝජනය පිළිබඳ තොරතුරු රැස් කරයි. ලියාපදිංචියෙන් පසු අවසර ලත් කණ්ඩායම සුදුසුකම් ඇගයීමේදී අමතර තොරතුරු, ව්‍යාපාරික ස්ථානයේ ඡායාරූප, හැඳුනුම් ලේඛන, බැංකු වාර්තා සහ ව්‍යාපාර ලියාපදිංචි ලේඛන රැස් කළ හැකිය. අයදුම්පත සමාලෝචනය සහ අවශ්‍ය පසු විපරම්, ආරවුල් හෝ නීතිමය බැඳීම් සඳහා තොරතුරු තබා ගනී."
  },
  {
    en: "Application terms",
    si: "අයදුම්පත් කොන්දේසි",
    text: "Provide accurate information. Point preferences are subject to location verification and approval. Registration creates no reservation, franchise agreement or payment obligation. A franchise offer requires separate approval and an agreement.",
    translation: "නිවැරදි තොරතුරු සපයන්න. කැමති Point ස්ථාන තහවුරු කිරීම සහ අනුමැතියට යටත් වේ. ලියාපදිංචියෙන් වෙන් කිරීමක්, ව්‍යාපාරික ගිවිසුමක් හෝ ගෙවීමේ බැඳීමක් ඇති නොවේ. පිරිනැමීමකට වෙනම අනුමැතියක් සහ ගිවිසුමක් අවශ්‍ය වේ."
  }
];
const contactNote = {
  en: "To request access, correction or deletion, contact RedCat with your application reference.",
  si: "තොරතුරු ලබා ගැනීම, නිවැරදි කිරීම හෝ මකා දැමීම ඉල්ලීමට යොමු අංකය සමඟ RedCat අමතන්න."
};

export default function PointApplicationNotice() {
  const notice = { title, clauses, contactNote, version: schema.termsVersion };

  return (
    <Suspense fallback={<FranchiseNoticeContent {...notice} lang="en" />}>
      <FranchiseApplicationNotice {...notice} />
    </Suspense>
  );
}
