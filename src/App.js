import { useState, useRef } from 'react';
import './App.css';
import JointPaper from './JointPaper';
import Toolbar from './Toolbar';
import { GraphProvider } from './GraphContext'; 
import { dia, shapes } from 'jointjs';

const HEIGHT = 600;
const WIDTH = 850;
const INITIAL_ELEMENTS = [
  {
    id: '1',
    title: 'Create Story',
    assignment: 'Bob',
    elementType: 'task',
    status: 'done',
    targets: ['2']
  }, 
  {
    id: '2',
    title: 'Promote',
    assignment: 'Mary',
    elementType: 'task',
    status: 'pending',
    targets: ['3']
  },
  {
    id: '3',
    title: 'Measure',
    assignment: 'John',
    elementType: 'task',
    status: 'at-risk'
  }
];

const INITIAL_POSITIONS = {
  1: { x: 17, y: 100 },
  2: { x: 297, y: 100 },
  3: { x: 576, y: 100 },
}

function App() {
  const [elements, setElements] = useState(INITIAL_ELEMENTS);
  const [scale, setScale] = useState(1);
  const graph = useRef(new dia.Graph({}, { cellNamespace: shapes }));
  const [elementsPositions, setElementsPositions] = useState(INITIAL_POSITIONS);

  const zoomOut = () => {
    setScale((value) => Math.max(0.2, value - 0.2));
  }

  const zoomIn = () => {
    setScale((value) => Math.min(3, value + 0.2));
  }

  const reset = () => {
    const resetPositions = {
      1: { x: 17, y: 100 },
      2: { x: 297, y: 100 },
      3: { x: 576, y: 100 },
    };

    const resetElements = [
      {
        id: '1',
        title: 'Create Story',
        assignment: 'Bob',
        elementType: 'task',
        status: 'done',
        targets: ['2']
      }, 
      {
        id: '2',
        title: 'Promote',
        assignment: 'Mary',
        elementType: 'task',
        status: 'pending',
        targets: ['3']
      },
      {
        id: '3',
        title: 'Measure',
        assignment: 'John',
        elementType: 'task',
        status: 'at-risk'
      }
    ];

    setElements(resetElements);
    setElementsPositions(resetPositions);
    Object.entries(resetPositions).forEach(([id, position]) => {
      const { x, y } = position;
      const element = graph.current.getCell(id);
      element.position(x, y);
    });
    setScale(1);
}

  return (
    <div className="App" style={{ width: `${WIDTH}px`}}>
      <GraphProvider value={graph}>
        <Toolbar zoomIn={zoomIn} zoomOut={zoomOut} reset={reset} />
        <JointPaper width={WIDTH} height={HEIGHT} theme="material" scale={scale} elements={elements} updateElements={setElements} elementsPositions={elementsPositions} setElementsPositions={setElementsPositions} />
      </GraphProvider>
    </div>
  );
}

export default App;
