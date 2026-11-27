export const POINT_FRANCHISE_CPANEL_URL =
  process.env.NEXT_PUBLIC_POINT_FRANCHISE_CPANEL_URL ||
  "https://apply.bestproducts.lk/point-apply.php";

export interface OptionItem {
  value: string;
  en: string;
  si: string;
}

export const POINT_OCCUPATION_INITIAL: OptionItem[] = [
  { value: "Business owner", en: "Business owner", si: "ව්‍යාපාරික" },
  { value: "Employed", en: "Employed", si: "රැකියාවක නියුතු" },
  { value: "Self-employed", en: "Self-employed", si: "ස්වයං රැකියා" },
  { value: "Other", en: "Other", si: "වෙනත්" },
];

export const POINT_OCCUPATION_DETAILED: OptionItem[] = [
  { value: "Business owner", en: "Business owner", si: "ව්‍යාපාරික" },
  { value: "Private or government employee", en: "Private or government employee", si: "පෞද්ගලික හෝ රාජ්‍ය සේවක" },
  { value: "Self-employed", en: "Self-employed", si: "ස්වයං රැකියා" },
  { value: "Overseas employee or returnee", en: "Overseas employee or returnee", si: "විදේශ රැකියා හෝ නැවත පැමිණි" },
  { value: "Retired", en: "Retired", si: "විශ්‍රාමික" },
  { value: "Not employed", en: "Not employed", si: "රැකියාවක් නැත" },
  { value: "Other", en: "Other", si: "වෙනත්" },
];

export const POINT_INVESTMENT_OPTIONS: OptionItem[] = [
  { value: "<1M", en: "Below LKR 1M", si: "රු. මිලියන 1ට අඩු (<1)" },
  { value: "1–1.5M", en: "LKR 1–1.5M", si: "රු. මිලියන 1–1.5" },
  { value: "1.5–2M", en: "LKR 1.5–2M", si: "රු. මිලියන 1.5–2" },
  { value: "2–3M", en: "LKR 2–3M", si: "රු. මිලියන 2–3" },
  { value: ">3M", en: "Above LKR 3M", si: "රු. මිලියන 3ට වැඩි (>3)" },
];

export const POINT_PREMISES_OPTIONS: OptionItem[] = [
  { value: "Own", en: "Own", si: "තමන්ගේ" },
  { value: "Rented", en: "Rented", si: "කුලියට ගත්" },
  { value: "Planning to rent", en: "Planning to rent", si: "කුලියට ගැනීමට සැලසුම් කර ඇත" },
];

export const POINT_START_OPTIONS: OptionItem[] = [
  { value: "Immediately", en: "Immediately", si: "වහාම" },
  { value: "Within 30 days", en: "Within 30 days", si: "දින 30 තුළ" },
  { value: "Within 60 days", en: "Within 60 days", si: "දින 60 තුළ" },
  { value: "Within 90 days", en: "Within 90 days", si: "දින 90 තුළ" },
];

export const YES_NO_OPTIONS: OptionItem[] = [
  { value: "Yes", en: "Yes", si: "ඔව්" },
  { value: "No", en: "No", si: "නැත" },
];

export const POINT_YEARS_OPTIONS: OptionItem[] = [
  { value: "None", en: "None", si: "නැත" },
  { value: "1–3", en: "1–3 years", si: "වසර 1–3" },
  { value: "3–5", en: "3–5 years", si: "වසර 3–5" },
  { value: "5+", en: "5+ years", si: "වසර 5+" },
];

export const SKILL_LEVEL_OPTIONS: OptionItem[] = [
  { value: "Basic", en: "Basic", si: "මූලික" },
  { value: "Intermediate", en: "Intermediate", si: "මධ්‍යම" },
  { value: "Advanced", en: "Advanced", si: "උසස්" },
];

export const FUNDS_READY_OPTIONS: OptionItem[] = [
  { value: "Fully", en: "Fully", si: "සම්පූර්ණයෙන්" },
  { value: "Partially", en: "Partially", si: "කොටසක්" },
  { value: "Not yet", en: "Not yet", si: "තවම නැත" },
];

export const FUNDING_SOURCE_OPTIONS: OptionItem[] = [
  { value: "Own funds", en: "Own funds", si: "තමන්ගේ මුදල්" },
  { value: "Bank loan", en: "Bank loan", si: "බැංකු ණය" },
  { value: "Business partner", en: "Business partner", si: "ව්‍යාපාරික හවුල්කරු" },
];

