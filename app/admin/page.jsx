import CountCard from "./components/CountCard";
import { StickyNote, UserRound, List } from "lucide-react";

export default function Page() {
  return (
    <main className="min-h-screen w-full p-4 sm:p-6 md:p-10 dark:bg-gray-900">
      <div className=" flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <CountCard name={"Posts"} path={"posts"} icon={<StickyNote size={20} />} />
        <CountCard name={"Authors"} path={"authors"} icon={<UserRound size={20} />} />
        <CountCard name={"Categories"} path={"categories"} icon={<List size={20} />} />
      </div>
    </main>
  );
}