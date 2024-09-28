import React from 'react';
import TaskIndicator from './TaskIndicator';
import CreateTask from './createTask/CreateTask';
import { Outlet } from 'react-router-dom';
import BarChart from './Chart';
function Layout() {
    return (
      <div>
        <div className="flex flex-col md:flex-row md:justify-between pt-20 mt-1">
          <div className="flex flex-col w-full h-full">
            <CreateTask />
            <BarChart />
          </div>
          <div className="task-container w-auto mx-5 md:w-1/3 mt-3">
            <div className="indicator">
              <TaskIndicator />
            </div>
            <div className="outlet">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    );
}

export default Layout;