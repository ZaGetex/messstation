/**
 * Translation configuration file
 * Contains all user-facing text in German and English
 */

import { sensorConfig } from "./sensors";

export type Language = "de" | "en";

export interface Translations {
  // Metadata
  metadata: {
    title: string;
    description: string;
  };

  // Home page
  home: {
    title: string;
    subtitle: string;
    viewHistory: string;
    projectText: string;
    projectLink: string;
    mapTitle: string;
  };

  // History page
  history: {
    title: string;
    back: string;
    loading: string;
    trend: string;
    ranges: {
      "1h": string;
      "5h": string;
      "1d": string;
      "1w": string;
    };
  };

  // Download button
  download: {
    button: {
      full: string;
      short: string;
    };
    modal: {
      title: string;
      subtitle: string;
      dataTypes: string;
      timeSpan: string;
      exportSummary: string;
      data: string;
      timeRange: string;
      custom: string;
      from: string;
      to: string;
      cancel: string;
      startDownload: string;
      preparing: string;
    };
    timeSpans: {
      "1h": string;
      "2h": string;
      "6h": string;
      "12h": string;
      "1d": string;
      "1w": string;
      custom: string;
    };
    dataTypes: {
      all: string;
      allDescription: string;
      noSelection: string;
      multipleTypes: string;
    };
  };

  // Time status
  timeStatus: {
    now: string;
    minutesAgo: string;
    hoursAgo: string;
  };

  // Sensor descriptions (these will be dynamically generated from sensorConfig)
  sensors: {
    [key: string]: {
      title: string;
      description: string;
    };
  };
}

const translations: Record<Language, Translations> = {
  de: {
    metadata: {
      title: "Barkasse Messstation Dashboard",
      description: "Live-Messwerte deiner Station auf einen Blick",
    },
    home: {
      title: "Barkasse Messstation Dashboard",
      subtitle: "Live-Messwerte der Station auf einen Blick",
      viewHistory: "Verlauf ansehen",
      projectText: "Ein Projekt des",
      projectLink: "Libertalia Kollektivs",
      mapTitle: "Karte |",
    },
    history: {
      title: "Verlauf",
      back: "Zurück",
      loading: "Lade Verlaufsdaten...",
      trend: "Trend",
      ranges: {
        "1h": "Letzte Stunde",
        "5h": "Letzte 5h",
        "1d": "Letzter Tag",
        "1w": "Letzte Woche",
      },
    },
    download: {
      button: {
        full: "CSV Export",
        short: "Export",
      },
      modal: {
        title: "CSV Export",
        subtitle: "Wähle Daten und Zeitraum für den Export",
        dataTypes: "Datentypen auswählen",
        timeSpan: "Zeitraum auswählen",
        exportSummary: "Export-Zusammenfassung",
        data: "Daten",
        timeRange: "Zeitraum",
        custom: "Benutzerdefiniert",
        from: "Von:",
        to: "bis",
        cancel: "Abbrechen",
        startDownload: "Download starten",
        preparing: "Wird vorbereitet...",
      },
      timeSpans: {
        "1h": "Letzte Stunde",
        "2h": "Letzte 2 Stunden",
        "6h": "Letzte 6 Stunden",
        "12h": "Letzte 12 Stunden",
        "1d": "Letzter Tag",
        "1w": "Letzte Woche",
        custom: "Benutzerdefiniert",
      },
      dataTypes: {
        all: "Alle Daten",
        allDescription: "Alle verfügbaren Messwerte",
        noSelection: "Keine Auswahl",
        multipleTypes: "Datentypen",
      },
    },
    timeStatus: {
      now: "Jetzt",
      minutesAgo: "Min.",
      hoursAgo: "Std.",
    },
    sensors: (() => {
      const sensors: {
        [key: string]: { title: string; description: string };
      } = {};
      sensorConfig.forEach((sensor) => {
        sensors[sensor.sensorId] = {
          title: sensor.title,
          description: sensor.description,
        };
      });
      return sensors;
    })(),
  },
  en: {
    metadata: {
      title: "Barkasse Monitoring Dashboard",
      description: "Live sensor data from your station at a glance",
    },
    home: {
      title: "Barkasse Monitoring Dashboard",
      subtitle: "Live sensor data from the station at a glance",
      viewHistory: "View History",
      projectText: "A project by the",
      projectLink: "Libertalia Collective",
      mapTitle: "Map |",
    },
    history: {
      title: "History",
      back: "Back",
      loading: "Loading history data...",
      trend: "Trend",
      ranges: {
        "1h": "Last Hour",
        "5h": "Last 5h",
        "1d": "Last Day",
        "1w": "Last Week",
      },
    },
    download: {
      button: {
        full: "CSV Export",
        short: "Export",
      },
      modal: {
        title: "CSV Export",
        subtitle: "Select data and time range for export",
        dataTypes: "Select Data Types",
        timeSpan: "Select Time Range",
        exportSummary: "Export Summary",
        data: "Data",
        timeRange: "Time Range",
        custom: "Custom",
        from: "From:",
        to: "to",
        cancel: "Cancel",
        startDownload: "Start Download",
        preparing: "Preparing...",
      },
      timeSpans: {
        "1h": "Last Hour",
        "2h": "Last 2 Hours",
        "6h": "Last 6 Hours",
        "12h": "Last 12 Hours",
        "1d": "Last Day",
        "1w": "Last Week",
        custom: "Custom",
      },
      dataTypes: {
        all: "All Data",
        allDescription: "All available measurements",
        noSelection: "No Selection",
        multipleTypes: "data types",
      },
    },
    timeStatus: {
      now: "Now",
      minutesAgo: "Min. ago",
      hoursAgo: "h ago",
    },
    sensors: (() => {
      const sensors: {
        [key: string]: { title: string; description: string };
      } = {};
      sensorConfig.forEach((sensor) => {
        sensors[sensor.sensorId] = {
          title: sensor.titleEn,
          description: sensor.descriptionEn,
        };
      });
      return sensors;
    })(),
  },
};

/**
 * Gets translations for a specific language
 * 
 * @param language - The language code ("de" or "en")
 * @returns Translations object for the specified language
 */
export function getTranslations(language: Language): Translations {
  return translations[language];
}

/**
 * Hook-like function to get translations (for use in components)
 * 
 * @param language - The language code ("de" or "en")
 * @returns Translations object for the specified language
 */
export function useTranslations(language: Language) {
  return getTranslations(language);
}

