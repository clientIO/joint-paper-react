import './JointPaper.css';
import { dia, shapes, V } from 'jointjs';
import { useContext, useEffect, useRef, useState } from 'react';
import JointElement from './JointElement';
import GraphContext from './GraphContext';

function JointPaper(props) {
  const {
    width = 1000,
    height = 1000,
    theme = 'default',
    scale,
    updateElements,
    elements,
  } = props;

    const paperEl = useRef(null);
    const nodeRefs = useRef({});
    const graph = useContext(GraphContext);
    const paper = useRef();
    const [matrix, setMatrix] = useState(V.createSVGMatrix())

    useEffect(() => {
      paper.current = new dia.Paper({
        model: graph.current,
        cellViewNamespace: shapes,
        theme,
        width,
        height,
        background: {
          color: '#F8F9FB',
        },
      });

      paperEl.current.appendChild(paper.current.el);

      graph.current.on('change:position', (movedEl) => {
        updateElements((elements) => {
          return elements.map((element) => {
            if (element.id === movedEl.id) {
              const { x, y } = movedEl.position();

              element.x = x;
              element.y = y;
            }
            return element;
          });
        });
      });

      paper.current.on('blank:pointerdblclick', (_evt, x, y) => {
        updateElements((elements) => {
          const newElement = {
            id: `${elements.length + 1}`,
            title: 'New Task',
            assignment: '',
            elementType: 'task',
            status: 'pending',
            targets: [],
            x,
            y
          };

          return [...elements, newElement];
        });
      });

      return () => {
        graph.current.off('change:position');
        paper.current.remove();
      }
    }, []);

    useEffect(() => {
      const tempElements = [];
      const links = [];

      elements.forEach(element => {
        const { id, elementType, targets = [], x, y } = element;

        const widthEl = nodeRefs.current[id].offsetWidth;
        const heightEl = nodeRefs.current[id].offsetHeight;

        switch (elementType) {
          case 'task':
            const rect = new shapes.standard.Rectangle()
              .set('id', id)
              .attr({body: { fill: 'transparent', strokeWidth: 0 }})
              .resize(widthEl, heightEl)
              .position(x, y);

            tempElements.push(rect);
            break;
          default:
            // TODO Implement new element types here
            throw new Error(`Unknown element type: ${elementType}`);
        }

        targets.forEach(targetId => {
          links.push({
            source: id,
            target: targetId,
          });
        });
      });

      links.forEach(linkData => {
        const link = new shapes.standard.Link();
        link.source({ id: linkData.source });
        link.target({ id: linkData.target });
        tempElements.push(link);
      });

      graph.current.resetCells(tempElements);
    }, [elements.length]);

    useEffect(() => {
      const size = paper.current.getComputedSize();
      paper.current.translate(0, 0)
      paper.current.scale(scale, scale, size.width / 2, size.height / 2);
      setMatrix(paper.current.matrix());
    }, [scale]);

    const renderElements = () => {
      return elements.map((cellData) => {
        const { elementType, x = 0, y = 0, ...element } = cellData;

        switch (elementType) {
          case 'task':
            return (
              <JointElement
                key={element.id}
                ref={el => (nodeRefs.current[element.id] = el)}
                x={x}
                y={y}
                updateElements={updateElements}
                {...element} 
              />
            );
          default:
            // TODO Implement new element types here
            throw new Error(`Unknown element type: ${elementType}`);
        }
      });
    }

    return (
      <div
        className="paper"
        style={{ width: `${width}px`, height: `${height}px` }}
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
            transform: V.matrixToTransformString(matrix),
          }}
        >
          {renderElements()}
        </div>
      </div>
    );
  }

  export default JointPaper;
