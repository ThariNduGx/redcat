export const HUB_FRANCHISE_CPANEL_URL =
  process.env.NEXT_PUBLIC_HUB_FRANCHISE_CPANEL_URL ||
  "https://apply.bestproducts.lk/hub-apply.php";

export interface BilingualText {
  en: string;
  si: string;
}

export interface OptionItem {
  value: string;
  en: string;
  si: string;
}

export const OCCUPATION_OPTIONS: OptionItem[] = [
  { value: "Business owner", en: "Business owner", si: "ව්‍යාපාරික" },
  { value: "Private employee", en: "Private employee", si: "පෞද්ගලික සේවක" },
  { value: "Government employee", en: "Government employee", si: "රාජ්‍ය සේවක" },
  { value: "Self-employed", en: "Self-employed", si: "ස්වයං රැකියා" },
  { value: "Overseas employee", en: "Overseas employee", si: "විදේශ රැකියා" },
  { value: "Retired", en: "Retired", si: "විශ්‍රාමික" },
  { value: "Other", en: "Other", si: "වෙනත්" },
];

export const FAMILIARITY_OPTIONS: OptionItem[] = [
  { value: "Very familiar", en: "Very familiar", si: "ඉතා හොඳයි" },
  { value: "Moderate", en: "Moderate", si: "සාමාන්‍යයි" },
  { value: "Not familiar", en: "Not familiar", si: "අවබෝධයක් නැත" },
];

export const YES_NO_OPTIONS: OptionItem[] = [
  { value: "Yes", en: "Yes", si: "ඔව්" },
  { value: "No", en: "No", si: "නැත" },
];

export const BUSINESS_TYPE_OPTIONS: OptionItem[] = [
  { value: "Retail", en: "Retail", si: "සිල්ලර" },
  { value: "Wholesale & distribution", en: "Wholesale & distribution", si: "තොග හා බෙදාහැරීම්" },
  { value: "Transport", en: "Transport", si: "ප්‍රවාහන" },
  { value: "Courier & logistics", en: "Courier & logistics", si: "පාර්සල් හා සැපයුම්" },
  { value: "Manufacturing", en: "Manufacturing", si: "නිෂ්පාදන" },
  { value: "Services", en: "Services", si: "සේවා" },
  { value: "Other", en: "Other", si: "වෙනත්" },
  { value: "Not applicable", en: "Not applicable", si: "අදාළ නොවේ" },
];

export const EXPERIENCE_YEARS_OPTIONS: OptionItem[] = [
  { value: "None", en: "None", si: "නැත" },
  { value: "Under 1 year", en: "Under 1 year", si: "වසරකට අඩු" },
  { value: "1–3 years", en: "1–3 years", si: "වසර 1–3" },
  { value: "3–5 years", en: "3–5 years", si: "වසර 3–5" },
  { value: "Over 5 years", en: "Over 5 years", si: "වසර 5කට වැඩි" },
];

export const EMPLOYEES_MANAGED_OPTIONS: OptionItem[] = [
  { value: "None", en: "None", si: "නැත" },
  { value: "1–5", en: "1–5", si: "1–5" },
  { value: "6–10", en: "6–10", si: "6–10" },
  { value: "11–20", en: "11–20", si: "11–20" },
  { value: "Over 20", en: "Over 20", si: "20කට වැඩි" },
];

export const INVESTMENT_OPTIONS: OptionItem[] = [
  { value: "Below LKR 2M", en: "Below LKR 2M", si: "අඩු LKR 2M" },
  { value: "LKR 2–3M", en: "LKR 2–3M", si: "LKR 2–3M" },
  { value: "LKR 3–5M", en: "LKR 3–5M", si: "LKR 3–5M" },
  { value: "LKR 5–10M", en: "LKR 5–10M", si: "LKR 5–10M" },
  { value: "Above LKR 10M", en: "Above LKR 10M", si: "වැඩි LKR 10M" },
];

export const FUNDS_AVAILABILITY_OPTIONS: OptionItem[] = [
  { value: "Fully", en: "Fully", si: "සම්පූර්ණයෙන්" },
  { value: "Partially", en: "Partially", si: "කොටසක්" },
  { value: "Arranging", en: "Arranging", si: "සම්පාදනය කරමින්" },
];

