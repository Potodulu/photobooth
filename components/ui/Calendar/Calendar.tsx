"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  DayPicker,
  UI,
  SelectionState,
  DayFlag,
  type DayPickerProps,
} from "react-day-picker";
import { cn } from "@/libs/cn";
import { elevationClasses, radiusClasses } from "@/libs/configs/variants";

export type CalendarProps = DayPickerProps;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        [UI.Root]: cn(
          "border-2 border-border bg-popover p-3 text-popover-foreground",
          radiusClasses.lg,
          elevationClasses.md,
        ),
        [UI.Months]: "flex flex-col gap-4 sm:flex-row",
        [UI.Month]: "flex flex-col gap-4",
        [UI.MonthCaption]: "relative flex items-center justify-center pt-1",
        [UI.CaptionLabel]: "text-sm font-semibold",
        [UI.Nav]: "flex items-center gap-1",
        [UI.PreviousMonthButton]: cn(
          "absolute left-1 inline-flex size-8 items-center justify-center border-2 border-border bg-background shadow-neo-sm rounded-[var(--radius-sm)] opacity-80 hover:opacity-100",
        ),
        [UI.NextMonthButton]: cn(
          "absolute right-1 inline-flex size-8 items-center justify-center border-2 border-border bg-background shadow-neo-sm rounded-[var(--radius-sm)] opacity-80 hover:opacity-100",
        ),
        [UI.MonthGrid]: "w-full border-collapse",
        [UI.Weekdays]: "flex",
        [UI.Weekday]: "w-9 text-[0.8rem] font-semibold text-muted-foreground",
        [UI.Week]: "mt-2 flex w-full",
        [UI.Day]:
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
        [UI.DayButton]: cn(
          "inline-flex size-9 items-center justify-center border-2 border-transparent p-0 font-medium transition-colors hover:border-border hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none aria-selected:opacity-100",
          radiusClasses.sm,
        ),
        [UI.WeekNumberHeader]: "w-9 text-[0.8rem] font-semibold",
        [UI.WeekNumber]: "size-9 text-[0.8rem] text-muted-foreground",
        [SelectionState.selected]:
          "[&_button]:border-border [&_button]:bg-primary [&_button]:text-primary-foreground [&_button]:shadow-neo-sm",
        [SelectionState.range_start]:
          "[&_button]:rounded-r-none [&_button]:border-border [&_button]:bg-primary [&_button]:text-primary-foreground",
        [SelectionState.range_end]:
          "[&_button]:rounded-l-none [&_button]:border-border [&_button]:bg-primary [&_button]:text-primary-foreground",
        [SelectionState.range_middle]:
          "[&_button]:rounded-none [&_button]:border-border [&_button]:bg-primary/30 [&_button]:text-primary-foreground",
        [DayFlag.today]: "[&_button]:border-border [&_button]:font-bold",
        [DayFlag.outside]:
          "[&_button]:text-muted-foreground [&_button]:opacity-50",
        [DayFlag.disabled]:
          "[&_button]:text-muted-foreground [&_button]:opacity-40",
        [DayFlag.hidden]: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) =>
          orientation === "left" ? (
            <ChevronLeft className="size-4" />
          ) : (
            <ChevronRight className="size-4" />
          ),
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
