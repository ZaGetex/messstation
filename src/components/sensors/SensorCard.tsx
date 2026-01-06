/**
 * Individual sensor card component
 * Displays a single sensor's data with icon, value, and update status
 */

import { SensorCardData } from "@/types/sensor";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslations } from "@/lib/config/translations";

interface SensorCardProps {
  card: SensorCardData;
}

export default function SensorCard({ card }: SensorCardProps) {
  const { language } = useLanguage();
  const t = useTranslations(language);

  return (
    <div
      className={`group bg-background-light/40 dark:bg-primary-600/40 backdrop-blur-lg border border-primary-50/20 dark:border-primary-200/30 rounded-2xl sm:rounded-3xl p-4 sm:p-6 flex flex-col items-center text-center transform transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl ${card.shadowColor} ${card.borderColor}`}
    >
      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-3 sm:mb-4 transition-colors duration-300 bg-background-light/70 dark:bg-primary-600/60">
        <card.Icon
          className={`${card.iconColor} dark:text-primary-50 w-6 h-6 sm:w-8 sm:h-8`}
        />
      </div>
      <h2 className="text-sm font-medium sm:text-base text-primary-600 dark:text-primary-50">
        {t.sensors[card.sensorId]?.title || card.title}
      </h2>
      <p
        className={`text-2xl sm:text-4xl font-bold text-text-primary dark:text-text-light mt-2 transition-colors duration-300 ${card.hoverTextColor}`}
      >
        {card.value}
      </p>

      {/* Update indicator */}
      <div className="flex items-center gap-2 mt-2 text-xs sm:mt-3 text-primary-500 dark:text-primary-50">
        <div className={`w-2 h-2 rounded-full ${card.timeStatus.color}`}></div>
        <span>{card.timeStatus.text}</span>
      </div>
    </div>
  );
}

