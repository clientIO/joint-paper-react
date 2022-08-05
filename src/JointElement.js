import './JointElement.css';

function JointElement(props) {

    const { x = 0, y = 0, status = 'at-risk' } = props;

    return (
        <div
            // ref="taskElement"
            className="task"
            data-status={status}
            style={{
                left: `${x}px`,
                top: `${y}px`,
            }}
        >
            <header>
                <h1
                // v-text="task.title"
                >test</h1>
            </header>
            <input
                placeholder="Enter an assignment …"
                // :value="task.assignment"
                // @input="$emit('input', id, 'assignment', $event.target.value)"
            />
            <select
                value={status}
                onChange={()=>{}}
                // @input="$emit('input', id, 'status', $event.target.value)"
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
