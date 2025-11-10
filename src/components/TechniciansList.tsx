import { FaUserCog } from 'react-icons/fa';

interface TechniciansListProps {
  technicians?: string[];
}

const TechniciansList = ({ technicians }: TechniciansListProps) => {
  if (!technicians || technicians.length === 0) {
    return null;
  }

  return (
    <div className="pt-4 border-t border-gray-200">
      <p className="flex items-center gap-2 font-semibold text-gray-700 mb-3 text-sm">
        <FaUserCog className="h-4 w-4 text-blue-600" />
        <span>Assigned Technicians:</span>
      </p>
      <ul className="space-y-2">
        {technicians.map((tech: string, index: number) => (
          <li key={index} className="flex items-center gap-2 text-sm bg-gray-50 px-3 py-2 rounded-lg">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            <span className="text-gray-700">{tech}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TechniciansList;