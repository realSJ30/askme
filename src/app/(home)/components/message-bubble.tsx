import { cn } from "@/lib/utils";
import { Ellipsis, LoaderPinwheel } from "lucide-react";

interface MessageBubbleProps {
  role: "function" | "system" | "user" | "assistant" | "tool";
  content: string;
  isLoading?: boolean;
}

const MessageBubble = ({ role, content, isLoading }: MessageBubbleProps) => {
  return (
    <div
      className={cn(
        "p-4 rounded-xl w-fit flex flex-col items-start",
        role === "user"
          ? "bg-white border border-black/10 place-self-end"
          : "bg-neutral-100"
      )}
    >
      {isLoading && <Ellipsis className="size-4 animate-bounce" />}
      <p className="text-sm">{content}</p>
      <p
        className={cn(
          "text-xs text-neutral-600 mt-1.5",
          role === "user" ? "place-self-end" : "place-self-start"
        )}
      >
        {isLoading ? "AI is thinking" : role === "user" ? "You" : "AI"}
      </p>
    </div>
  );
};

export default MessageBubble;
