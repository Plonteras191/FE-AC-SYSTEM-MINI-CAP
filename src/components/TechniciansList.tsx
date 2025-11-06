import { FaUserCog } from 'react-icons/fa';

interface TechniciansListProps {
  technicians?: string[];
}

const TechniciansList = ({ technicians }: TechniciansListProps) => {
  if (!technicians || technicians.length === 0) {
    return null;
  }

  return (
    <div className="technicians-section">
      <p className="technicians-header">
        <FaUserCog className="icon" /> <strong>Assigned Technicians:</strong>
      </p>
      <ul className="technicians-list">
        {technicians.map((tech: string, index: number) => (
          <li key={index} className="technician-item">
            {tech}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TechniciansList;