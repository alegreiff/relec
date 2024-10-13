import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'

import './App.css'
import { BaseChart } from './BaseChart'

function App() {
  const [count, setCount] = useState(0)

  useEffect(() => {

    const unsub = window.electron.subscribeStatistics((stats) => console.log(stats));
    return unsub;
  }, [])

  return (
    <>
      <div>
        <a href="https://youtu.be/fP-371MN0Ck?t=5902">Video tutorial</a>

        <div className='h-64 bg-amber-400'>
          <BaseChart
            data={[{ value: 25 }, { value: 30 }, { value: 72 }]}>
          </BaseChart>
        </div>

        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1> PBS::  Vite + React</h1>
      <div className="card">
        <button className='bg-slate-800' onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
