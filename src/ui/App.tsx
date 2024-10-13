import { useEffect, useMemo, useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { useStatistics } from "./useStatistics";
import { Chart } from "./Chart";

function App() {
  const [count, setCount] = useState(0);
  const statistics = useStatistics(10);
  const [activeView, setActiveView] = useState<View>("CPU");
  const cpuUsages = useMemo(
    () => statistics.map((stat) => stat.cpuUsage),
    [statistics]
  );

  const ramUsages = useMemo(
    () => statistics.map((stat) => stat.ramUsage),
    [statistics]
  );

  const storageUsages = useMemo(
    () => statistics.map((stat) => stat.storageData),
    [statistics]
  );

  const activeUsages = useMemo(() => {
    switch (activeView) {
      case "CPU":
        return cpuUsages;
      case "RAM":
        return ramUsages;
      case "STORAGE":
        return storageUsages;
    }
  }, [activeView, cpuUsages, ramUsages, storageUsages]);

  useEffect(() => {
    window.electron.subscribeChangeView((view) => setActiveView(view));
  }, []);

  return (
    <div>
      <header className="absolute top-0 left-0 w-full p-4 bg-slate-700 flex [-webkit-app-region:drag]">
        <button
          onClick={() => window.electron.sendFrameAction("CLOSE")}
          className="[-webkit-app-region:no-drag] rounded-full w-4 p-2 h-4 m-1 bg-red-500"
          id="close"
        ></button>
        <button
          onClick={() => window.electron.sendFrameAction("MINIMIZE")}
          className="[-webkit-app-region:no-drag] rounded-full w-4 p-2 h-4 m-1 bg-yellow-500"
          id="minimize"
        ></button>
        <button
          onClick={() => window.electron.sendFrameAction("MAXIMIZE")}
          className="[-webkit-app-region:no-drag] rounded-full w-4 p-2 h-4 m-1 bg-lime-500"
          id="maximize"
        ></button>
      </header>
      <div>
        <a href="https://youtu.be/fP-371MN0Ck?t=5902">Video tutorial</a>
        <div className="h-48">
          <Chart data={activeUsages} maxDataPoints={10} />
        </div>

        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1> PBS:: Vite + React</h1>
      <div className="card">
        <button className="" onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  );
}

export default App;
