import { useState } from 'react';
import './App.css';
import JointPaper from './JointPaper';

function App() {
  const [elements, setElements] = useState([
    {
      id: '1',
      title: 'Create Story',
      assignment: 'Bob',
      elementType: 'task',
      status: 'done',
      targets: ['2'],
      x: 17,
      y: 100
    }, 
    {
      id: '2',
      title: 'Promote',
      assignment: 'Mary',
      elementType: 'task',
      status: 'pending',
      targets: ['3'],
      x: 297,
      y: 100,
    },
    {
      id: '3',
      title: 'Measure',
      assignment: 'John',
      elementType: 'task',
      status: 'at-risk',
      x: 576,
      y: 100,
    }
  ]);

  return (
    <div className="App">
      <JointPaper width="850" height="600" theme="material" elements={elements} updateElements={setElements}/>
    </div>
  );
}

export default App;
