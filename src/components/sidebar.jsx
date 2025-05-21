import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { 
  Dropdown, 
  DropdownTrigger, 
  DropdownMenu, 
  DropdownItem 
} from "@heroui/dropdown";
import { Button } from "@heroui/button";
import { useTheme } from "@heroui/use-theme";
import { Avatar } from "@heroui/avatar";
import { User } from "@heroui/user";
import { Card, CardBody, CardFooter } from "@heroui/card";
import { Link } from "@heroui/link";
import { Listbox, ListboxItem, ListboxSection } from "@heroui/listbox";
import { Divider } from "@heroui/divider";
import { Badge } from "@heroui/badge";
import clsx from "clsx";
import { 
  FiChevronDown as ChevronDownIcon, 
  FiChevronRight as ChevronRightIcon,
  FiHome as HomeIcon,
  FiUsers as UsersIcon,
  FiBook as BookIcon,
  FiBriefcase as BriefcaseIcon,
  FiBarChart2 as AnalyticsIcon,
  FiCheckCircle as TasksIcon,
  FiClock as TrackerIcon,
  FiGift as PerksIcon,
  FiFileText as ExpensesIcon,
  FiInfo as HelpIcon,
  FiLogOut as LogoutIcon,
  FiMessageSquare as InterviewIcon,
  FiBookOpen as ResourceHubIcon,
  FiMap as CareerPathIcon,
  FiCpu as AiCounselorIcon,
  FiShoppingCart as POSIcon,
  FiDatabase as InventoryIcon,
  FiBarChart2 as ReportsIcon,
  FiUsers as CustomersIcon,
  FiCreditCard as PaymentsIcon,
  FiSettings as SettingsIcon
} from "react-icons/fi";
import { Chip } from "@heroui/chip";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/contexts/ProfileContext"; // Import useProfile
import { POS_DASHBOARD_URL } from "@/constants/app.constant";

