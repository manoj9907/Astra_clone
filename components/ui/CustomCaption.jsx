import { format } from "date-fns";
import { useDayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { LeftArrowIcon, RightArrowIcon } from "../icons";
import Select from "./select";

export default function CustomCaption({ fromYear, toYear }) {
  const { goToMonth, nextMonth, previousMonth, months } = useDayPicker();
  const year = months[0].date.getFullYear();
  const getYears = [];
  for (let i = fromYear; i <= toYear; i += 1) {
    getYears.push(i);
  }
  const handleYearChange = (e) => {
    const newMonth = new Date(months);
    newMonth.setFullYear(e);
    goToMonth(newMonth);
  };
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between px-3 text-sm">
        {format(months[0].date, "MMM yyy")}
        <div className="year-select">
          <Select
            value={year}
            handleDropdown={handleYearChange}
            selectLabel={getYears}
            className="h-7 w-24"
          />
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={!previousMonth}
            onClick={() => previousMonth && goToMonth(previousMonth)}
            aria-label="Go to previous month"
          >
            <LeftArrowIcon className="h-3 w-3" />
          </button>

          <button
            type="button"
            disabled={!nextMonth}
            onClick={() => nextMonth && goToMonth(nextMonth)}
            aria-label="Go to next month"
          >
            <RightArrowIcon className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
