const CHART_COLORS = [
  "#A98252",
  "#315C68",
  "#6F7755",
  "#8A5A67",
  "#B27A3F",
  "#536A8A",
  "#78638C",
  "#4F7A6B"
];

function SalesCategoryChart({
  data,
  selectedCategoryId,
  onSelect,
  labels
}) {
  if (!data.length) {
    return (
      <div className="flex min-h-64 items-center justify-center rounded-xl bg-slate-50 px-6 text-center text-slate-500 dark:bg-slate-950">
        {labels.noSalesData}
      </div>
    );
  }

  const totalQuantity = data.reduce(
    (total, category) => total + category.quantity,
    0
  );
  const radius = 72;
  const circumference = 2 * Math.PI * radius;
  const chartSegments = data.map((category, index) => {
    const percentage = category.quantity / totalQuantity;
    const previousPercentage = data
      .slice(0, index)
      .reduce(
        (total, previousCategory) =>
          total + previousCategory.quantity / totalQuantity,
        0
      );

    return {
      ...category,
      color: CHART_COLORS[index % CHART_COLORS.length],
      dashLength: percentage * circumference,
      dashOffset: -previousPercentage * circumference
    };
  });

  return (
    <div className="grid items-center gap-6 lg:grid-cols-[minmax(260px,0.8fr)_minmax(260px,1fr)]">
      <div className="relative mx-auto h-64 w-64">
        <svg
          viewBox="0 0 200 200"
          role="img"
          aria-label={labels.chartAriaLabel}
          className="h-full w-full -rotate-90"
        >
          <title>{labels.chartAriaLabel}</title>
          <circle cx="100" cy="100" r={radius} fill="none" stroke="currentColor" strokeWidth="34" className="text-slate-100 dark:text-slate-800" />
          {chartSegments.map((category) => (
              <circle
                key={category.id}
                cx="100"
                cy="100"
                r={radius}
                fill="none"
                stroke={category.color}
                strokeWidth={selectedCategoryId === category.id ? 40 : 34}
                strokeDasharray={`${category.dashLength} ${circumference - category.dashLength}`}
                strokeDashoffset={category.dashOffset}
                className="cursor-pointer transition-[stroke-width]"
                onClick={() => onSelect(category.id)}
              />
          ))}
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <strong className="text-3xl text-slate-900 dark:text-white">{totalQuantity}</strong>
          <span className="max-w-24 text-xs text-slate-500">{labels.productsSold}</span>
        </div>
      </div>

      <div className="space-y-2">
        {data.map((category, index) => (
          <button
            key={category.id}
            type="button"
            onClick={() => onSelect(category.id)}
            aria-pressed={selectedCategoryId === category.id}
            className={`flex w-full items-center justify-between gap-4 rounded-xl border px-4 py-3 text-left transition ${selectedCategoryId === category.id ? "border-[#A98252] bg-[#F7F0E6] dark:bg-[#2B241F]" : "border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"}`}
          >
            <span className="flex min-w-0 items-center gap-3">
              <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }} />
              <span className="truncate font-medium text-slate-800 dark:text-slate-100">{category.name}</span>
            </span>
            <span className="shrink-0 text-sm font-semibold text-slate-700 dark:text-slate-200">
              {category.percentage.toFixed(1)}%
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default SalesCategoryChart;
