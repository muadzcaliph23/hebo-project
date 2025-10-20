"use client";
import { Home, BrainCog, KeyRound } from "lucide-react";
import SidebarBottom from "./SidebarBottom";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { useEffect } from "react";

const Sidebar = () => {
  const pathname =
    typeof window !== "undefined" ? window.location.pathname : "/";

  const items = [
    { name: "Home", href: "/", icon: Home, shortcut: "G" },
    { name: "Model", href: "/model", icon: BrainCog, shortcut: "M" },
    { name: "Keys", href: "#", icon: KeyRound, shortcut: "K" },
  ];

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.key === "m" || e.key === "M") && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        window.location.href = "/model";
      } else if ((e.key === "g" || e.key === "G") && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        window.location.href = "/";
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <aside className="w-20 h-screen fixed top-0 left-0 z-10 bg-white/90 backdrop-blur border-r border-gray-200 pt-5 pb-8 flex flex-col items-center justify-between">
      <div className="flex flex-col w-full items-center">
        <img
          src="/hebo_logo.webp"
          alt="logo"
          width={30}
          height={30}
          className="mb-2"
        />
        {items.map(
          (i) =>
            window.location.pathname === i.href && (
              <div className="border-[1.5px] font-medium border-gray-300 px-2.5 py-1 rounded-sm mt-2 mb-4">
                {i.shortcut}
              </div>
            )
        )}
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <a
              key={item.name}
              href={item.href}
              className={`w-full flex items-center justify-center py-3 px-2 transition-colors duration-300 ${
                active
                  ? "bg-blue-100 text-amber-700"
                  : "text-gray-700 hover:bg-blue-100"
              }`}
              title={item.name}
            >
              <HoverCard>
                <HoverCardTrigger>
                  <Icon size={24} color="black" />
                </HoverCardTrigger>
                <HoverCardContent>
                  {item.name}{" "}
                  <span className="text-xs text-gray-300 mr-0.5">⌘</span>
                  <span className="text-gray-300">{item.shortcut}</span>
                </HoverCardContent>
              </HoverCard>
            </a>
          );
        })}
      </div>
      <SidebarBottom />
    </aside>
  );
};

export default Sidebar;