export const INVESTMENT_SOURCE_OPTIONS: OptionItem[] = [
  { value: "Personal", en: "Personal", si: "පෞද්ගලික" },
  { value: "Business", en: "Business", si: "ව්‍යාපාරික" },
  { value: "Bank loan", en: "Bank loan", si: "බැංකු ණය" },
  { value: "Partner", en: "Partner", si: "හවුල්කරු" },
  { value: "Combination", en: "Combination", si: "ක්‍රම කිහිපයක්" },
];

export const THREE_MONTHS_OPS_OPTIONS: OptionItem[] = [
  { value: "Yes", en: "Yes", si: "ඔව්" },
  { value: "No", en: "No", si: "නැත" },
  { value: "Need information", en: "Need information", si: "වැඩිදුර තොරතුරු අවශ්‍යයි" },
];

export const PREMISES_STATUS_OPTIONS: OptionItem[] = [
  { value: "Own", en: "Own", si: "තමන්ගේ" },
  { value: "Rented", en: "Rented", si: "කුලී" },
  { value: "Identified", en: "Identified", si: "හඳුනාගෙන ඇත" },
  { value: "Searching", en: "Searching", si: "සොයමින්" },
];

export const FLOOR_AREA_OPTIONS: OptionItem[] = [
  { value: "Below 1,500", en: "Below 1,500 sq. ft.", si: "වර්ග අඩි 1,500ට අඩු" },
  { value: "1,500–2,000", en: "1,500–2,000 sq. ft.", si: "1,500–2,000" },
  { value: "2,000–3,000", en: "2,000–3,000 sq. ft.", si: "2,000–3,000" },
  { value: "Above 3,000", en: "Above 3,000 sq. ft.", si: "වර්ග අඩි 3,000ට වැඩි" },
  { value: "Not identified", en: "Not identified", si: "තීරණය කර නැත" },
];

export const VEHICLE_ACCESS_OPTIONS: OptionItem[] = [
  { value: "Yes", en: "Yes", si: "ඔව්" },
  { value: "No", en: "No", si: "නැත" },
  { value: "Can arrange", en: "Can arrange", si: "සකස් කළ හැකිය" },
];

export const EARLY_NIGHT_ACCESS_OPTIONS: OptionItem[] = [
  { value: "Yes", en: "Yes", si: "ඔව්" },
  { value: "No", en: "No", si: "නැත" },
  { value: "To confirm", en: "To confirm", si: "තහවුරු කළ යුතුයි" },
];

export const VEHICLE_TYPE_OPTIONS: OptionItem[] = [
  { value: "Motorcycle", en: "Motorcycle", si: "යතුරුපැදි" },
  { value: "Three-wheeler", en: "Three-wheeler", si: "ත්‍රිරෝද රථ" },
  { value: "Van", en: "Van", si: "වෑන්" },
  { value: "Small truck", en: "Small truck", si: "කුඩා ලොරි" },
  { value: "Medium or large truck", en: "Medium or large truck", si: "මධ්‍යම හෝ විශාල ලොරි" },
  { value: "None", en: "None", si: "නැත" },
];

export const VEHICLE_COUNT_OPTIONS: OptionItem[] = [
  { value: "None", en: "None", si: "නැත" },
  { value: "1", en: "1", si: "1" },
  { value: "2–3", en: "2–3", si: "2–3" },
  { value: "4–5", en: "4–5", si: "4–5" },
  { value: "Over 5", en: "Over 5", si: "5කට වැඩි" },
];

export const TRANSPORT_ARRANGEMENT_OPTIONS: OptionItem[] = [
  { value: "Own", en: "Own", si: "තමන්ගේ" },
  { value: "Purchase", en: "Purchase", si: "මිලදී ගැනීම" },
  { value: "Lease or rent", en: "Lease or rent", si: "ලීසිං හෝ කුලී" },
  { value: "Contracted", en: "Contracted", si: "ගිවිසුම්ගත" },
  { value: "Combination", en: "Combination", si: "ක්‍රම කිහිපයක්" },
];

export const DAILY_MANAGER_OPTIONS: OptionItem[] = [
  { value: "Self", en: "Self", si: "මා විසින්" },
  { value: "Partner", en: "Partner", si: "හවුල්කරු" },
  { value: "Family", en: "Family", si: "පවුලේ සාමාජිකයෙක්" },
  { value: "Manager", en: "Manager", si: "කළමනාකරු" },
];

