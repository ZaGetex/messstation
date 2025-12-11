// src/components/MultiSensorCard.tsx

import { SensorConfig } from "@/lib/sensorConfig";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslations } from "@/lib/translations";

interface MultiSensorCardProps {
  title: string;
  sensors: Array<{
    config: SensorConfig;
    value: string;
    lastUpdated: Date;
    timeStatus: { color: string; text: string };
  }>;
}

export default function MultiSensorCard({
  title,
  sensors,
}: MultiSensorCardProps) {
  const { language } = useLanguage();
  const t = useTranslations(language);

  return (
    <div className="group bg-background-light/40 dark:bg-primary-600/40 backdrop-blur-lg border border-primary-50/20 dark:border-primary-200/30 rounded-2xl sm:rounded-3xl p-6 sm:p-8 transition-all duration-300 shadow-lg hover:shadow-2xl hover:border-primary-100/40 dark:hover:border-primary-200/50 col-span-1 sm:col-span-2 lg:col-span-2">
      <h2 className="text-xl sm:text-2xl font-bold mb-6 text-primary-600 dark:text-primary-50">
        {title}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {sensors.map((sensor) => {
          const Icon = sensor.config.icon;
          return (
            <div
              key={sensor.config.sensorId}
              className="flex flex-col items-center text-center p-4 rounded-xl bg-background-light/50 dark:bg-primary-500/30 backdrop-blur-sm border border-primary-50/10 dark:border-primary-200/20 transition-all duration-300 hover:bg-background-light/70 dark:hover:bg-primary-500/50"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center mb-3 transition-colors duration-300 bg-background-light/70 dark:bg-primary-600/60">
                <Icon
                  className={`${sensor.config.iconColor} dark:text-primary-50 w-6 h-6 sm:w-7 sm:h-7`}
                />
              </div>
              <h3 className="text-sm font-medium sm:text-base text-primary-600 dark:text-primary-50 mb-1">
                {t.sensors[sensor.config.sensorId]?.title ||
                  sensor.config.title}
              </h3>
              <p
                className={`text-2xl sm:text-3xl font-bold text-text-primary dark:text-text-light transition-colors duration-300 ${sensor.config.hoverTextColor}`}
              >
                {sensor.value}
              </p>

              {/* Update indicator */}
              <div className="flex items-center gap-2 mt-2 text-xs text-primary-500 dark:text-primary-50">
                <div
                  className={`w-2 h-2 rounded-full ${sensor.timeStatus.color}`}
                ></div>
                <span>{sensor.timeStatus.text}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
