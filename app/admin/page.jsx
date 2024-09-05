import CountCard from "./components/CountCard";
import { StickyNote, UserRound, List } from "lucide-react";

export default function Page() {
  return (
    <main className="w-full min-h-screen p-4 sm:p-6 md:p-10 dark:bg-black">
      <div className="flex flex-col gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
        <CountCard name={"Posts"} path={"posts"} icon={<StickyNote size={20} />} />
        <CountCard name={"Authors"} path={"authors"} icon={<UserRound size={20} />} />
        <CountCard name={"Categories"} path={"categories"} icon={<List size={20} />} />
      </div>
    </main>
  );
}
