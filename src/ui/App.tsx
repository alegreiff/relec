import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { useStatistics } from "./useStatistics";
import { Chart } from "./Chart";

function App() {
  const staticData = useStaticData();

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
    <div className="container mx-auto">
      <header className=" h-12 w-full p-4 bg-slate-700 flex [-webkit-app-region:drag]">
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
      <div className="flex flex-row gap-8 justify-between p-8">
        <div className="w-1/2">
          <SelectOption
            onClick={() => setActiveView("CPU")}
            title="CPU"
            view="CPU"
            subTitle={staticData?.cpuModel ?? ""}
            data={cpuUsages}
          />
          <SelectOption
            onClick={() => setActiveView("RAM")}
            title="RAM"
            view="RAM"
            subTitle={(staticData?.totalMemoryGB.toString() ?? "") + " GB"}
            data={ramUsages}
          />
          <SelectOption
            onClick={() => setActiveView("STORAGE")}
            title="STORAGE"
            view="STORAGE"
            subTitle={(staticData?.totalStorage.toString() ?? "") + " GB"}
            data={storageUsages}
          />
        </div>
        <div className="h-48 w-1/2 flex self-center">
          <Chart
            selectedView={activeView}
            data={activeUsages}
            maxDataPoints={10}
          />
        </div>
      </div>
    </div>
  );
}

function SelectOption(props: {
  title: string;
  view: View;
  subTitle: string;
  data: number[];
  onClick: () => void;
}) {
  return (
    <button onClick={props.onClick} className="block w-full hover:bg-stone-700">
      <div className="flex gap-8 cursor-pointer">
        <div>{props.title}</div>
        <div>{props.subTitle}</div>
      </div>
      <div className="w-full h-16 ">
        <Chart selectedView={props.view} data={props.data} maxDataPoints={10} />
      </div>
    </button>
  );
}
function useStaticData() {
  const [staticData, setStaticData] = useState<StaticData | null>(null);

  useEffect(() => {
    (async () => {
      setStaticData(await window.electron.getStaticData());
    })();
  }, []);

  return staticData;
}

export default App;
