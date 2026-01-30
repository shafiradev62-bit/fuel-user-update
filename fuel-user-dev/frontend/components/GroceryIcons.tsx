import React from 'react';

// Icon components for different grocery items
export const WaterIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C12 2 8 6 8 12C8 15.3142 9.68571 18 12 18C14.3143 18 16 15.3142 16 12C16 6 12 2 12 2Z" fill="#3B82F6" stroke="#1E40AF" strokeWidth="1"/>
    <path d="M10 12C10 13.1046 10.8954 14 12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12Z" fill="#60A5FA"/>
    <rect x="11" y="18" width="2" height="4" fill="#1E40AF"/>
  </svg>
);

export const EnergyDrinkIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="8" width="12" height="10" rx="2" fill="#EF4444" stroke="#DC2626" strokeWidth="1"/>
    <path d="M8 6H16V8C16 8.55228 15.5523 9 15 9H9C8.44772 9 8 8.55228 8 8V6Z" fill="#FCA5A5"/>
    <path d="M10 4H14V6C14 6.55228 13.5523 7 13 7H11C10.4477 7 10 6.55228 10 6V4Z" fill="#FEE2E2"/>
    <path d="M11 11L13 13L11 15" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13 13H9" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const SnackIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="10" width="16" height="8" rx="2" fill="#F59E0B" stroke="#D97706" strokeWidth="1"/>
    <rect x="6" y="8" width="12" height="4" rx="1" fill="#FCD34D"/>
    <circle cx="8" cy="14" r="1" fill="#92400E"/>
    <circle cx="12" cy="14" r="1" fill="#92400E"/>
    <circle cx="16" cy="14" r="1" fill="#92400E"/>
    <circle cx="10" cy="12" r="1" fill="#78350F"/>
    <circle cx="14" cy="12" r="1" fill="#78350F"/>
  </svg>
);

export const CoffeeIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 8H16C16 8 18 8 18 10C18 12 16 12 16 12H6C6 12 4 12 4 10C4 8 6 8 6 8Z" fill="#6B4423" stroke="#4B2C0F" strokeWidth="1"/>
    <path d="M6 12H16V16C16 17.1046 15.1046 18 14 18H8C6.89543 18 6 17.1046 6 16V12Z" fill="#8B5A3C"/>
    <path d="M18 10C18 10 20 10 20 12C20 14 18 14 18 14" stroke="#6B4423" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M8 14H14" stroke="#4B2C0F" strokeWidth="1"/>
    <path d="M10 2V6" stroke="#4B2C0F" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M14 2V6" stroke="#4B2C0F" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const SandwichIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 18H20V20C20 20.5523 19.5523 21 19 21H5C4.44772 21 4 20.5523 4 20V18Z" fill="#D2691E" stroke="#A0522D" strokeWidth="1"/>
    <rect x="4" y="14" width="16" height="4" fill="#90EE90" stroke="#228B22" strokeWidth="1"/>
    <rect x="4" y="11" width="16" height="3" fill="#FF6347" stroke="#DC143C" strokeWidth="1"/>
    <rect x="4" y="8" width="16" height="3" fill="#FFA500" stroke="#FF8C00" strokeWidth="1"/>
    <path d="M4 4H20V8C20 8.55228 19.5523 9 19 9H5C4.44772 9 4 8.55228 4 8V4Z" fill="#F4A460" stroke="#D2691E" strokeWidth="1"/>
    <circle cx="8" cy="12.5" r="0.5" fill="#8B0000"/>
    <circle cx="12" cy="12.5" r="0.5" fill="#8B0000"/>
    <circle cx="16" cy="12.5" r="0.5" fill="#8B0000"/>
  </svg>
);

