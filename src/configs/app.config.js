// Application configuration
const appConfig = {
  appName: 'Zakya POS',
  
  // Authentication related paths
  authenticatedEntryPath: '/',
  unAuthenticatedEntryPath: '/login',
  zohoOAuthRedirectPath: '/collectToken', // Add Zoho OAuth redirect path
  
  // API configuration
  apiPrefix: '/api',
  
  // Layout settings
  layout: {
    sideNavWidth: '18rem',
    sideNavCollapsedWidth: '5rem',
    topNavHeight: '64px'
  }
};

export const siteConfig = {
  name: "Zakya POS",
  description: "Powerful Point of Sales System for modern businesses.",
  navItems: [

  ],
  navMenuItems: [
  ],
  links: {
    github: "https://github.com/frontio-ai/heroui",
    twitter: "https://twitter.com/hero_ui",
    docs: "https://heroui.com",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
};

export default appConfig;