export const PRIMARY_BUSINESS_OPTIONS: OptionItem[] = [
  { value: "Primary", en: "Primary", si: "ප්‍රධාන" },
  { value: "Additional", en: "Additional", si: "අමතර" },
];

export const COORDINATE_POINTS_OPTIONS: OptionItem[] = [
  { value: "Yes", en: "Yes", si: "ඔව්" },
  { value: "No", en: "No", si: "නැත" },
  { value: "With training", en: "With training", si: "පුහුණුව සමඟ" },
];

export const COMPUTER_KNOWLEDGE_OPTIONS: OptionItem[] = [
  { value: "Basic", en: "Basic", si: "මූලික" },
  { value: "Intermediate", en: "Intermediate", si: "මධ්‍යම" },
  { value: "Advanced", en: "Advanced", si: "උසස්" },
];

export const COMMENCE_WHEN_OPTIONS: OptionItem[] = [
  { value: "Immediately", en: "Immediately", si: "වහාම" },
  { value: "Within 30 days", en: "Within 30 days", si: "දින 30 ඇතුළත" },
  { value: "60 days", en: "60 days", si: "දින 60" },
  { value: "90 days", en: "90 days", si: "දින 90" },
  { value: "Over 90 days", en: "Over 90 days", si: "දින 90ට වැඩි" },
];

export const HEAR_ABOUT_OPTIONS: OptionItem[] = [
  { value: "Facebook", en: "Facebook", si: "Facebook" },
  { value: "Instagram", en: "Instagram", si: "Instagram" },
  { value: "TikTok", en: "TikTok", si: "TikTok" },
  { value: "YouTube", en: "YouTube", si: "YouTube" },
  { value: "TV", en: "TV", si: "රූපවාහිනිය" },
  { value: "Newspaper", en: "Newspaper", si: "පුවත්පත්" },
  { value: "Referral", en: "Referral", si: "නිර්දේශයක්" },
  { value: "Website", en: "Website", si: "වෙබ් අඩවිය" },
  { value: "Other", en: "Other", si: "වෙනත්" },
];

export const SECTIONS = [
  { id: 1, code: "01", en: "Personal information", si: "පෞද්ගලික තොරතුරු" },
  { id: 2, code: "02", en: "Preferred Hub location", si: "අපේක්ෂිත Hub ස්ථානය" },
  { id: 3, code: "03", en: "Business & management experience", si: "ව්‍යාපාරික හා කළමනාකරණ පළපුරුද්ද" },
  { id: 4, code: "04", en: "Financial capability", si: "මූල්‍ය හැකියාව" },
  { id: 5, code: "05", en: "Premises & infrastructure", si: "ගොඩනැගිලි හා යටිතල පහසුකම්" },
  { id: 6, code: "06", en: "Transport & vehicles", si: "ප්‍රවාහන හා වාහන" },
  { id: 7, code: "07", en: "Operational commitment", si: "මෙහෙයුම් සඳහා කැපවීම" },
  { id: 8, code: "08", en: "Technology & training", si: "තාක්ෂණය හා පුහුණුව" },
  { id: 9, code: "09", en: "Business readiness", si: "ව්‍යාපාරික සූදානම" },
  { id: 10, code: "10", en: "Applicant declaration", si: "අයදුම්කරුගේ ප්‍රකාශය" },
] as const;

export const SELECTION_PROCESS: Array<{ step: string; en: string; si: string }> = [
  { step: "01", en: "Online registration", si: "මූලික ලියාපදිංචිය" },
  { step: "02", en: "Lead scoring", si: "ලකුණු ඇගයීම" },
  { step: "03", en: "Telephone interview", si: "දුරකථන සම්මුඛ පරීක්ෂණය" },
  { step: "04", en: "Detailed application", si: "සවිස්තර අයදුම්පත" },
  { step: "05", en: "Financial verification", si: "මූල්‍ය තහවුරු කිරීම" },
  { step: "06", en: "Premises and vehicle inspection", si: "ගොඩනැගිලි හා වාහන පරීක්ෂාව" },
  { step: "07", en: "Final interview", si: "අවසාන සම්මුඛ පරීක්ෂණය" },
  { step: "08", en: "Approval and agreement", si: "අනුමැතිය හා ගිවිසුම" },
  { step: "09", en: "Three-day certificate course", si: "දින තුනක සහතිකපත් පාඨමාලාව" },
  { step: "10", en: "Setup and operational testing", si: "ස්ථාපනය හා මෙහෙයුම් පරීක්ෂාව" },
  { step: "11", en: "Hub opening", si: "Hub ආරම්භය" },
];

