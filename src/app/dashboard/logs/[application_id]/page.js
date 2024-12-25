"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/shared/Button";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";

export default function ApplicationLogsPage() {
  const { application_id } = useParams();
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isGeneratingDummy, setIsGeneratingDummy] = useState(false);
  const [pageSize] = useState(20); // Default page size
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [logLevel, setLogLevel] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [applicationName, setApplicationName] = useState("");

  useEffect(() => {
    fetchLogs();
  }, [application_id, logLevel, startTime, endTime]);

  async function fetchLogs(nextCursor = null) {
    if (!application_id) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://argus-core.brijesh.dev/twirp/logs.LogsService/GetLogs`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token: localStorage.getItem("token"),
            application_id: application_id,
            page_size: pageSize,
            cursor: nextCursor,
            log_level: logLevel === "ALL" ? "" : logLevel,
            start_time: startTime,
            end_time: endTime,
          }),
        },
      );

      const data = await response.json();
      if (data.logs) {
        if (nextCursor) {
          setLogs((prev) => [...prev, ...data.logs]);
        } else {
          setLogs(data.logs);
        }
        setHasMore(data.has_more);
        setCursor(data.next_cursor);
        setApplicationName(data.application_name);
      }
    } catch (error) {
      console.error("Error fetching logs:", error);
      setError("Failed to load logs");
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }

  async function generateDummyLogs() {
    if (!application_id) return;

    setIsGeneratingDummy(true);
    try {
      const response = await fetch(
        `https://argus-core.brijesh.dev/twirp/logs.LogsService/GenerateDummyLogs`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token: localStorage.getItem("token"),
            application_id: application_id,
          }),
        },
      );

      if (response.ok) {
        await fetchLogs(); // Refresh logs after generating
      }
    } catch (error) {
      console.error("Error generating dummy logs:", error);
      setError("Failed to generate dummy logs");
    } finally {
      setIsGeneratingDummy(false);
    }
  }

  async function loadMore() {
    if (!hasMore || isLoadingMore) return;
    setIsLoadingMore(true);
    await fetchLogs(cursor);
  }

  const logLevelColors = {
    DEBUG: "text-gray-600",
    INFO: "text-blue-600",
    WARN: "text-yellow-600",
    ERROR: "text-red-600",
    FATAL: "text-red-800",
  };

  const handleFilterSubmit = (data) => {
    setLogLevel(data.logLevels[0] || "");
    setStartTime(data.startTime ? data.startTime.toISOString() : "");
    setEndTime(data.endTime ? data.endTime.toISOString() : "");
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center justify-between w-full">
          <h1 className="text-2xl font-semibold capitalize">
            {applicationName} Logs
          </h1>
          <div className="flex gap-4">
            <Button
              variant="secondary"
              onClick={generateDummyLogs}
              disabled={isGeneratingDummy}
            >
              {isGeneratingDummy ? "Generating..." : "Generate Dummy Logs"}
            </Button>
            <Button onClick={() => fetchLogs()} disabled={isLoading}>
              {isLoading ? "Refreshing..." : "Refresh"}
            </Button>
          </div>
        </div>
      </div>

      <FiltersForm
        logLevel={logLevel}
        setLogLevel={setLogLevel}
        startTime={startTime}
        setStartTime={setStartTime}
        endTime={endTime}
        setEndTime={setEndTime}
        onSubmit={handleFilterSubmit}
      />

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {logs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">
            No logs found this means wither this application has no logs or the
            filters applied are too restrictive.
          </p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="w-16 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Level
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Message
                    </th>
                    <th className="w-20 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Timestamp
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 font-mono">
                  {logs.map((log) => (
                    <tr key={log.log_id}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <span className={logLevelColors[log.level]}>
                          {log.level}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {log.message}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {logs.length > 0 && (
            <div className="mt-4 text-center">
              {hasMore ? (
                <Button
                  variant="secondary"
                  onClick={loadMore}
                  disabled={isLoadingMore}
                >
                  {isLoadingMore ? "Loading..." : "Load More"}
                </Button>
              ) : (
                <p className="text-gray-500 text-sm">No more logs</p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function FiltersForm({
  logLevel,
  setLogLevel,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  onSubmit,
}) {
  const form = useForm({
    defaultValues: {
      logLevels: logLevel ? [logLevel] : [],
      startTime: startTime ? new Date(startTime) : undefined,
      endTime: endTime ? new Date(endTime) : undefined,
    },
  });

  const handleClearFilters = () => {
    form.reset({
      logLevels: [],
      startTime: undefined,
      endTime: undefined,
    });
    setLogLevel("");
    setStartTime("");
    setEndTime("");
    onSubmit(form.getValues());
  };

  const isFormChanged = () => {
    const values = form.getValues();
    return (
      values.logLevels.length > 0 ||
      values.startTime !== undefined ||
      values.endTime !== undefined
    );
  };

  const handleSubmit = (data) => {
    setLogLevel(data.logLevels[0] === "ALL" ? "" : data.logLevels[0] || "");
    setStartTime(data.startTime ? data.startTime.toISOString() : "");
    setEndTime(data.endTime ? data.endTime.toISOString() : "");
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <div className="flex justify-between">
        <div></div>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="mb-6 flex gap-4"
        >
          <FormField
            control={form.control}
            name="logLevels"
            render={({ field }) => (
              <FormItem className="flex-1">
                <Select
                  onValueChange={(value) => field.onChange([value])}
                  value={field.value?.[0] || ""}
                >
                  <SelectTrigger className="space-x-5">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All</SelectItem>
                    <SelectItem value="DEBUG">Debug</SelectItem>
                    <SelectItem value="INFO">Info</SelectItem>
                    <SelectItem value="WARN">Warn</SelectItem>
                    <SelectItem value="ERROR">Error</SelectItem>
                    <SelectItem value="FATAL">Fatal</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem className="flex-1">
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-72 border px-4 py-1.5 rounded justify-start text-left font-normal flex flex-row items-center",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(field.value, "PPP HH:mm")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                    <div className="border-t p-3">
                      <input
                        type="time"
                        className="w-full rounded-md border px-3 py-2"
                        onChange={(e) => {
                          if (field.value && e.target.value) {
                            const [hours, minutes] = e.target.value.split(":");
                            const newDate = new Date(field.value);
                            newDate.setHours(parseInt(hours));
                            newDate.setMinutes(parseInt(minutes));
                            field.onChange(newDate);
                          }
                        }}
                        value={
                          field.value
                            ? `${field.value.getHours().toString().padStart(2, "0")}:${field.value
                                .getMinutes()
                                .toString()
                                .padStart(2, "0")}`
                            : ""
                        }
                      />
                    </div>
                  </PopoverContent>
                </Popover>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem className="flex-1">
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        className={cn(
                          "w-72 border px-4 py-1.5 rounded justify-start text-left font-normal flex flex-row items-center",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        <p>
                          {field.value ? (
                            format(field.value, "PPP HH:mm")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </p>
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                    <div className="border-t p-3">
                      <input
                        type="time"
                        className="w-full rounded-md border px-3 py-2"
                        onChange={(e) => {
                          if (field.value && e.target.value) {
                            const [hours, minutes] = e.target.value.split(":");
                            const newDate = new Date(field.value);
                            newDate.setHours(parseInt(hours));
                            newDate.setMinutes(parseInt(minutes));
                            field.onChange(newDate);
                          }
                        }}
                        value={
                          field.value
                            ? `${field.value.getHours().toString().padStart(2, "0")}:${field.value
                                .getMinutes()
                                .toString()
                                .padStart(2, "0")}`
                            : ""
                        }
                      />
                    </div>
                  </PopoverContent>
                </Popover>
              </FormItem>
            )}
          />
          <div className="flex gap-4">
            <div className="flex gap-4">
              <Button
                variant="secondary"
                onClick={handleClearFilters}
                disabled={!isFormChanged()}
              >
                Clear Filters
              </Button>
              <Button type="submit" disabled={!isFormChanged()}>
                Apply
              </Button>
            </div>
          </div>
        </form>
      </div>
    </Form>
  );
}
