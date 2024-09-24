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
import { GptModels } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, Send } from "lucide-react";
import { ChatCompletionMessageParam } from "openai/src/resources/index.js";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import HeroComponent from "./hero-component";
import MessageBubble from "./message-bubble";
import ModelSwitcher from "./model-switcher";

const Conversation = () => {
  const [messages, setMessages] = useState<ChatCompletionMessageParam[]>([]);
  const [buffValue, setBuffValue] = useState("");
  const [model, setModel] = useState<GptModels>("gpt-4o-mini");

  const handleSetModel = useCallback((model: GptModels) => {
    setModel(model);
  }, []);

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

      const response = await fetch("/api/conversation", {
        method: "POST",
        body: JSON.stringify({
          messages: newMessages,
          model,
        }),
      });
      form.reset();
      if (response.ok) {
        const reader = response.body?.getReader();

        const processStream = async () => {
          if (reader) {
            let unfinishedContent = "";
            while (true) {
              const { done, value } = await reader.read();
              if (done) {
                let assistantMessage: ChatCompletionMessageParam = {
                  role: "assistant",
                  content: unfinishedContent,
                };
                setMessages((currentMessage) => [
                  ...currentMessage,
                  assistantMessage,
                ]);
                setBuffValue("");
                unfinishedContent = "";

                break;
              }
              let chunk = new TextDecoder("utf-8").decode(value);
              chunk = chunk.replace(/^data: /, "");
              setBuffValue((prev) => prev + chunk);
              unfinishedContent = unfinishedContent + chunk;
            }
          }
        };
        processStream().catch((err) =>
          toast.error("Something went wrong!", err)
        );
      } else {
        toast.error("Something went wrong!");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    }
  };

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView();
    }
  }, [messages, buffValue]);

  return (
    <div className="h-full flex flex-col items-center justify-center py-12 px-4 relative">
      <ModelSwitcher setModel={handleSetModel} model={model} />
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
              {buffValue && (
                <MessageBubble role={"assistant"} content={buffValue} />
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
            className={"rounded-lg p-4 "}
          >
            {isLoading ? (
              <Loader className="size-5 animate-spin shrink-0 text-white" />
            ) : (
              <Send className="size-5 shrink-0 text-white" />
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Conversation;
