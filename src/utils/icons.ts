import * as PhosphorIcons from '@phosphor-icons/react';

export const categoryIcons: Record<string, string> = {
  'Food': 'Hamburger',
  'Transport': 'Car',
  'Shopping': 'ShoppingCart',
  'Entertainment': 'GameController',
  'Bills': 'Receipt',
  'Healthcare': 'FirstAid',
  'Education': 'GraduationCap',
  'Travel': 'AirplaneTilt',
  'Salary': 'Money',
  'Business': 'Briefcase',
  'Investment': 'TrendUp',
  'Gift': 'Gift',
  'Transfer': 'ArrowsLeftRight',
  'Adjustment': 'Wrench',
  'Other': 'Placeholder',
};

export function getCategoryIcon(category: string): string {
  return categoryIcons[category] || 'Circle';
}

export function getIconComponent(iconName: string): React.ComponentType<any> {
  return (PhosphorIcons as any)[iconName] || PhosphorIcons.Circle;
}
