import Button from "./Button";

export default function Header() {
  return (
    <div className="w-full sticky rounded-b-lg border-b shadow-md flex items-center justify-between px-2 sm:px-3 md:px-4 py-2 border-b bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
        <span>MySchoolBus App - SuperAdmin Dashboard</span>
        <span>{}</span>
      </div>
      <Button
        className="bg-red-600 hover:bg-red-700 text-white rounded-md px-2 sm:px-3 md:px-4 py-2"
        children={"Logout"}
        type="button"
        onClick={() => {}}
      />
    </div>
  );
}
