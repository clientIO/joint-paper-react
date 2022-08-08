import './App.css';
import JointPaper from './JointPaper';


const elements = [
  {
    id: '1',
    elementType: 'task',
    status: 'at-risk',
  }, 
  {
    id: '2',
    elementType: 'task',
    status: 'at-risk',
    x: 200,
    y: 200,
  }
];

function App() {
  return (
    <div className="App">
      <JointPaper width="500" height="500" theme="material" elements={elements} />
    </div>
  );
}

export default App;
