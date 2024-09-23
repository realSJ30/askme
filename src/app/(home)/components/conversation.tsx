"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { MessageSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Loader, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { ChatCompletionMessageParam } from "openai/src/resources/index.js";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import HeroComponent from "./hero-component";
import MessageBubble from "./message-bubble";

const Conversation = () => {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatCompletionMessageParam[]>([]);

  const form = useForm<z.infer<typeof MessageSchema>>({
    resolver: zodResolver(MessageSchema),
    defaultValues: {
      message: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (data: z.infer<typeof MessageSchema>) => {
    try {
      const userMessage: ChatCompletionMessageParam = {
        role: "user",
        content: data.message,
      };
      const newMessages = [...messages, userMessage];

      setMessages([...newMessages]);

      const response = await axios.post("/api/conversation", {
        messages: newMessages,
      });

      setMessages((currentMessage) => [...currentMessage, response.data]);
      form.reset();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    } finally {
      router.refresh();
    }
  };

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView();
    }
  }, [messages, isLoading]);

  return (
    <div className="h-full flex flex-col items-center justify-center py-12 px-4">
      {messages.length === 0 ? (
        <div className="flex-1 flex justify-center items-center max-w-[640px] w-full">
          <HeroComponent />
        </div>
      ) : (
        <div className="flex-1 flex items-end mb-8 max-w-[640px] w-full">
          <ScrollArea className="h-[calc(100vh-200px)] w-full py-4 px-0">
            <div className="flex flex-col gap-y-4 w-full">
              {messages.map((message, index) => (
                <MessageBubble
                  key={index}
                  role={message.role}
                  content={`${message.content?.toString()}`}
                />
              ))}
              {isLoading && (
                <MessageBubble role="assistant" content="" isLoading />
              )}
            </div>
            <div ref={scrollRef}></div>
          </ScrollArea>
        </div>
      )}

      {/* chat input here */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex gap-x-2 p-4 rounded-lg items-end border border-neutral-300 bg-white shadow-sm w-full max-w-[640px] focus-within:ring-1 focus-within:ring-black"
        >
          <FormField
            disabled={isLoading}
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Textarea
                    placeholder="Ask me anything..."
                    className="border-none shadow-none focus-visible:ring-0 resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            disabled={!form.formState.isDirty || isLoading}
            type="submit"
            size={"icon"}
            className={"rounded-lg p-4 bg-neutral-300"}
          >
            {isLoading ? (
              <Loader className="size-5 animate-spin shrink-0 text-neutral-400" />
            ) : (
              <Send className="size-5 shrink-0 text-neutral-400" />
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Conversation;
