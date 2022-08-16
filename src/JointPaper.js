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
      const links = [];

      for (const graphEl of graph.current.getElements()) {
        const isInElements = elements.some((element) => element.id === graphEl.id);
        if (!isInElements) graph.current.removeCells([graphEl]);
      }

      for (const element of elements) {
        const { id, elementType, targets = [], x, y } = element;

        const widthEl = nodeRefs.current[id].offsetWidth;
        const heightEl = nodeRefs.current[id].offsetHeight;

        const cell = graph.current.getCell(id);

        if (!cell) {
          let tempEl = null;
          switch (elementType) {
            case 'task':
              const rect = new shapes.standard.Rectangle()
                .set('id', id)
                .attr({body: { fill: 'transparent', strokeWidth: 0 }})
                .resize(widthEl, heightEl)
                .position(x, y);

              tempEl = rect;
              break;
            default:
              // TODO Implement new element types here
              throw new Error(`Unknown element type: ${elementType}`);
          }

          graph.current.addCell(tempEl);
        } else {
          cell.position(x, y).resize(widthEl, heightEl);
        }

        targets.forEach(targetId => {
          const linkInGraph = graph.current.getCell(`${id}-${targetId}`);
          const targetEl = graph.current.getCell(targetId);

          if (linkInGraph || !targetEl) return;

          links.push({
            source: id,
            target: targetId,
          });
        });
      }

      links.forEach(linkData => {
        const link = new shapes.standard.Link().set('id', `${linkData.source}-${linkData.target}`);
        link.source({ id: linkData.source });
        link.target({ id: linkData.target });
        graph.current.addCell(link)
      });

    }, [elements]);

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
