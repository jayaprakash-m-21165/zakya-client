import { Button } from "@heroui/button";
import { Kbd } from "@heroui/kbd";
import { Link } from "@heroui/link";
import { Input } from "@heroui/input";
import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@heroui/navbar";
import { Avatar } from "@heroui/avatar";
import { link as linkStyles } from "@heroui/theme";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/dropdown";
import clsx from "clsx";
import { USER_ROLES_LIST } from "@/constants/app.constant";
import { useEffect } from "react";

import { siteConfig } from "@/configs/app.config";
import { ThemeSwitch } from "@/components/theme-switch";
import {
  HeartFilledIcon,
  SearchIcon,
  LogOutIcon,
} from "@/components/icons";
import { Logo } from "@/components/icons";
import { useAuth } from "@/contexts/AuthContext.jsx";
import { useProfile } from "@/contexts/ProfileContext.jsx"; // Import useProfile
import AuthenticationService from "@/services/AuthenticationService";
import { POS_DASHBOARD_URL } from "@/constants/app.constant";

export const Navbar = () => {
  const { isAuthenticated, userInfo } = useAuth();
  const { profile, name, email, shopName, shopLocation } = useProfile(); // Add shop information

  const handleLogout = () => {
    AuthenticationService.clearAuthData();
  };
  
  const searchInput = (
    <Input
      aria-label="Search"
      classNames={{
        inputWrapper: "bg-default-100",
        input: "text-sm",
      }}
      endContent={
        <Kbd className="hidden lg:inline-block" keys={["command"]}>
          K
        </Kbd>
      }
      labelPlacement="outside"
      placeholder="Search..."
      startContent={
        <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
      }
      type="search"
    />
  );

  return (
    <HeroUINavbar maxWidth="4xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand className="gap-3 max-w-fit">
          <Link
            className="flex justify-start items-center gap-2"
            color="foreground"
            href="/"
          >
            <Logo className="h-8" />
          </Link>
        </NavbarBrand>
        <div className="hidden lg:flex gap-4 justify-start ml-2">
          {siteConfig.navItems.map((item) => {
            // Special handling for POS Dashboard link
            if (
              item.href === "/pos-dashboard" &&
              isAuthenticated
            ) {
              return (
                <NavbarItem key={item.href}>
                  <Link
                    className={clsx(
                      linkStyles({ color: "foreground" }),
                      "data-[active=true]:text-primary data-[active=true]:font-medium"
                    )}
                    color="foreground"
                    href={POS_DASHBOARD_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.label}
                  </Link>
                </NavbarItem>
              );
            }
            return (
              <NavbarItem key={item.href}>
                <Link
                  className={clsx(
                    linkStyles({ color: "foreground" }),
                    "data-[active=true]:text-primary data-[active=true]:font-medium"
                  )}
                  color="foreground"
                  href={item.href}
                >
                  {item.label}
                </Link>
              </NavbarItem>
            );
          })}
        </div>
      </NavbarContent>
      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-2">
          <ThemeSwitch />
        </NavbarItem>
        <NavbarItem className="hidden lg:flex">{searchInput}</NavbarItem>
        {isAuthenticated && userInfo && (
          <NavbarItem className="hidden md:flex">
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <div className="flex items-center gap-2 cursor-pointer">
                  <Avatar
                    isBordered
                    radius="sm"
                    src={
                      profile?.avatarUrl || ""
                    }
                    name={
                      name || (userInfo?.displayName || userInfo?.firstName || "User")
                    }
                    showFallback
                    classNames={{
                      name: "font-semibold text-base",
                    }}
                  />
                </div>
              </DropdownTrigger>
              <DropdownMenu aria-label="User Actions" variant="flat">
                <DropdownItem
                  key="profile"
                  className="h-15 gap-2"
                  href="/profile"
                  onPress={() => (window.location.href = "/profile")}
                >
                  <p className="font-bold">{name || (userInfo?.displayName || userInfo?.firstName || "User")}</p>
                  <p className="text-small text-default-500">
                    {email || userInfo?.email || "No email available"}
                  </p>
                  {shopName && (
                    <p className="text-small text-default-600">
                      <span className="font-medium">Store:</span> {shopName}
                      {shopLocation && ` (${shopLocation})`}
                    </p>
                  )}
                  <p className="font-medium">
                    {/* Show role label from USER_ROLES_LIST based on userInfo.user_type */}
                    {profile?.user_type ? USER_ROLES_LIST[profile.user_type] || "" : ""}
                  </p>
                </DropdownItem>
                <DropdownItem key="dashboard" href="/">
                  Home
                </DropdownItem>
                <DropdownItem
                  key="logout"
                  color="danger"
                  onPress={handleLogout}
                >
                  <div className="flex items-center gap-2">
                    <LogOutIcon size={16} />
                    <span>Log Out</span>
                  </div>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarItem>
        )}
        {!isAuthenticated && (
          <NavbarItem>
            <Button as={Link} color="primary" href="/login" variant="flat">
              Login
            </Button>
          </NavbarItem>
        )}
      </NavbarContent>
      <NavbarMenu>
        {searchInput}
        {isAuthenticated && userInfo && (
          <div className="px-4 py-3 border-b">
            <div className="flex items-center gap-3">
              <Avatar
                isBordered
                radius="sm"
                src={
                  "https://i.pravatar.cc/150?u=zakya"
                } // Updated avatar src
                name={
                  "User"
                }
                showFallback
              />
              <div>
                <p className="font-semibold">
                  Welcome,{" "}
                  {name || (userInfo?.displayName || userInfo?.firstName || "User")}
                </p>
                <p className="text-small text-default-500">{email || userInfo?.email || "No email available"}</p>
                {shopName && (
                  <p className="text-small text-default-600 mt-1">
                    <span className="font-medium">Store:</span> {shopName}
                    {shopLocation && ` (${shopLocation})`}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {siteConfig.navMenuItems.map((item, index) => {
            // Special handling for AI Counselor in mobile menu
            if (
              item.href === "/ai-counselor" &&
              isAuthenticated
            ) {
              return (
                <NavbarMenuItem key={`${item}-${index}`}>
                  <Link
                    color={
                      index === 2
                        ? "primary"
                        : index === siteConfig.navMenuItems.length - 1
                          ? "danger"
                          : "foreground"
                    }
                    href={AI_COUNSELOR_URL}
                    size="lg"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.label}
                  </Link>
                </NavbarMenuItem>
              );
            }
            return (
              <NavbarMenuItem key={`${item}-${index}`}>
                <Link
                  color={
                    index === 2
                      ? "primary"
                      : index === siteConfig.navMenuItems.length - 1
                        ? "danger"
                        : "foreground"
                  }
                  href={item.href || "#"}
                  size="lg"
                >
                  {item.label}
                </Link>
              </NavbarMenuItem>
            );
          })}
          {isAuthenticated && (
            <NavbarMenuItem>
              <Link color="danger" href="#" size="lg" onPress={handleLogout}>
                Log Out
              </Link>
            </NavbarMenuItem>
          )}
          {!isAuthenticated && (
            <NavbarMenuItem>
              <Link color="primary" href="/login" size="lg">
                Login
              </Link>
            </NavbarMenuItem>
          )}
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
