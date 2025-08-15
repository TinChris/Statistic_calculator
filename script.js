 
    // =========================
    // JavaScript logic, well-commented
    // =========================

    // Utility formatter: rounds to a fixed number of digits for clean UI.
    // If value is not finite (e.g., NaN), we return the original (to display a dash).
    const fmt = (n, digits = 4) => Number.isFinite(n) ? Number(n.toFixed(digits)) : n;

    // Parses a string into an array of finite numbers.
    // Accepts commas, spaces, semicolons, and newlines as separators.
    const parseNumbers = (input) => {
      return input
        .split(/[\,\s;]+/g)        // split by comma/space/semicolon/newline
        .map(Number)                 // coerce to numbers
        .filter((n) => Number.isFinite(n)); // keep only finite numbers
    };

    // Mean (average) of a numeric array.
    const getMean = (array) => array.reduce((acc, el) => acc + el, 0) / array.length;

    // Median: middle value of the sorted list; if even length, average of the two middles.
    const getMedian = (array) => {
      const sorted = array.toSorted((a, b) => a - b); // ES2023 immutable sort
      const len = sorted.length;
      const mid = Math.floor(len / 2);
      return len % 2 === 0
        ? (sorted[mid - 1] + sorted[mid]) / 2
        : sorted[mid];
    };

    // Mode: most frequent value(s). Returns null if all frequencies are identical (i.e., no mode).
    // Returns an array of modes if multiple values share the highest frequency.
    const getMode = (array) => {
      const counts = new Map();
      for (const el of array) counts.set(el, (counts.get(el) || 0) + 1);
      if (counts.size === 0) return null;

      const freqs = [...counts.values()];
      const allEqual = freqs.every((f) => f === freqs[0]);
      if (allEqual) return null;

      let maxCount = 0;
      for (const c of counts.values()) if (c > maxCount) maxCount = c;

      return [...counts.entries()]
        .filter(([, c]) => c === maxCount)
        .map(([v]) => v);
    };

    // Range: max - min of the array.
    const getRange = (array) => Math.max(...array) - Math.min(...array);

    // Variance: average of squared deviations from the mean.
    // population = true  -> divide by N (population variance)
    // population = false -> divide by N - 1 (sample variance)
    const getVariance = (array, population = true) => {
      const mean = getMean(array);
      const sumSq = array.reduce((acc, el) => {
        const d = el - mean;
        return acc + d * d;
      }, 0);
      const denom = population ? array.length : array.length - 1;
      return sumSq / denom;
    };

    // Standard deviation: square root of variance.
    const getStandardDeviation = (array, population = true) => Math.sqrt(getVariance(array, population));

    // Main calculate function: reads input, computes stats, and writes results into the UI.
    const calculate = () => {
      const raw = document.querySelector("#numbers")?.value ?? "";
      const numbers = parseNumbers(raw);
      const sample = document.querySelector('#sampleToggle')?.checked ?? false;

      // Guard against empty input: show dashes, then return.
      if (numbers.length === 0) {
        document.querySelector("#mean").textContent = "—";
        document.querySelector("#median").textContent = "—";
        document.querySelector("#mode").textContent = "—";
        document.querySelector("#range").textContent = "—";
        document.querySelector("#variance").textContent = "—";
        document.querySelector("#standardDeviation").textContent = "—";
        return;
      }

      const mean = getMean(numbers);
      const median = getMedian(numbers);
      const modeVal = getMode(numbers);
      const range = getRange(numbers);
      const variance = getVariance(numbers, !sample ? true : false); // toggle N vs N-1
      const stdev = getStandardDeviation(numbers, !sample ? true : false);

      document.querySelector("#mean").textContent = fmt(mean, 4);
      document.querySelector("#median").textContent = fmt(median, 4);
      document.querySelector("#mode").textContent =
        modeVal == null ? "no mode" : Array.isArray(modeVal) ? modeVal.join(", ") : modeVal;
      document.querySelector("#range").textContent = fmt(range, 4);
      document.querySelector("#variance").textContent = fmt(variance, 4);
      document.querySelector("#standardDeviation").textContent = fmt(stdev, 4);
    };

    // Wire up UI interactions: button click and pressing Enter in the textarea.
    document.querySelector('#calcBtn').addEventListener('click', calculate);
    document.querySelector('#numbers').addEventListener('keydown', (e) => {
      // If user presses Enter + (Cmd/Ctrl or plain Enter on desktop), trigger calculate.
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey || !e.shiftKey)) {
        e.preventDefault();
        calculate();
      }
    });
