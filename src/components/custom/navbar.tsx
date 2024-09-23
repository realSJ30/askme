import { MessageCircleDashed } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="fixed flex items-center gap-x-2 w-full h-12 inset-x-0 p-4">
      <MessageCircleDashed className="size-8 text-black" />
      <span className="text-xs text-neutral-600 font-medium">AskMe</span>
    </nav>
  );
};

export default Navbar;