export const WORKING_CAP_OPTIONS: OptionItem[] = [
  { value: "Yes", en: "Yes", si: "ඔව්" },
  { value: "No", en: "No", si: "නැත" },
  { value: "Need more information", en: "Need more information", si: "වැඩි විස්තර අවශ්‍යයි" },
];

export const POINT_SIZE_OPTIONS: OptionItem[] = [
  { value: "<300", en: "Under 300 sq. ft.", si: "වර්ග අඩි 300ට අඩු (<300)" },
  { value: "300–500", en: "300–500 sq. ft.", si: "වර්ග අඩි 300–500" },
  { value: "500–1,000", en: "500–1,000 sq. ft.", si: "වර්ග අඩි 500–1,000" },
  { value: "1,000+", en: "1,000+ sq. ft.", si: "වර්ග අඩි 1,000+" },
];

export const POINT_MANAGER_OPTIONS: OptionItem[] = [
  { value: "Self", en: "Self", si: "තමන්" },
  { value: "Family member", en: "Family member", si: "පවුලේ සාමාජිකයෙක්" },
  { value: "Manager", en: "Manager", si: "කළමනාකරුවෙක්" },
];

export const POINT_BUSINESS_MODE_OPTIONS: OptionItem[] = [
  { value: "Full-time", en: "Full-time", si: "පූර්ණකාලීන" },
  { value: "Additional business", en: "Additional business", si: "අමතර ව්‍යාපාරයක්" },
];

export const POINT_SECTIONS = [
  { id: 1, code: "01", en: "Initial online registration", si: "මූලික මාර්ගගත ලියාපදිංචිය" },
  { id: 2, code: "02", en: "Personal & location details", si: "පෞද්ගලික හා ස්ථාන තොරතුරු" },
  { id: 3, code: "03", en: "Business experience", si: "ව්‍යාපාරික පළපුරුද්ද" },
  { id: 4, code: "04", en: "Financial capability", si: "මූල්‍ය හැකියාව" },
  { id: 5, code: "05", en: "Business premises", si: "ව්‍යාපාරික ස්ථානය" },
  { id: 6, code: "06", en: "Operational commitment", si: "මෙහෙයුම් සඳහා කැපවීම" },
] as const;

export const POINT_SELECTION_WORKFLOW = [
  { step: "01", en: "Online registration", si: "මාර්ගගත ලියාපදිංචිය" },
  { step: "02", en: "Lead qualification", si: "සුදුසුකම් ඇගයීම" },
  { step: "03", en: "Telephone interview", si: "දුරකථන සම්මුඛ පරීක්ෂණය" },
  { step: "04", en: "Location inspection", si: "ස්ථාන පරීක්ෂාව" },
  { step: "05", en: "Final interview", si: "අවසාන සම්මුඛ පරීක්ෂණය" },
  { step: "06", en: "Franchise approval & agreement", si: "අනුමැතිය හා ගිවිසුම" },
  { step: "07", en: "Training", si: "පුහුණුව" },
  { step: "08", en: "Point opening", si: "Point විවෘත කිරීම" },
];

export interface PointFranchiseFormData {
  // 01 Initial online registration
  fullName: string;
  mobileNumber: string;
  email: string;
  residentialDistrict: string;
  currentOccupation: string;
  preferredDistrict: string;
  preferredPoint: string;
  secondPreference: string;
  availableInvestment: string;
  businessPremises: string;
  previousBusinessExperience: string;
  whenCanYouStart: string;
  agreePrivacyTerms: boolean;
  agreeContact: boolean;
  // 02 Personal & location details
  whatsappNumber: string;
  residentialTown: string;
  occupationDetails: string;
  knowledgeOfPreferredArea: string;
  existingLocalContacts: string;
  // 03 Business experience
  currentlyOperatingBusiness: string;
  yearsBusinessExperience: string;
  currentBusinessType: string;
  courierLogisticsExperience: string;
  customerServiceExperience: string;
  computerAppSkills: string;
  // 04 Financial capability
  investmentFundsReady: string;
  fundingSource: string;
  additionalWorkingCapital: string;
  // 05 Business premises
  premisesSize: string;
  mainRoadFrontage: string;
  parkingAvailable: string;
  existingBusinessAtSite: string;
  proposedBusinessAddress: string;
  googleMapsLocation: string;
  // 06 Operational commitment
  whoWillManagePoint: string;
  mainOrAdditionalBusiness: string;
  readyToRecruitStaff: string;
  canMeetServiceHours: string;
  willingToCompleteTraining: string;
  willingToUseItSystem: string;
  agreeOperationalStandards: string;
}

