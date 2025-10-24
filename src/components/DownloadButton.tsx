"use client";

import React, { useState } from "react";
import { Download, Calendar, FileText, Clock, X } from "lucide-react";

interface DownloadButtonProps {
  className?: string;
}

type TimeSpan = "1h" | "2h" | "6h" | "12h" | "1d" | "1w" | "custom";
type DataType = "temperature" | "humidity" | "pressure" | "location" | "all";

const timeSpanOptions: { value: TimeSpan; label: string }[] = [
  { value: "1h", label: "Letzte Stunde" },
  { value: "2h", label: "Letzte 2 Stunden" },
  { value: "6h", label: "Letzte 6 Stunden" },
  { value: "12h", label: "Letzte 12 Stunden" },
  { value: "1d", label: "Letzter Tag" },
  { value: "1w", label: "Letzte Woche" },
  { value: "custom", label: "Benutzerdefiniert" },
];

const dataTypeOptions: {
  value: DataType;
  label: string;
  description: string;
}[] = [
  {
    value: "temperature",
    label: "Temperatur",
    description: "Temperaturdaten in °C",
  },
  {
    value: "humidity",
    label: "Luftfeuchtigkeit",
    description: "Feuchtigkeitsdaten in %",
  },
  { value: "pressure", label: "Luftdruck", description: "Druckdaten in hPa" },
  {
    value: "location",
    label: "Standort",
    description: "GPS-Koordinaten und Adresse",
  },
  {
    value: "all",
    label: "Alle Daten",
    description: "Alle verfügbaren Messwerte",
  },
];

