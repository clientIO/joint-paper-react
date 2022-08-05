import './App.css';
import JointElement from './JointElement';
import JointPaper from './JointPaper';


const elements = [{
  id: '1',
}, {
  id: '2',
  x: 200,
  y: 200,
}];

function App() {
  return (
    <div className="App">
      <JointPaper width="500" height="500" theme="material">
        {elements.map(element => (
          <JointElement
            key={element.id}
            id={element.id}
            x={element.x}
            y={element.y}
          ></JointElement>
        ))}
      </JointPaper>
    </div>
  );
}

export default App;
