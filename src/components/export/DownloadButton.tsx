/**
 * Download button component with modal for CSV export
 * Allows users to select data types and time ranges for export
 */

"use client";

import React, { useState, useEffect } from "react";
import { Download, Calendar, FileText, Clock, X, Loader2 } from "lucide-react";
import { sensorConfig } from "@/lib/config/sensors";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslations } from "@/lib/config/translations";
import { TimeSpan, DataType } from "@/types/api";

interface DownloadButtonProps {
  className?: string;
}

export default function DownloadButton({
  className = "",
}: DownloadButtonProps) {
  const { language } = useLanguage();
  const t = useTranslations(language);

  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDataTypes, setSelectedDataTypes] = useState<DataType[]>([
    "all",
  ]);
  const [selectedTimeSpan, setSelectedTimeSpan] = useState<TimeSpan>("1h");
  const [customDateRange, setCustomDateRange] = useState({
    start: "",
    end: "",
  });

  const timeSpanOptions: { value: TimeSpan; label: string }[] = [
    { value: "1h", label: t.download.timeSpans["1h"] },
    { value: "2h", label: t.download.timeSpans["2h"] },
    { value: "6h", label: t.download.timeSpans["6h"] },
    { value: "12h", label: t.download.timeSpans["12h"] },
    { value: "1d", label: t.download.timeSpans["1d"] },
    { value: "1w", label: t.download.timeSpans["1w"] },
    { value: "custom", label: t.download.timeSpans.custom },
  ];

  // Build data type options dynamically from sensor config
  const dataTypeOptions: {
    value: DataType;
    label: string;
    description: string;
  }[] = [
    // Filter config for sensors with showInDownload === true
    ...sensorConfig
      .filter((sensor) => sensor.showInDownload)
      .map((sensor) => ({
        value: sensor.sensorId,
        label: t.sensors[sensor.sensorId]?.title || sensor.title,
        description:
          t.sensors[sensor.sensorId]?.description || sensor.description,
      })),
    // Add the "all" option at the end
    {
      value: "all",
      label: t.download.dataTypes.all,
      description: t.download.dataTypes.allDescription,
    },
  ];

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

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

  const handleDownload = async () => {
    setIsSubmitting(true);
    try {
      const params = new URLSearchParams();
      params.set("dataTypes", selectedDataTypes.join(","));
      params.set("timeSpan", selectedTimeSpan);

      if (selectedTimeSpan === "custom") {
        if (customDateRange.start) {
          params.set(
            "startDate",
            new Date(customDateRange.start).toISOString()
          );
        }
        if (customDateRange.end) {
          params.set("endDate", new Date(customDateRange.end).toISOString());
        }
      }

      const url = `/api/sensors/export?${params.toString()}`;
      window.open(url, "_blank");

      setTimeout(() => {
        setIsOpen(false);
      }, 500);
    } catch (error) {
      console.error("Failed to start download:", error);
    } finally {
      setTimeout(() => {
        setIsSubmitting(false);
      }, 1000);
    }
  };

  const getSelectedDataTypesLabel = () => {
    if (selectedDataTypes.includes("all")) return t.download.dataTypes.all;
    if (selectedDataTypes.length === 0)
      return t.download.dataTypes.noSelection;
    if (selectedDataTypes.length === 1) {
      return dataTypeOptions.find((opt) => opt.value === selectedDataTypes[0])
        ?.label;
    }
    return `${selectedDataTypes.length} ${t.download.dataTypes.multipleTypes}`;
  };

  return (
    <div className={`flex justify-center items-center relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-white transition-transform transform shadow-lg sm:gap-3 sm:px-8 sm:py-4 bg-gradient-to-r from-primary-400 to-accent-medium rounded-xl sm:rounded-2xl hover:scale-105 hover:shadow-xl hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-primary-400/50 sm:text-base"
      >
        <Download className="w-4 h-4 sm:w-5 sm:h-5" />
        <span className="hidden sm:inline">{t.download.button.full}</span>
        <span className="sm:hidden">{t.download.button.short}</span>
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
            <div className="bg-background-light/95 dark:bg-primary-600/95 backdrop-blur-lg border border-primary-50/30 dark:border-primary-200/50 rounded-xl sm:rounded-2xl p-3 sm:p-6 max-w-xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex items-center justify-center w-7 h-7 rounded-full sm:w-10 sm:h-10 bg-gradient-to-r from-primary-400 to-accent-medium">
                    <Download className="w-3 h-3 text-white sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold sm:text-xl text-text-primary dark:text-text-light">
                      {t.download.modal.title}
                    </h2>
                    <p className="text-xs text-primary-600 dark:text-primary-300">
                      {t.download.modal.subtitle}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 transition-colors rounded-full sm:p-2 hover:bg-primary-50/50 dark:hover:bg-primary-500/50"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600 dark:text-primary-300" />
                </button>
              </div>

              {/* Data Type Selection */}
              <div className="mb-4 sm:mb-6">
                <h3 className="flex items-center gap-2 mb-2 text-sm font-semibold sm:text-base text-text-primary dark:text-text-light sm:mb-3">
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                  {t.download.modal.dataTypes}
                </h3>
                <div className="grid grid-cols-1 gap-1 sm:gap-2">
                  {dataTypeOptions.map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedDataTypes.includes(option.value)
                          ? "border-primary-400 bg-primary-400/10 dark:bg-primary-400/20"
                          : "border-primary-50/30 dark:border-primary-200/30 hover:border-primary-200/50 dark:hover:border-primary-300/50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedDataTypes.includes(option.value)}
                        onChange={() => handleDataTypeToggle(option.value)}
                        className="w-4 h-4 mt-1 rounded text-primary-400 bg-background-light border-primary-300 focus:ring-primary-400 focus:ring-2"
                      />
                      <div className="flex-1">
                        <div className="text-xs font-medium sm:text-sm text-text-primary dark:text-text-light">
                          {option.label}
                        </div>
                        <div className="text-xs text-primary-600 dark:text-primary-300">
                          {option.description}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Time Span Selection */}
              <div className="mb-4 sm:mb-6">
                <h3 className="flex items-center gap-2 mb-2 text-sm font-semibold sm:text-base text-text-primary dark:text-text-light sm:mb-3">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                  {t.download.modal.timeSpan}
                </h3>
                <div className="grid grid-cols-2 gap-1 mb-2 sm:grid-cols-3 sm:gap-2 sm:mb-3">
                  {timeSpanOptions.slice(0, -1).map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSelectedTimeSpan(option.value)}
                      className={`px-2 sm:px-3 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-medium border transition-colors ${
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
                <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                  <button
                    onClick={() => setSelectedTimeSpan("custom")}
                    className={`px-2 sm:px-3 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-medium border transition-colors ${
                      selectedTimeSpan === "custom"
                        ? "bg-primary-400 text-white border-primary-400"
                        : "bg-background-light/70 dark:bg-primary-600/60 text-text-primary dark:text-text-light border-primary-50/30 dark:border-primary-200/50 hover:bg-background-light/90 dark:hover:bg-primary-500/70"
                    }`}
                  >
                    {t.download.modal.custom}
                  </button>
                  {selectedTimeSpan === "custom" && (
                    <div className="flex flex-col items-start w-full gap-1 text-xs sm:flex-row sm:items-center text-primary-600 dark:text-primary-300">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{t.download.modal.from}</span>
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
                        className="px-2 py-1 text-xs border rounded-lg border-primary-50/30 dark:border-primary-200/50 bg-background-light/70 dark:bg-primary-600/60 text-text-primary dark:text-text-light"
                      />
                      <span>{t.download.modal.to}</span>
                      <input
                        type="datetime-local"
                        value={customDateRange.end}
                        onChange={(e) =>
                          setCustomDateRange((prev) => ({
                            ...prev,
                            end: e.target.value,
                          }))
                        }
                        className="px-2 py-1 text-xs border rounded-lg border-primary-50/30 dark:border-primary-200/50 bg-background-light/70 dark:bg-primary-600/60 text-text-primary dark:text-text-light"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Summary */}
              <div className="p-2 mb-3 rounded-lg bg-primary-50/50 dark:bg-primary-500/20 sm:p-3 sm:mb-4">
                <h4 className="mb-1 text-xs font-semibold sm:text-sm text-text-primary dark:text-text-light">
                  {t.download.modal.exportSummary}
                </h4>
                <div className="space-y-1 text-xs text-primary-600 dark:text-primary-300">
                  <div>
                    <strong>{t.download.modal.data}:</strong>{" "}
                    {getSelectedDataTypesLabel()}
                  </div>
                  <div>
                    <strong>{t.download.modal.timeRange}:</strong>{" "}
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
                        <strong>{t.download.modal.custom}:</strong>{" "}
                        {new Date(customDateRange.start).toLocaleString(
                          language === "de" ? "de-DE" : "en-US"
                        )}{" "}
                        {t.download.modal.to}{" "}
                        {new Date(customDateRange.end).toLocaleString(
                          language === "de" ? "de-DE" : "en-US"
                        )}
                      </div>
                    )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                <button
                  onClick={() => setIsOpen(false)}
                  disabled={isSubmitting}
                  className="flex-1 px-3 py-2 text-xs font-medium transition-colors border rounded-lg sm:px-4 sm:py-2 text-primary-600 dark:text-primary-300 border-primary-200/50 dark:border-primary-300/50 hover:bg-primary-50/50 dark:hover:bg-primary-500/20 sm:text-sm disabled:opacity-50"
                >
                  {t.download.modal.cancel}
                </button>
                <button
                  onClick={handleDownload}
                  disabled={
                    isSubmitting ||
                    selectedDataTypes.length === 0 ||
                    (selectedTimeSpan === "custom" &&
                      (!customDateRange.start || !customDateRange.end))
                  }
                  className="flex-1 px-3 py-2 text-xs font-semibold text-white transition-all rounded-lg sm:px-4 sm:py-2 bg-gradient-to-r from-primary-400 to-accent-medium hover:from-primary-500 hover:to-accent-dark disabled:opacity-50 disabled:cursor-not-allowed sm:text-sm flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {t.download.modal.preparing}
                    </>
                  ) : (
                    t.download.modal.startDownload
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