export const ChocolateIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="6" width="16" height="12" rx="1" fill="#6B4423" stroke="#4B2C0F" strokeWidth="1"/>
    <rect x="4" y="6" width="16" height="2" fill="#8B5A3C"/>
    <path d="M8 8V18M12 8V18M16 8V18" stroke="#4B2C0F" strokeWidth="0.5"/>
    <path d="M4 10H20M4 14H20" stroke="#4B2C0F" strokeWidth="0.5"/>
    <circle cx="6" cy="7" r="0.5" fill="#D2691E"/>
    <circle cx="10" cy="7" r="0.5" fill="#D2691E"/>
    <circle cx="14" cy="7" r="0.5" fill="#D2691E"/>
    <circle cx="18" cy="7" r="0.5" fill="#D2691E"/>
  </svg>
);

export const BreadIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 12C4 12 4 16 12 16C20 16 20 12 20 12C20 12 20 8 12 8C4 8 4 12 4 12Z" fill="#D2B48C" stroke="#8B4513" strokeWidth="1"/>
    <path d="M6 10C6 10 7 9 9 9C11 9 13 9 15 9C17 9 18 10 18 10" stroke="#8B4513" strokeWidth="0.5" strokeLinecap="round"/>
    <path d="M6 12C6 12 7 11 9 11C11 11 13 11 15 11C17 11 18 12 18 12" stroke="#8B4513" strokeWidth="0.5" strokeLinecap="round"/>
    <path d="M6 14C6 14 7 13 9 13C11 13 13 13 15 13C17 13 18 14 18 14" stroke="#8B4513" strokeWidth="0.5" strokeLinecap="round"/>
  </svg>
);

export const MilkIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 6C8 4 10 2 12 2C14 2 16 4 16 6V8C16 10 14 12 12 12C10 12 8 10 8 8V6Z" fill="#F0F8FF" stroke="#ADD8E6" strokeWidth="1"/>
    <path d="M6 8H18V20C18 21.1046 17.1046 22 16 22H8C6.89543 22 6 21.1046 6 20V8Z" fill="#F0F8FF" stroke="#ADD8E6" strokeWidth="1"/>
    <path d="M10 8H14" stroke="#ADD8E6" strokeWidth="1" strokeLinecap="round"/>
    <path d="M10 12H14" stroke="#ADD8E6" strokeWidth="1" strokeLinecap="round"/>
    <path d="M10 16H14" stroke="#ADD8E6" strokeWidth="1" strokeLinecap="round"/>
  </svg>
);

export const EggsIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="12" cy="12" rx="6" ry="8" fill="#FFF8DC" stroke="#D2B48C" strokeWidth="1"/>
    <ellipse cx="10" cy="10" rx="1.5" ry="2" fill="#F5DEB3" stroke="#CD853F" strokeWidth="0.5"/>
    <ellipse cx="14" cy="14" rx="1.5" ry="2" fill="#F5DEB3" stroke="#CD853F" strokeWidth="0.5"/>
  </svg>
);

export const FruitIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 4C8 4 5 7 5 11C5 15 8 18 12 20C16 18 19 15 19 11C19 7 16 4 12 4Z" fill="#FF6347" stroke="#DC143C" strokeWidth="1"/>
    <path d="M12 4L12 2" stroke="#228B22" strokeWidth="1" strokeLinecap="round"/>
    <path d="M10 3C10 3 11 5 12 5C13 5 14 3 14 3" stroke="#228B22" strokeWidth="0.5" strokeLinecap="round"/>
    <circle cx="9" cy="8" r="1" fill="#FFD700"/>
    <circle cx="14" cy="11" r="1" fill="#FFD700"/>
  </svg>
);

export const VegetableIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 15L8 20H16L12 15Z" fill="#228B22" stroke="#006400" strokeWidth="1"/>
    <path d="M12 3L15 8L12 15L9 8L12 3Z" fill="#32CD32" stroke="#228B22" strokeWidth="1"/>
    <path d="M10 7L8 9" stroke="#228B22" strokeWidth="1" strokeLinecap="round"/>
    <path d="M14 7L16 9" stroke="#228B22" strokeWidth="1" strokeLinecap="round"/>
    <path d="M12 10L12 12" stroke="#228B22" strokeWidth="1" strokeLinecap="round"/>
  </svg>
);