export default function DownloadButton({
  className = "",
}: DownloadButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDataTypes, setSelectedDataTypes] = useState<DataType[]>([
    "all",
  ]);
  const [selectedTimeSpan, setSelectedTimeSpan] = useState<TimeSpan>("1h");
  const [customDateRange, setCustomDateRange] = useState({
    start: "",
    end: "",
  });

  const handleDataTypeToggle = (dataType: DataType) => {
    if (dataType === "all") {
      setSelectedDataTypes(["all"]);
    } else {
      setSelectedDataTypes((prev) => {
        const filtered = prev.filter((type) => type !== "all");
        if (filtered.includes(dataType)) {
          const newSelection = filtered.filter((type) => type !== dataType);
          return newSelection.length === 0 ? ["all"] : newSelection;
        } else {
          return [...filtered, dataType];
        }
      });
    }
  };

  const handleDownload = () => {
    // TODO: Implement actual download logic
    console.log("Downloading CSV with:", {
      dataTypes: selectedDataTypes,
      timeSpan: selectedTimeSpan,
      customRange: customDateRange,
    });

    // For now, just show an alert
    alert(
      `Download wird vorbereitet...\nDaten: ${selectedDataTypes.join(
        ", "
      )}\nZeitraum: ${
        timeSpanOptions.find((opt) => opt.value === selectedTimeSpan)?.label
      }`
    );
    setIsOpen(false);
  };

  const getSelectedDataTypesLabel = () => {
    if (selectedDataTypes.includes("all")) return "Alle Daten";
    if (selectedDataTypes.length === 0) return "Keine Auswahl";
    if (selectedDataTypes.length === 1) {
      return dataTypeOptions.find((opt) => opt.value === selectedDataTypes[0])
        ?.label;
    }
    return `${selectedDataTypes.length} Datentypen`;
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 sm:gap-3 px-4 sm:px-8 py-3 sm:py-4 font-semibold text-white transition-transform transform shadow-lg bg-gradient-to-r from-primary-400 to-accent-medium rounded-xl sm:rounded-2xl hover:scale-105 hover:shadow-xl hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-primary-400/50 text-sm sm:text-base"
      >
        <Download className="w-4 h-4 sm:w-5 sm:h-5" />
        <span className="hidden sm:inline">CSV Export</span>
        <span className="sm:hidden">Export</span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[9998]"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4">
            <div className="bg-background-light/95 dark:bg-primary-600/95 backdrop-blur-lg border border-primary-50/30 dark:border-primary-200/50 rounded-2xl sm:rounded-3xl p-4 sm:p-8 max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-primary-400 to-accent-medium flex items-center justify-center">
                    <Download className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-2xl font-bold text-text-primary dark:text-text-light">
                      CSV Export
                    </h2>
                    <p className="text-xs sm:text-sm text-primary-600 dark:text-primary-300">
                      Wähle Daten und Zeitraum für den Export
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 sm:p-2 rounded-full hover:bg-primary-50/50 dark:hover:bg-primary-500/50 transition-colors"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600 dark:text-primary-300" />
                </button>
              </div>

              {/* Data Type Selection */}
              <div className="mb-6 sm:mb-8">
                <h3 className="text-base sm:text-lg font-semibold text-text-primary dark:text-text-light mb-3 sm:mb-4 flex items-center gap-2">
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                  Datentypen auswählen
                </h3>
                <div className="grid grid-cols-1 gap-2 sm:gap-3">
                  {dataTypeOptions.map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-start gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 cursor-pointer transition-all ${
                        selectedDataTypes.includes(option.value)
                          ? "border-primary-400 bg-primary-400/10 dark:bg-primary-400/20"
                          : "border-primary-50/30 dark:border-primary-200/30 hover:border-primary-200/50 dark:hover:border-primary-300/50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedDataTypes.includes(option.value)}
                        onChange={() => handleDataTypeToggle(option.value)}
                        className="mt-1 w-4 h-4 text-primary-400 bg-background-light border-primary-300 rounded focus:ring-primary-400 focus:ring-2"
                      />
                      <div className="flex-1">
                        <div className="text-sm sm:text-base font-medium text-text-primary dark:text-text-light">
                          {option.label}
                        </div>
                        <div className="text-xs sm:text-sm text-primary-600 dark:text-primary-300">
                          {option.description}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Time Span Selection */}
              <div className="mb-6 sm:mb-8">
                <h3 className="text-base sm:text-lg font-semibold text-text-primary dark:text-text-light mb-3 sm:mb-4 flex items-center gap-2">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                  Zeitraum auswählen
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 mb-3 sm:mb-4">
                  {timeSpanOptions.slice(0, -1).map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSelectedTimeSpan(option.value)}
                      className={`px-2 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium border transition-colors ${
                        selectedTimeSpan === option.value
                          ? "bg-primary-400 text-white border-primary-400"
                          : "bg-background-light/70 dark:bg-primary-600/60 text-text-primary dark:text-text-light border-primary-50/30 dark:border-primary-200/50 hover:bg-background-light/90 dark:hover:bg-primary-500/70"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>

                {/* Custom Date Range */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <button
                    onClick={() => setSelectedTimeSpan("custom")}
                    className={`px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium border transition-colors ${
                      selectedTimeSpan === "custom"
                        ? "bg-primary-400 text-white border-primary-400"
                        : "bg-background-light/70 dark:bg-primary-600/60 text-text-primary dark:text-text-light border-primary-50/30 dark:border-primary-200/50 hover:bg-background-light/90 dark:hover:bg-primary-500/70"
                    }`}
                  >
                    Benutzerdefiniert
                  </button>
                  {selectedTimeSpan === "custom" && (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-xs sm:text-sm text-primary-600 dark:text-primary-300 w-full">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>Von:</span>
                      </div>
                      <input
                        type="datetime-local"
                        value={customDateRange.start}
                        onChange={(e) =>
                          setCustomDateRange((prev) => ({
                            ...prev,
                            start: e.target.value,
                          }))
                        }
                        className="px-2 sm:px-3 py-1 sm:py-2 rounded-lg border border-primary-50/30 dark:border-primary-200/50 bg-background-light/70 dark:bg-primary-600/60 text-text-primary dark:text-text-light text-xs sm:text-sm"
                      />
                      <span>bis</span>
                      <input
                        type="datetime-local"
                        value={customDateRange.end}
                        onChange={(e) =>
                          setCustomDateRange((prev) => ({
                            ...prev,
                            end: e.target.value,
                          }))
                        }
                        className="px-2 sm:px-3 py-1 sm:py-2 rounded-lg border border-primary-50/30 dark:border-primary-200/50 bg-background-light/70 dark:bg-primary-600/60 text-text-primary dark:text-text-light text-xs sm:text-sm"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Summary */}
              <div className="bg-primary-50/50 dark:bg-primary-500/20 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
                <h4 className="text-sm sm:text-base font-semibold text-text-primary dark:text-text-light mb-2">
                  Export-Zusammenfassung
                </h4>
                <div className="text-xs sm:text-sm text-primary-600 dark:text-primary-300 space-y-1">
                  <div>
                    <strong>Daten:</strong> {getSelectedDataTypesLabel()}
                  </div>
                  <div>
                    <strong>Zeitraum:</strong>{" "}
                    {
                      timeSpanOptions.find(
                        (opt) => opt.value === selectedTimeSpan
                      )?.label
                    }
                  </div>
                  {selectedTimeSpan === "custom" &&
                    customDateRange.start &&
                    customDateRange.end && (
                      <div>
                        <strong>Benutzerdefiniert:</strong>{" "}
                        {customDateRange.start} bis {customDateRange.end}
                      </div>
                    )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-4 sm:px-6 py-2 sm:py-3 font-medium text-primary-600 dark:text-primary-300 border border-primary-200/50 dark:border-primary-300/50 rounded-lg sm:rounded-xl hover:bg-primary-50/50 dark:hover:bg-primary-500/20 transition-colors text-sm sm:text-base"
                >
                  Abbrechen
                </button>
                <button
                  onClick={handleDownload}
                  disabled={
                    selectedDataTypes.length === 0 ||
                    (selectedTimeSpan === "custom" &&
                      (!customDateRange.start || !customDateRange.end))
                  }
                  className="flex-1 px-4 sm:px-6 py-2 sm:py-3 font-semibold text-white bg-gradient-to-r from-primary-400 to-accent-medium rounded-lg sm:rounded-xl hover:from-primary-500 hover:to-accent-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm sm:text-base"
                >
                  Download starten
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
