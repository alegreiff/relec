const POLLING_INTERVAL = 1200;
import osUtils from "os-utils";
import fs from "fs";
import os from "os";

export function pollResources() {
  setInterval(async () => {
    const cpuUsage = await getCpuUsage();
    const ramUsage = getRamUsage();
    const storageData = gestStorageData();

    console.log({ cpuUsage, ramUsage, storageData });
  }, POLLING_INTERVAL);
}

export function getStaticData() {
  const totalStorage = gestStorageData().total;
  const cpuModel = os.cpus;
  const totalMemoryGB = Math.floor(osUtils.totalmem() / 1024);

  return {
    totalStorage,
    cpuModel,
    totalMemoryGB,
  };
}

function getCpuUsage() {
  return new Promise((resolve) => {
    osUtils.cpuUsage(resolve);
  });
  //osUtils.cpuUsage((percentage: number) => console.log(percentage));
}

function getRamUsage() {
  return 1 - osUtils.freememPercentage();
}

function gestStorageData() {
  const stats = fs.statfsSync(process.platform === "win32" ? "C://" : "/");
  const total = stats.bsize * stats.blocks;
  const free = stats.bsize * stats.bfree;

  return {
    total: Math.floor(total / 1_000_000_000),
    usage: 1 - free / total,
  };
}