export const CerealIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="5" y="8" width="14" height="12" rx="2" fill="#D2B48C" stroke="#8B4513" strokeWidth="1"/>
    <rect x="6" y="9" width="12" height="2" fill="#F5DEB3"/>
    <path d="M8 12L10 14L8 16" stroke="#8B4513" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 12L14 14L16 16" stroke="#8B4513" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="7" y="17" width="10" height="2" fill="#8B4513" rx="1"/>
  </svg>
);

export const SodaIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="4" width="8" height="16" rx="4" fill="#FF6347" stroke="#DC143C" strokeWidth="1"/>
    <rect x="9" y="5" width="6" height="4" fill="#FFA07A"/>
    <circle cx="12" cy="7" r="1" fill="#FFE4B5"/>
    <path d="M10 20L10 22" stroke="#DC143C" strokeWidth="1" strokeLinecap="round"/>
    <path d="M14 20L14 22" stroke="#DC143C" strokeWidth="1" strokeLinecap="round"/>
  </svg>
);

export const BeerIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="9" y="3" width="6" height="18" rx="1" fill="#FFD700" stroke="#DAA520" strokeWidth="1"/>
    <path d="M9 6H15" stroke="#DAA520" strokeWidth="1" strokeLinecap="round"/>
    <path d="M9 10H15" stroke="#DAA520" strokeWidth="1" strokeLinecap="round"/>
    <path d="M9 14H15" stroke="#DAA520" strokeWidth="1" strokeLinecap="round"/>
    <path d="M10 3L10 1" stroke="#DAA520" strokeWidth="1" strokeLinecap="round"/>
    <path d="M14 3L14 1" stroke="#DAA520" strokeWidth="1" strokeLinecap="round"/>
  </svg>
);

export const ChipsIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 12C4 12 6 8 12 8C18 8 20 12 20 12C20 12 18 16 12 16C6 16 4 12 4 12Z" fill="#FFD700" stroke="#FFA500" strokeWidth="1"/>
    <path d="M6 11C7 10 9 11 10 12C11 13 13 13 14 12C15 11 17 10 18 11" stroke="#FF8C00" strokeWidth="0.5" strokeLinecap="round"/>
    <path d="M7 13C8 14 10 13 11 12C12 11 14 11 15 12C16 13 17 14 18 13" stroke="#FF8C00" strokeWidth="0.5" strokeLinecap="round"/>
  </svg>
);

export const IceCreamIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 10C8 7 10 5 12 5C14 5 16 7 16 10C16 11 15 13 15 13H9C9 13 8 11 8 10Z" fill="#F5DEB3" stroke="#CD853F" strokeWidth="1"/>
    <path d="M9 13L7 18H17L15 13" fill="#F0E68C" stroke="#DAA520" strokeWidth="1"/>
    <circle cx="10" cy="9" r="1" fill="#FF69B4"/>
    <circle cx="14" cy="8" r="1" fill="#87CEEB"/>
  </svg>
);

export const YogurtIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 12C7 12 7 18 12 18C17 18 17 12 17 12C17 12 17 8 12 8C7 8 7 12 7 12Z" fill="#FFF8DC" stroke="#D2B48C" strokeWidth="1"/>
    <path d="M9 10H15" stroke="#D2B48C" strokeWidth="1" strokeLinecap="round"/>
    <path d="M9 14H15" stroke="#D2B48C" strokeWidth="1" strokeLinecap="round"/>
    <path d="M12 18V20" stroke="#D2B48C" strokeWidth="1" strokeLinecap="round"/>
  </svg>
);

export const CookieIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="8" fill="#8B4513" stroke="#654321" strokeWidth="1"/>
    <circle cx="9" cy="9" r="1" fill="#D2B48C"/>
    <circle cx="14" cy="8" r="1" fill="#D2B48C"/>
    <circle cx="11" cy="13" r="1" fill="#D2B48C"/>
    <circle cx="15" cy="14" r="1" fill="#D2B48C"/>
    <circle cx="8" cy="14" r="1" fill="#D2B48C"/>
  </svg>
);

