"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAlert } from "@/hooks/useAlert";
import { useAppDispatch } from "@/store/hooks";
import { setTheme as setThemeDispatch } from "@/store/slice/ui/uiSlice";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
export default function Home() {
  const { setTheme } = useTheme();
  const alert = useAlert();
  // This component provides a dropdown menu to switch between light, dark, and system themes

  return <div className=""></div>;
}
