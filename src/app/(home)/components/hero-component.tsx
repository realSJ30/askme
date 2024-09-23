import { MessageCircleDashed } from "lucide-react";

const HeroComponent = () => {
  return (
    <div className="flex flex-col items-center gap-y-2">
      <div className="rounded-lg shadow-lg bg-white p-4">
        <MessageCircleDashed className="size-8 text-black" />
      </div>
      <h1 className="font-semibold mt-8">AskMe</h1>
      <p className="text-sm text-center text-neutral-400">
        Ask me any questions you want. I know everything.
      </p>
    </div>
  );
};

export default HeroComponent;
