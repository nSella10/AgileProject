// Route mapping for different languages
export const routes = {
  en: {
    home: '/',
    about: '/about',
    pricing: '/pricing',
    contact: '/contact',
    blog: '/blog',
    help: '/help',
    careers: '/careers',
    community: '/community',
    school: '/school',
    work: '/work',
    solutions: '/solutions',
    terms: '/terms',
    privacy: '/privacy'
  },
  he: {
    home: '/',
    about: '/אודות',
    pricing: '/מחירים',
    contact: '/צור-קשר',
    blog: '/בלוג',
    help: '/עזרה',
    careers: '/קריירה',
    community: '/קהילה',
    school: '/בית-ספר',
    work: '/עבודה',
    solutions: '/פתרונות',
    terms: '/תנאים',
    privacy: '/פרטיות'
  }
};

// Get route for current language
export const getRoute = (routeKey, language = 'en') => {
  return routes[language]?.[routeKey] || routes.en[routeKey];
};

// Get route key from path
export const getRouteKey = (path, language = 'en') => {
  const routeEntries = Object.entries(routes[language] || routes.en);
  const found = routeEntries.find(([key, route]) => route === path);
  return found ? found[0] : 'home';
};

// Navigation helper
export const navigateToRoute = (navigate, routeKey, language = 'en') => {
  const route = getRoute(routeKey, language);
  navigate(route);
};
