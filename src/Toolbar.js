import './Toolbar.css';

function Toolbar ({ zoomOut, zoomIn, reset }) {
  return (
  <div className="toolbar" style={{ position: 'absolute', zIndex: 100 }}>
    <button onClick={zoomOut}>Zoom Out</button>
    <button onClick={zoomIn}>Zoom In</button>
    <button onClick={reset}>Reset</button>
  </div>
  )
}

export default Toolbar;