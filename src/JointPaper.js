import './JointPaper.css';
import { dia, V, shapes } from 'jointjs';
import { useEffect, useRef, useState } from 'react';
import JointElement from './JointElement';

function JointPaper(props) {
  const {
    width = 1000,
    height = 1000,
    theme = 'default',
    elements
  } = props;

    const paperEl = useRef(null);
    const [cells, setCells] = useState([]);
    const [matrix, setMatrix] = useState(V.createSVGMatrix());

    useEffect(() => {
      const graph = new dia.Graph({}, { cellNamespace: shapes });
      const paper = new dia.Paper({
        model: graph,
        cellViewNamespace: shapes,
        theme,
        width,
        height
      });

      paperEl.current.appendChild(paper.el);

      paper.on('scale translate', () => {
        setMatrix(paper.matrix());
      });

      graph.on('change:position', (el) => {
        setCells((currentCells) => {
          const cellIndex = currentCells.findIndex(c => c.id === el.id);
          const cell = currentCells[cellIndex];

          const { x, y } = el.position();
          cell.position = { x, y };

          const newCells = currentCells.filter(c => c.id !== el.id);
          return [...newCells, cell];
        });
      });

      const tempCells = [];
      const tempElements = [];

      elements.forEach(elementData => {
        const { id, elementType, x = 0, y = 0, ...element } = elementData;

        switch (elementType) {
          case 'task':
            tempCells.push({
              id,
              position: { x, y },
              status: element.status,
              elementType,
            });

            const rect = new shapes.standard.Rectangle()
            .set('id', id)
            .attr({body: { fill: 'transparent', strokeWidth: 0 }})
            .resize(248, 186)
            .position(x, y);

            tempElements.push(rect)
            break;
          default:
            // TODO Implement new element types here
            throw new Error(`Unknown element type: ${elementType}`);
        }
      });

      setCells(tempCells);
      graph.resetCells(tempElements);

      return () => {
        paper.remove();
      }
    }, []);

    const renderElements = () => {
      let elements = [];

      cells.forEach((cellData) => {
        const { id, elementType, position, ...element } = cellData;

        switch (elementType) {
          case 'task':
            elements.push(<JointElement key={id} x={position.x} y={position.y} {...element} />)
            break;
          default:
            // TODO Implement new element types here
            throw new Error(`Unknown element type: ${elementType}`);
        }
      });

      return elements;
    }

    return (
      <div
        className="paper"
      >
        <div
          ref={paperEl}
          style={{
            border: "1px solid gray",
            display: "inline-block",
          }}>
        </div>
        <div
        style={{
          transformOrigin: '0 0',
          transform: V.matrixToTransformString(matrix)
        }}
        >{renderElements()}</div>
      </div>
    );
  }

  export default JointPaper;
