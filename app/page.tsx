"use client";
import ReduxPersistenceTest from "@/components/test/ReduxPersistenceTest";
import { useAlert } from "@/hooks/useAlert";
import { useTheme } from "next-themes";
export default function Home() {
  const { setTheme } = useTheme();
  const alert = useAlert();
  // This component provides a dropdown menu to switch between light, dark, and system themes

  return (
    <div className="">
      <ReduxPersistenceTest />
    </div>
  );
}
