import { MessagesSquare, History, BookOpen } from "lucide-react";

const SidebarBottom = () => {
  const pathname =
    typeof window !== "undefined" ? window.location.pathname : "/";
  const items = [
    { name: "Chat", href: "/chat", icon: MessagesSquare },
    { name: "History", href: "/history", icon: History },
    { name: "Docs", href: "#", icon: BookOpen },
  ];

  return (
    <div className="flex flex-col w-full items-center">
      {items.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.href;
        return (
          <>
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
              <Icon size={24} color={item.name === "Chat" ? "blue" : "black"} />
            </a>
            {(item.name === "Chat" || item.name === "Docs") && (
              <hr className="border-b-2 border-gray-200 w-2/3 my-2" />
            )}
          </>
        );
      })}
      <div
        className={`mt-1 w-10 h-10 rounded-full bg-amber-200 dark:bg-amber-400/50 text-black dark:text-blue-400 flex items-center justify-center font-bold`}
      >
        KM
      </div>
    </div>
  );
};

export default SidebarBottom;
