import './JointPaper.css';
import { dia, V, shapes } from 'jointjs';
import { useEffect, useRef, useState } from 'react';
import JointElement from './JointElement';

function JointPaper(props) {
  const {
    width = 1000,
    height = 1000,
    theme = 'default',
    updateElements,
    elements
  } = props;

    const paperEl = useRef(null);
    const [matrix, setMatrix] = useState(V.createSVGMatrix());

    const graph = useRef(new dia.Graph({}, { cellNamespace: shapes }));

    useEffect(() => {
      const paper = new dia.Paper({
        model: graph.current,
        cellViewNamespace: shapes,
        theme,
        width,
        height,
        background: {
          color: '#F8F9FB',
        },
      });

      paperEl.current.appendChild(paper.el);

      paper.on('scale translate', () => {
        setMatrix(paper.matrix());
      });

      graph.current.on('change:position', (el) => {
        updateElements((currentCells) => {
          return currentCells.map((cell) => {
            if (cell.id === el.id) {
              const { x, y } = el.position();

              cell.x = x;
              cell.y = y;
            }

            return cell;
          });
        });
      });

      return () => {
        paper.remove();
      }
    }, [])

    useEffect(() => {
      const tempElements = [];
      const idElementMap = {};
      const links = [];

      elements.forEach(elementData => {
        const { id, elementType, targets = [], x = 0, y = 0 } = elementData;
        let currentEl = null;

        switch (elementType) {
          case 'task':
            const rect = new shapes.standard.Rectangle()
            .set('id', id)
            .attr({body: { fill: 'transparent', strokeWidth: 0 }})
            .resize(248, 186)
            .position(x, y);

            currentEl = rect;
            break;
          default:
            // TODO Implement new element types here
            throw new Error(`Unknown element type: ${elementType}`);
        }

        tempElements.push(currentEl);
        idElementMap[id] = currentEl;

        targets.forEach(targetId => {
          links.push({
            source: id,
            target: targetId,
          });
        });
      });

      links.forEach(linkData => {
        const link = new shapes.standard.Link();
        link.source(idElementMap[linkData.source]);
        link.target(idElementMap[linkData.target]);
        tempElements.push(link);
      });

      graph.current.resetCells(tempElements);
    }, [elements.length]);

    const renderElements = () => {
      const nodes = [];

      elements.forEach((cellData) => {
        const { elementType, ...element } = cellData;

        switch (elementType) {
          case 'task':
            nodes.push(<JointElement key={element.id} updateElements={updateElements} {...element} />)
            break;
          default:
            // TODO Implement new element types here
            throw new Error(`Unknown element type: ${elementType}`);
        }
      });

      return nodes;
    }

    return (
      <div
        className="paper"
      >
        <div
          ref={paperEl}
          style={{
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
