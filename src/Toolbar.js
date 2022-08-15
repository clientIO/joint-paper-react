import './Toolbar.css';
import { useContext } from 'react';
import GraphContext from './GraphContext';

function Toolbar ({ zoomOut, zoomIn, updateElements, updateScale }) {
  const graph = useContext(GraphContext);

  const reset = () => {
    const resetElements = [
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
        y: 100
      },
      {
        id: '3',
        title: 'Measure',
        assignment: 'John',
        elementType: 'task',
        status: 'at-risk',
        x: 576,
        y: 100
      }
    ];

    resetElements.forEach(element => {
      const cell = graph.current.getCell(element.id);
      cell.position(element.x, element.y);
    });

    updateElements(resetElements);
    updateScale(1);
}

  return (
  <div className="toolbar" style={{ position: 'absolute', zIndex: 100}}>
    <button onClick={zoomOut}>Zoom Out</button>
    <button onClick={zoomIn}>Zoom In</button>
    <button onClick={reset}>Reset</button>
  </div>
  )
}

export default Toolbar;