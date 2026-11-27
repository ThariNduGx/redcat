export const HUB_FRANCHISE_CPANEL_URL =
  process.env.NEXT_PUBLIC_HUB_FRANCHISE_CPANEL_URL ||
  "https://apply.bestproducts.lk/hub-apply.php";

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
