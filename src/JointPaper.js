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
    elementsPositions,
    setElementsPositions
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

      graph.current.on('change:position', (el) => {
        setElementsPositions((positions) => {
          const { x, y } = el.position();
          const newPositions = { ...positions, [el.id]: { x: x, y } };

          return newPositions;
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

      elements.forEach(elementData => {
        const { id, elementType, targets = [] } = elementData;
        const elementPosition = elementsPositions[id] || { x: 0, y: 0 };

        const widthEl = nodeRefs.current[id].offsetWidth;
        const heightEl = nodeRefs.current[id].offsetHeight;

        switch (elementType) {
          case 'task':
            const rect = new shapes.standard.Rectangle()
              .set('id', id)
              .attr({body: { fill: 'transparent', strokeWidth: 0 }})
              .resize(widthEl, heightEl)
              .position(elementPosition.x, elementPosition.y);

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
        const { elementType, x: _x, y: _y, ...element } = cellData;

        const { x, y } = elementsPositions[element.id] ?? { x: 0, y: 0 };

        switch (elementType) {
          case 'task':
            return <JointElement key={element.id} ref={el => (nodeRefs.current[element.id] = el)} x={x} y={y} updateElements={updateElements} {...element} />;
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
        >{renderElements()}</div>
      </div>
    );
  }

  export default JointPaper;
