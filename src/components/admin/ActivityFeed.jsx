import React from 'react';
import { Clock } from 'lucide-react'; 
const activities = [
  {
    title: "New Order Received",
    description: "Order #3852 from John Smith",
    time: "2 minutes ago",
    color: "bg-blue-500"
  },
  {
    title: "Server Update",
    description: "System kernel updated to v2.4.0",
    time: "1 hour ago",
    color: "bg-emerald-500"
  },
  {
    title: "New Customer",
    description: "Sarah Johnson created an account",
    time: "3 hours ago",
    color: "bg-amber-500"
  }
];

function ActivityFeed() {
  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">
              Activity Feed
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Recent System Activities
            </p>
          </div>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View All
          </button>
        </div>
      </div>

      {/* Content List */}
      <div className="p-6 space-y-4">
        {activities.map((activity, index) => (
          <div 
            key={index} 
            className="flex items-start space-x-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
          >
            {/* Status Dot/Line */}
            <div className={`p-2 rounded-lg shrink-0 ${activity.color} bg-opacity-10`}>
              <div className={`w-2 h-2 rounded-full ${activity.color}`}></div>
            </div>

            {/* Activity Details */}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-slate-800 dark:text-white">
                {activity.title}
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                {activity.description}
              </p>
              
              {/* Time */}
              <div className="flex items-center space-x-1 mt-1">
                <Clock className="w-3 h-3 text-slate-400" />
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {activity.time}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ActivityFeed;