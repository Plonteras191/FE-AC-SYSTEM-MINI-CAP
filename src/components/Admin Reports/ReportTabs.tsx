interface ReportTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const ReportTabs = ({ activeTab, setActiveTab }: ReportTabsProps) => {
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'completed', label: 'Completed' },
    { id: 'pending', label: 'Pending/Accepted' },
    { id: 'rejected', label: 'Rejected' },
    { id: 'revenue', label: 'Revenue History' }
  ];

  return (
    <div className="border-b border-gray-200">
      <nav className="flex flex-wrap -mb-px overflow-x-auto" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              relative min-w-max px-4 sm:px-6 py-4 text-sm font-medium transition-all duration-200
              whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-b-2 border-transparent'
              }
            `}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default ReportTabs;