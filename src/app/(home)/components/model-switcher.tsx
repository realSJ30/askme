"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GptModels } from "@/lib/types";
import { Brain } from "lucide-react";

interface ModelSwitcherProps {
  model: GptModels;
  setModel: (model: GptModels) => void;
}
const ModelSwitcher = ({ model, setModel }: ModelSwitcherProps) => {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size={"icon"} className="shrink-0">
          <Brain className="size-5 text-sky-500 shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>GPT Model</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={model}
          onValueChange={(val) => {
            setModel(val as GptModels);
          }}
        >
          <DropdownMenuRadioItem value="gpt-4o-mini">
            GPT-4
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="gpt-3.5-turbo">
            GPT-3.5
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ModelSwitcher;