export const PizzaIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 4C7 4 3 8 3 12C3 16 7 20 12 20C17 20 21 16 21 12C21 8 17 4 12 4Z" fill="#FFA500" stroke="#FF8C00" strokeWidth="1"/>
    <circle cx="9" cy="9" r="1" fill="#FF6347"/>
    <circle cx="14" cy="8" r="1" fill="#FF6347"/>
    <circle cx="11" cy="13" r="1" fill="#FF6347"/>
    <circle cx="15" cy="14" r="1" fill="#FF6347"/>
    <circle cx="8" cy="14" r="1" fill="#FF6347"/>
    <path d="M12 4V2" stroke="#FF8C00" strokeWidth="1" strokeLinecap="round"/>
  </svg>
);

// Function to get the appropriate icon based on grocery name
export const getGroceryIcon = (groceryName: string, className = "w-6 h-6") => {
  const name = groceryName.toLowerCase();
  
  if (name.includes('water') || name.includes('mineral')) {
    return <WaterIcon className={className} />;
  }
  if (name.includes('energy') || name.includes('drink') || name.includes('red bull') || name.includes('monster')) {
    return <EnergyDrinkIcon className={className} />;
  }
  if (name.includes('snack') || name.includes('chips') || name.includes('crisps')) {
    return <ChipsIcon className={className} />;
  }
  if (name.includes('coffee') || name.includes('caffeine')) {
    return <CoffeeIcon className={className} />;
  }
  if (name.includes('sandwich') || name.includes('burger')) {
    return <SandwichIcon className={className} />;
  }
  if (name.includes('bread') || name.includes('roll') || name.includes('bagel') || name.includes('croissant')) {
    return <BreadIcon className={className} />;
  }
  if (name.includes('milk') || name.includes('dairy')) {
    return <MilkIcon className={className} />;
  }
  if (name.includes('egg') || name.includes('eggs')) {
    return <EggsIcon className={className} />;
  }
  if (name.includes('fruit') || name.includes('apple') || name.includes('banana') || name.includes('orange') || name.includes('berries')) {
    return <FruitIcon className={className} />;
  }
  if (name.includes('vegetable') || name.includes('veggie') || name.includes('lettuce') || name.includes('tomato') || name.includes('carrot') || name.includes('onion') || name.includes('potato')) {
    return <VegetableIcon className={className} />;
  }
  if (name.includes('cereal') || name.includes('oats') || name.includes('granola')) {
    return <CerealIcon className={className} />;
  }
  if (name.includes('soda') || name.includes('coke') || name.includes('pepsi') || name.includes('sprite')) {
    return <SodaIcon className={className} />;
  }
  if (name.includes('beer') || name.includes('lager') || name.includes('ale') || name.includes('cider')) {
    return <BeerIcon className={className} />;
  }
  if (name.includes('chocolate') || name.includes('candy') || name.includes('sweet')) {
    return <ChocolateIcon className={className} />;
  }
  if (name.includes('ice cream') || name.includes('ice-cream') || name.includes('gelato')) {
    return <IceCreamIcon className={className} />;
  }
  if (name.includes('yogurt') || name.includes('yoghurt')) {
    return <YogurtIcon className={className} />;
  }
  if (name.includes('cookie') || name.includes('biscuit') || name.includes('cracker')) {
    return <CookieIcon className={className} />;
  }
  if (name.includes('pizza') || name.includes('pie')) {
    return <PizzaIcon className={className} />;
  }
  if (name.includes('tea')) {
    return <CoffeeIcon className={className} />;
  }
  if (name.includes('donut') || name.includes('doughnut')) {
    return <CookieIcon className={className} />;
  }
  if (name.includes('protein') || name.includes('bar')) {
    return <SnackIcon className={className} />;
  }
  if (name.includes('juice')) {
    return <WaterIcon className={className} />;
  }
  if (name.includes('mints') || name.includes('mint')) {
    return <WaterIcon className={className} />;
  }
  
  // Default icon
  return <SnackIcon className={className} />;
};
