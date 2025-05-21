import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader, CardFooter } from "@heroui/card";
import { Avatar } from "@heroui/avatar";
import { Progress } from "@heroui/progress";
import { Chip } from "@heroui/chip";
import { User } from "@heroui/user";
import { button as buttonStyles } from "@heroui/theme";
import { Divider } from "@heroui/divider";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/contexts/ProfileContext"; // Added import
import DefaultLayout from "@/layouts/default";
import { Link } from "@heroui/link";
import { Image } from "@heroui/react";
import { 
  FiUsers, 
  FiBriefcase, 
  FiCpu, 
  FiMessageSquare, 
  FiMap, 
  FiBookOpen,
  FiSettings,
  FiShoppingCart,
  FiDatabase,
  FiBarChart2,
  FiCreditCard 
} from "react-icons/fi";
import { POS_DASHBOARD_URL, APP_CARD_AVAILABILITY, USER_ROLES } from "@/constants/app.constant";
import { useNavigate } from "react-router-dom";
import { title } from "@/components/primitives";

export default function IndexPage() {
  const { userInfo } = useAuth();
  const { profile } = useProfile(); // Added profile context
  const [userName, setUserName] = useState("Student");
  const [greeting, setGreeting] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo && (userInfo.firstName || userInfo.name || userInfo.username)) {
      setUserName(userInfo.firstName || userInfo.name || userInfo.username);
    }

    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting("Good Morning");
    } else if (hour < 18) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }
  }, [userInfo]);

  // App card definitions with chip info
  const appCards = [
    {
      key: "POS_DASHBOARD",
      title: "POS Dashboard",
      description: "Process sales and manage transactions",
      icon: <FiShoppingCart size={24} />,
      href: POS_DASHBOARD_URL,
      image: "/images/illustrations/ai.png",
      color: "from-teal-400 to-teal-600",
      bgColor: "bg-gradient-to-br from-teal-400 to-teal-600",
      chip: { label: "Active", color: "success" },
      external: true,
    },{
      key: "INVENTORY",
      title: "Inventory",
      description: "Manage products and stock levels",
      icon: <FiDatabase size={24} />,
      href: "/inventory",
      image: "/images/illustrations/family.png",
      color: "from-purple-400 to-purple-600",
      bgColor: "bg-gradient-to-br from-purple-400 to-purple-600",
      chip: { label: "New", color: "success" }
    },
    {
      key: "REPORTS",
      title: "Reports",
      description: "View sales reports and analytics",
      icon: <FiBarChart2 size={24} />,
      href: "/reports",
      image: "/images/illustrations/interview.png",
      color: "from-amber-400 to-amber-600",
      bgColor: "bg-gradient-to-br from-amber-400 to-amber-600"
    },
    {
      key: "CUSTOMER_CRM",
      title: "Customers",
      description: "Manage customer information and loyalty",
      icon: <FiUsers size={24} />,
      href: "/customers",
      image: "/images/illustrations/internship.png",
      color: "from-pink-400 to-pink-600",
      bgColor: "bg-gradient-to-br from-pink-400 to-pink-600"
    },
    {
      key: "SETTINGS",
      title: "Settings",
      description: "Configure your POS system",
      icon: <FiSettings size={24} />,
      href: "/settings",
      image: "/images/illustrations/resourcehub.png",
      color: "from-blue-400 to-blue-600",
      bgColor: "bg-gradient-to-br from-blue-400 to-blue-600"
    },
    {
      key: "PAYMENTS",
      title: "Payments",
      description: "Manage payment methods and transactions",
      icon: <FiCreditCard size={24} />,
      href: "/payments",
      image: "/images/illustrations/books.png",
      color: "from-green-400 to-green-600",
      bgColor: "bg-gradient-to-br from-green-400 to-green-600",
      chip: { label: "New", color: "success" }
    },
  ].map(card => ({
    ...card,
    available: userInfo?.user_type && APP_CARD_AVAILABILITY[card.key]?.includes(userInfo.user_type)
  }));

  // Only show cards that are available for the user
  const availableCards = appCards.filter(card => card.available);
  // Determine which cards should be disabled
  const isOnboarded = profile?.onboardingComplete === true; // Changed to profile.onboardingComplete

  return (
    <DefaultLayout>
      {/* Onboarding Banner */}
      {profile?.onboardingComplete === false && ( // Changed to profile.onboardingComplete
        <div className="w-full flex justify-center">
          <Card className="mb-6 w-full max-w-4xl border-none bg-gradient-to-br from-violet-500 to-indigo-500 text-white overflow-hidden shadow-lg">
            <CardBody className="py-8 px-6 flex flex-col md:flex-row items-center">
              <div className="flex-1 z-10">
                <h2 className="text-2xl font-bold mb-1">
                  {greeting}, {userName}!
                </h2>
                <p className="text-white/80">
                  Welcome to Zakya POS. Your powerful point of sale solution
                  that simplifies business operations.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link href="/onboarding">
                    <Button
                      color="primary"
                      variant="solid"
                      className="bg-white text-indigo-600 hover:bg-white/90"
                    >
                      Complete Profile
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex-shrink-0 mt-6 md:mt-0 md:absolute md:right-0 md:top-0 md:bottom-0">
                <img
                  src="/images/illustrations/onboard.png"
                  alt="Onboarding illustration"
                  className="h-full w-auto object-cover md:object-contain"
                />
              </div>
            </CardBody>
          </Card>
        </div>
      )}
      {/* App Cards Grid */}
      {availableCards.length > 0 && (
      <div className="w-full max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">Quick Access</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableCards.map((card, index) => {
            return (
              <Card 
                key={index}
                className="flex flex-col relative overflow-hidden h-auto bg-content1 shadow-medium rounded-large transition-transform-background w-full max-w-[420px] opacity-100"
              >
                <div className="relative flex w-full p-3 flex-auto flex-col place-content-inherit h-auto break-words text-left overflow-y-auto px-3 pb-1">
                  <div className="relative shadow-black/5 shadow-none rounded-large">
                    <Image
                      alt={`${card.title} illustration`}
                      className="relative z-10 shadow-none transition-transform-opacity rounded-large aspect-video w-full object-cover"
                      src={card.image}
                      fallbackSrc={`https://via.placeholder.com/420x280/${card.color.split('-')[2]}/${card.color.split('-')[2]}?text=${card.title}`}
                    />
                  </div>
                  <span aria-hidden="true" className="w-px h-px block" style={{ marginLeft: "0.25rem", marginTop: "0.5rem" }}></span>
                  <div className="flex flex-col gap-2 px-2">
                    <div className="flex items-center gap-2">
                      <div className="text-default-500">
                        {card.icon}
                      </div>
                      <p className="text-large font-medium">{card.title}</p>
                      {card.chip && (
                        <Chip color={card.chip.color} variant="flat" className="ml-2" size="sm">
                          {card.chip.label} 
                        </Chip>
                      )}
                    </div>
                    <p className="text-small text-default-400">{card.description}</p>
                  </div>
                </div>
                <div className="p-3 h-auto flex w-full items-center overflow-hidden rounded-b-large justify-end gap-2">
                  {card.available && card.chip?.color === "success" ? (
                    <Button
                      className="bg-primary text-primary-foreground hover:opacity-hover w-full"
                      radius="medium"
                      size="sm"
                      onClick={() => {
                        if (card.external) {
                          if (isOnboarded) {
                            window.open(card.href, "_blank", "noopener,noreferrer");
                          } else {
                            navigate("/onboarding");
                          }
                        } else {
                          if (isOnboarded) {
                            navigate(card.href);
                          } else {
                            navigate("/onboarding");
                          }
                        }
                      }}
                    >
                      {card.key === "POS_DASHBOARD" ? "Launch" : "Open"}
                    </Button>
                  ) : (
                    <span className="w-full text-center text-default-400">Coming Soon</span>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
      )}
    </DefaultLayout>
  );
}
