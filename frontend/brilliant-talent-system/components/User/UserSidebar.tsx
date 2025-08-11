import Link from "next/link";
import { useRouter } from "next/router";

interface SidebarItem {
  icon: string;
  label: string;
  href: string;
}

const UserSidebar = () => {
  const router = useRouter();

  const mainItems: SidebarItem[] = [
    { icon: "fa-home", label: "صفحه اصلی", href: "/" },
    { icon: "fa-file-alt", label: "کارنامه تحصیلی", href: "/transcript" },
    { icon: "fa-book", label: "ثبت نام دروس", href: "/courses" },
    { icon: "fa-calendar-alt", label: "برنامه امتحانات", href: "/exams" },
    { icon: "fa-chart-bar", label: "گزارشات تحصیلی", href: "/reports" },
  ];

  const settingsItems: SidebarItem[] = [
    { icon: "fa-user", label: "پروفایل من", href: "/profile" },
    { icon: "fa-cog", label: "تنظیمات حساب", href: "/settings" },
    { icon: "fa-sign-out-alt", label: "خروج از سیستم", href: "/logout" },
  ];

  const isActive = (href: string) => {
    return router.pathname === href;
  };

  return (
    <aside className="bg-white w-64 min-h-screen shadow-lg fixed top-24 right-0 hidden md:block">
      <div className="p-4 h-full">
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-4">منوی کاربری</h2>
          <ul className="space-y-2">
            {mainItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center px-4 py-3 rounded-lg transition-all duration-300 ${
                    isActive(item.href)
                      ? "bg-blue-50 text-blue-600 border-r-4 border-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <i className={`fas ${item.icon} ml-3`}></i>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t pt-4">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            تنظیمات کاربری
          </h2>
          <ul className="space-y-2">
            {settingsItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center px-4 py-3 rounded-lg transition-all duration-300 ${
                    isActive(item.href)
                      ? "bg-blue-50 text-blue-600 border-r-4 border-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <i className={`fas ${item.icon} ml-3`}></i>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
};

export default UserSidebar;