export const Sidebar = ({ className, isOpen }) => {
  const { theme, setTheme } = useTheme();
  const [isExpanded, setIsExpanded] = useState({});
  const [activeItem, setActiveItem] = useState("dashboard");
  const [isCollapsed, setIsCollapsed] = useState(true);
  const { userInfo } = useAuth();
  const { profile } = useProfile(); // Use profile context
  const isOnboarded = profile?.onboardingComplete === true; // Use profile.onboardingComplete

  const menuItems = [
    {
      key: "dashboard",
      label: "Dashboard",
      href: "/",
      icon: <HomeIcon size={20} />,
    },
    {
      key: "pos",
      label: (
        <>
          POS Dashboard
          <Chip color="success" variant="flat" className="ml-2" size="sm">
            Active
          </Chip>
        </>
      ),
      href: isOnboarded ? POS_DASHBOARD_URL : "/onboarding",
      icon: <POSIcon size={20} />,
      external: isOnboarded,
    },
    {
      key: "inventory",
      label: (
        <>
          Inventory
          <Chip color="primary" variant="flat" className="ml-2" size="sm">
            New
          </Chip>
        </>
      ),
      href: "/inventory",
      icon: <InventoryIcon size={20} />,
    },
    {
      key: "reports",
      label: (
        <>
          Reports
        </>
      ),
      href: "/reports",
      icon: <ReportsIcon size={20} />,
    },
    {
      key: "customers",
      label: (
        <>
          Customers
        </>
      ),
      href: "/customers",
      icon: <CustomersIcon size={20} />,
    },
    {
      key: "payments",
      label: (
        <>
          Payments
          <Chip color="success" variant="flat" className="ml-2" size="sm">
            New
          </Chip>
        </>
      ),
      href: "/payments",
      icon: <PaymentsIcon size={20} />,
    },
    {
      key: "settings",
      label: "Settings",
      href: "/settings",
      icon: <SettingsIcon size={20} />,
    },
  ];

  const toggleExpand = (label) => {
    setIsExpanded(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  const handleItemClick = (key) => {
    setActiveItem(key);
  };

  const iconClasses = "text-xl pointer-events-none flex-shrink-0";

  return (
    <aside
      className={clsx(
        "fixed left-0 z-30 transition-all duration-300 ease-in-out bg-background border-r-small border-divider ",
        isOpen ? "translate-x-0" : "-translate-x-full",
        "flex flex-col",
        className
      )}
      style={{ 
        width: isCollapsed ? "5rem" : "18rem",
        top: "64px",
        height: "calc(100vh - 64px)"
      }}
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => setIsCollapsed(true)}
    >
      <div className={clsx(
        "relative flex h-full flex-col", 
        isCollapsed ? "px-2 py-6" : "p-6"
      )}>
        {/* Navigation Menu */}
        <div className={clsx(
          "h-full max-h-full",
          isCollapsed ? "py-3" : "py-6 -mr-6 pr-6"
        )}>
          <div className={clsx(
            "w-full rounded-small",
            !isCollapsed && "px-1 py-2"
          )}>
            <Listbox
              aria-label="Navigation Menu"
              variant="faded"
              selectionMode="single"
              selectedKeys={new Set([activeItem])}
              onSelectionChange={(keys) => {
                if (keys !== "all" && keys.size > 0) {
                  const selectedKey = Array.from(keys)[0];
                  handleItemClick(selectedKey);
                }
              }}
              disableAnimation={true}
              className={clsx("p-0 gap-1", isCollapsed && "items-center")}
              classNames={{
                base: isCollapsed ? "w-auto" : "",
              }}
            >
              {menuItems.map((item, index) => (
                <React.Fragment key={item.key}>
                  <ListboxItem
                    key={item.key}
                    textValue={item.label}
                    className={clsx(
                      "flex items-center gap-2 rounded-md",
                      activeItem === item.key ? "bg-default-100" : "",
                      isCollapsed ? "justify-center p-2 mb-2 w-10 h-10 min-w-0 mx-auto overflow-hidden" : "p-3"
                    )}
                    startContent={
                      <span className={clsx(
                        iconClasses,
                        activeItem === item.key ? "text-foreground" : "text-default-500"
                      )}>
                        {item.icon}
                      </span>
                    }
                    endContent={
                      !isCollapsed && item.expandable && (
                        <Button
                          isIconOnly
                          variant="light" 
                          size="sm"
                          className="p-0 min-w-0 text-default-400"
                          onPress={(e) => {
                            e.stopPropagation();
                            toggleExpand(item.label);
                          }}
                        >
                          {isExpanded[item.label] ? (
                            <ChevronDownIcon size={16} />
                          ) : (
                            <ChevronRightIcon size={16} />
                          )}
                        </Button>
                      )
                    }
                    onPress={() => {
                      if (item.external) {
                        window.open(item.href, "_blank", "noopener,noreferrer");
                      } else if (!item.expandable) {
                        handleItemClick(item.key);
                        if (item.href) window.location.href = item.href;
                      }
                    }}
                    isDisabled={item.disabled}
                    showDivider={index === menuItems.length - 2} // Add divider before last item
                    hideSelectedIcon={true} // Hide selected icon/checkmark
                    classNames={{
                      base: isCollapsed ? "[&>span[data-label=true]]:hidden" : "", // Only hide the specific problematic span
                      title: isCollapsed ? "hidden" : "", // Hide title container when collapsed but show when expanded
                      content: isCollapsed ? "" : "flex items-center", // Ensure content is properly displayed in expanded mode
                    }}
                  >
                    {item.label}
                  </ListboxItem>
                  {!isCollapsed && item.expandable &&
                    isExpanded[item.label] &&
                    item.submenu && (
                      <ListboxSection 
                        className="pl-8 mt-1 space-y-1" 
                        classNames={{ base: "py-0", group: "pl-0" }}
                      >
                        {item.submenu.map((subItem) => (
                          <ListboxItem
                            key={subItem.label}
                            textValue={subItem.label}
                            className="py-1"
                            onPress={() => {
                              window.location.href = subItem.href; // Force navigation
                            }}
                            hideSelectedIcon={true}
                          >
                            {subItem.label}
                          </ListboxItem>
                        ))}
                      </ListboxSection>
                  )}
                </React.Fragment>
              ))}
            </Listbox>
          </div>
        </div>
        {/* Bottom Actions */}
      </div>
    </aside>
  );
};

export default Sidebar;
