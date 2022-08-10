import { useEffect, useState } from 'react';
import './JointElement.css';

function JointElement(props) {
    const { id, x = 0, y = 0, status = 'at-risk', title = 'Blank', assignment = '', updateElements } = props;

    const [inputValue, setInputValue] = useState(assignment);
    const [statusValue, setStatusValue] = useState(status);

    const updateElementData = () => {
        updateElements((currentCells) => {
            return currentCells.map((cell) => {
                if (cell.id === id) {
                    cell.assignment = inputValue;
                    cell.status = statusValue;
                }

                return cell;
            });
        }
        );
    }

    useEffect(() => {
        updateElementData()
    }, [inputValue, statusValue]);

    const onAssignmentChange = ({ target: { value }}) => setInputValue(value);

    const onStatusChange = ({ target: { value }}) => setStatusValue(value);

    return (
        <div
            className="task"
            data-status={statusValue}
            style={{
                left: `${x}px`,
                top: `${y}px`,
            }}
        >
            <header>
                <h1>{title}</h1>
                <i/>
            </header>
            <input
                placeholder="Enter an assignment …"
                onChange={onAssignmentChange}
                value={inputValue}
            />
            <select
                value={statusValue}
                onChange={onStatusChange}
                >
                <option disabled value="">Select status …</option>
                <option value="done">Done</option>
                <option value="pending">Pending</option>
                <option value="at-risk">At Risk</option>
            </select>
        </div>
    );
}

export default JointElement;
