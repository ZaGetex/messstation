/**
 * Custom hook for calculating time status indicators
 */

import { useMemo } from "react";
import { TimeStatus } from "@/types/sensor";
import { getTimeStatus } from "@/lib/utils/time";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslations } from "@/lib/config/translations";

/**
 * Hook that calculates time status for a given timestamp
 * 
 * @param timestamp - The timestamp to calculate status for
 * @returns Time status object with color and text
 */
export function useTimeStatus(timestamp: Date): TimeStatus {
  const { language } = useLanguage();
  const translations = useTranslations(language);

  return useMemo(
    () => getTimeStatus(timestamp, translations),
    [timestamp, translations]
  );
}