export interface HubFranchiseFormData {
  // 01 Personal information
  fullName: string;
  mobileNumber: string;
  whatsappNumber: string;
  email: string;
  residentialDistrict: string;
  residentialTown: string;
  currentOccupation: string;
  // 02 Preferred Hub location
  preferredDistrict: string;
  firstPreferredHub: string;
  secondPreferredHub: string;
  operatingAreaFamiliarity: string;
  existingBusinessConnections: string;
  // 03 Business & management experience
  currentlyOperateBusiness: string;
  currentBusinessType: string;
  yearsExperience: string;
  logisticsExperience: string;
  largestEmployeesManaged: string;
  // 04 Financial capability
  totalAvailableInvestment: string;
  fundsCurrentlyAvailable: string;
  investmentSource: string;
  fundThreeMonthsOps: string;
  // 05 Premises & infrastructure
  suitablePremises: string;
  availableFloorArea: string;
  vehicleAccessParkingLoading: string;
  earlyNightAccess: string;
  proposedHubAddress: string;
  googleMapsLocation: string;
  // 06 Transport & vehicles
  ownCommercialVehicles: string;
  availableVehicleTypes: string[];
  vehicleCountForRedcat: string;
  transportArrangement: string;
  manageMaintenanceFuelDrivers: string;
  // 07 Operational commitment
  dailyManager: string;
  primaryBusiness: string;
  recruitManageStaffDrivers: string;
  coordinatePoints: string;
  maintainShifts: string;
  operateDailyWeekendsHolidays: string;
  followProcedures: string;
  // 08 Technology & training
  computerMobileKnowledge: string;
  useRedcatItSystem: string;
  completeThreeDayCourse: string;
  // 09 Business readiness
  commenceWhen: string;
  whyInterested: string;
  howDidYouHear: string;
  // 10 Applicant declaration
  agreePrivacyTerms: boolean;
  agreeContact: boolean;
  applicantName: string;
  signature: string;
  declarationDate: string;
}

export interface ScoreBreakdown {
  financial: number; // max 25
  transport: number; // max 20
  premises: number; // max 20
  management: number; // max 15
  operational: number; // max 10
  readiness: number; // max 5
  technology: number; // max 5
  total: number; // max 100
  tier: "A+" | "A" | "B" | "C";
  tierLabel: BilingualText;
}