export interface PointScoreBreakdown {
  investment: number; // 30
  locationPremises: number; // 25
  experience: number; // 15
  operational: number; // 15
  readiness: number; // 10
  localKnowledge: number; // 5
  total: number; // 100
  tier: "A+" | "A" | "B" | "C";
  tierLabel: { en: string; si: string };
}

export function scorePointFranchise(d: PointFranchiseFormData): PointScoreBreakdown {
  // 1. Investment capability (30)
  let investment = 0;
  if (d.availableInvestment === ">3M" || d.availableInvestment === "2–3M") investment += 18;
  else if (d.availableInvestment === "1.5–2M") investment += 15;
  else if (d.availableInvestment === "1–1.5M") investment += 10;
  else if (d.availableInvestment === "<1M") investment += 4;

  if (d.investmentFundsReady === "Fully") investment += 8;
  else if (d.investmentFundsReady === "Partially") investment += 4;

  if (d.additionalWorkingCapital === "Yes") investment += 4;
  else if (d.additionalWorkingCapital === "Need more information") investment += 2;

  // 2. Business location & premises (25)
  let locationPremises = 0;
  if (d.businessPremises === "Own") locationPremises += 10;
  else if (d.businessPremises === "Rented") locationPremises += 8;
  else if (d.businessPremises === "Planning to rent") locationPremises += 4;

  if (d.premisesSize === "1,000+" || d.premisesSize === "500–1,000") locationPremises += 7;
  else if (d.premisesSize === "300–500") locationPremises += 5;
  else if (d.premisesSize === "<300") locationPremises += 2;

  if (d.mainRoadFrontage === "Yes") locationPremises += 4;
  if (d.parkingAvailable === "Yes") locationPremises += 4;

  // 3. Business experience (15)
  let experience = 0;
  if (d.previousBusinessExperience === "Yes") experience += 5;
  if (d.yearsBusinessExperience === "5+") experience += 4;
  else if (d.yearsBusinessExperience === "3–5") experience += 3;
  else if (d.yearsBusinessExperience === "1–3") experience += 2;
  if (d.courierLogisticsExperience === "Yes") experience += 3;
  if (d.customerServiceExperience === "Yes") experience += 3;

  // 4. Operational commitment (15)
  let operational = 0;
  if (d.mainOrAdditionalBusiness === "Full-time") operational += 3;
  else if (d.mainOrAdditionalBusiness === "Additional business") operational += 2;
  if (d.readyToRecruitStaff === "Yes") operational += 2;
  if (d.canMeetServiceHours === "Yes") operational += 3;
  if (d.willingToCompleteTraining === "Yes") operational += 3;
  if (d.willingToUseItSystem === "Yes") operational += 2;
  if (d.agreeOperationalStandards === "Yes") operational += 2;

  // 5. Business readiness (10)
  let readiness = 0;
  if (d.whenCanYouStart === "Immediately") readiness += 10;
  else if (d.whenCanYouStart === "Within 30 days") readiness += 8;
  else if (d.whenCanYouStart === "Within 60 days") readiness += 5;
  else if (d.whenCanYouStart === "Within 90 days") readiness += 3;

  // 6. Local market knowledge (5)
  let localKnowledge = 0;
  if (d.knowledgeOfPreferredArea === "Yes") localKnowledge += 3;
  if (d.existingLocalContacts === "Yes") localKnowledge += 2;

  const total =
    investment +
    locationPremises +
    experience +
    operational +
    readiness +
    localKnowledge;

  let tier: "A+" | "A" | "B" | "C" = "C";
  let tierLabel = { en: "C Review — Hold / Manual review", si: "රඳවා තැබීම / නිලධාරී සමාලෝචනය" };

  if (total >= 80) {
    tier = "A+";
    tierLabel = { en: "A+ Priority — Priority interview", si: "ප්‍රමුඛ සම්මුඛ පරීක්ෂණය" };
  } else if (total >= 65) {
    tier = "A";
    tierLabel = { en: "A Qualified — Interview", si: "සම්මුඛ පරීක්ෂණය" };
  } else if (total >= 50) {
    tier = "B";
    tierLabel = { en: "B Potential — Further assessment", si: "වැඩිදුර ඇගයීම" };
  }

  return {
    investment,
    locationPremises,
    experience,
    operational,
    readiness,
    localKnowledge,
    total,
    tier,
    tierLabel,
  };
}
