import CatLoader from "@/components/ui/CatLoader";

export default function Loading() {
  return (
    <div className="grid min-h-[60vh] place-items-center bg-paper">
      <CatLoader label="On its way…" width={180} />
    </div>
  );
}