export function scoreHubFranchise(d: HubFranchiseFormData): ScoreBreakdown {
  // Financial capability (25)
  let financial = 0;
  if (d.totalAvailableInvestment === "Above LKR 10M" || d.totalAvailableInvestment === "LKR 5–10M") financial += 12;
  else if (d.totalAvailableInvestment === "LKR 3–5M") financial += 10;
  else if (d.totalAvailableInvestment === "LKR 2–3M") financial += 7;
  else if (d.totalAvailableInvestment === "Below LKR 2M") financial += 2;

  if (d.fundsCurrentlyAvailable === "Fully") financial += 8;
  else if (d.fundsCurrentlyAvailable === "Partially") financial += 4;
  else if (d.fundsCurrentlyAvailable === "Arranging") financial += 1;

  if (d.fundThreeMonthsOps === "Yes") financial += 5;
  else if (d.fundThreeMonthsOps === "Need information") financial += 2;

  // Transport (20)
  let transport = 0;
  if (d.ownCommercialVehicles === "Yes") transport += 5;
  else if (d.ownCommercialVehicles === "No") transport += 1;

  if (d.vehicleCountForRedcat === "Over 5") transport += 7;
  else if (d.vehicleCountForRedcat === "4–5") transport += 6;
  else if (d.vehicleCountForRedcat === "2–3") transport += 5;
  else if (d.vehicleCountForRedcat === "1") transport += 3;

  if (d.transportArrangement === "Own") transport += 4;
  else if (d.transportArrangement === "Purchase" || d.transportArrangement === "Combination") transport += 3;
  else if (d.transportArrangement === "Lease or rent" || d.transportArrangement === "Contracted") transport += 2;

  if (d.manageMaintenanceFuelDrivers === "Yes") transport += 4;

  // Premises (20)
  let premises = 0;
  if (d.suitablePremises === "Own") premises += 6;
  else if (d.suitablePremises === "Rented") premises += 5;
  else if (d.suitablePremises === "Identified") premises += 3;
  else if (d.suitablePremises === "Searching") premises += 1;

  if (d.availableFloorArea === "Above 3,000" || d.availableFloorArea === "2,000–3,000") premises += 6;
  else if (d.availableFloorArea === "1,500–2,000") premises += 5;
  else if (d.availableFloorArea === "Below 1,500") premises += 2;

  if (d.vehicleAccessParkingLoading === "Yes") premises += 4;
  else if (d.vehicleAccessParkingLoading === "Can arrange") premises += 2;

  if (d.earlyNightAccess === "Yes") premises += 4;
  else if (d.earlyNightAccess === "To confirm") premises += 2;

  // Management experience (15)
  let management = 0;
  if (d.currentlyOperateBusiness === "Yes") management += 3;

  if (d.yearsExperience === "Over 5 years") management += 5;
  else if (d.yearsExperience === "3–5 years") management += 4;
  else if (d.yearsExperience === "1–3 years") management += 3;
  else if (d.yearsExperience === "Under 1 year") management += 1;

  if (d.logisticsExperience === "Yes") management += 4;

  if (d.largestEmployeesManaged === "Over 20" || d.largestEmployeesManaged === "11–20") management += 3;
  else if (d.largestEmployeesManaged === "6–10") management += 2;
  else if (d.largestEmployeesManaged === "1–5") management += 1;

  // Operational commitment (10)
  let operational = 0;
  if (d.primaryBusiness === "Primary") operational += 2;
  else if (d.primaryBusiness === "Additional") operational += 1;

  if (d.recruitManageStaffDrivers === "Yes") operational += 2;
  if (d.coordinatePoints === "Yes") operational += 2;
  else if (d.coordinatePoints === "With training") operational += 1;
  if (d.maintainShifts === "Yes") operational += 2;
  if (d.operateDailyWeekendsHolidays === "Yes") operational += 1;
  if (d.followProcedures === "Yes") operational += 1;

  // Business readiness (5)
  let readiness = 0;
  if (d.commenceWhen === "Immediately" || d.commenceWhen === "Within 30 days") readiness += 4;
  else if (d.commenceWhen === "60 days") readiness += 3;
  else if (d.commenceWhen === "90 days") readiness += 2;
  else if (d.commenceWhen === "Over 90 days") readiness += 1;

  if (d.whyInterested.trim().length >= 15) readiness += 1;

  // Technology & training (5)
  let technology = 0;
  if (d.computerMobileKnowledge === "Advanced" || d.computerMobileKnowledge === "Intermediate") technology += 2;
  else if (d.computerMobileKnowledge === "Basic") technology += 1;
  if (d.useRedcatItSystem === "Yes") technology += 2;
  if (d.completeThreeDayCourse === "Yes") technology += 1;

  const total = financial + transport + premises + management + operational + readiness + technology;
  let tier: "A+" | "A" | "B" | "C" = "C";
  let tierLabel: BilingualText = { en: "Manual review", si: "නැවත සමාලෝචනය" };

  if (total >= 80) {
    tier = "A+";
    tierLabel = { en: "Priority interview", si: "ප්‍රමුඛ සම්මුඛ පරීක්ෂණය" };
  } else if (total >= 65) {
    tier = "A";
    tierLabel = { en: "Interview", si: "සම්මුඛ පරීක්ෂණය" };
  } else if (total >= 50) {
    tier = "B";
    tierLabel = { en: "Further assessment", si: "වැඩිදුර ඇගයීම" };
  }

  return {
    financial,
    transport,
    premises,
    management,
    operational,
    readiness,
    technology,
    total,
    tier,
    tierLabel,
  };
}
