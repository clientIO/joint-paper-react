import './JointPaper.css';
import { dia, V, shapes } from 'jointjs';
import { useEffect, useRef, useState } from 'react';

function JointPaper(props) {

  const {
    width = 1000,
    height = 1000,
    theme = 'default',
    children
  } = props;

    const paperEl = useRef(null);
    // const cellsEl = useRef(null);

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

      const cells = children.map((child) => {
        return {
          type: 'standard.Rectangle',
          size: { width: 100, height: 100 },
          position: { x: child.props.x, y: child.props.y },
        }
      });

      paper.model.addCells(cells);

      return () => {
        paper.remove();
      }
    });

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
        >{props.children}</div>
      </div>
    );
  }

  export default JointPaper;
