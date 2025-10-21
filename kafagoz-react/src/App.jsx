import React from 'react';
import EyeSVG from './EyeSVG';
import ProjectList from './ProjectList';
import './App.css';

function App() {
  return (
    <div className="wrapper">
      <header className="header">
        <div className="logo-holder">
          <EyeSVG />
        </div>
        <h1>Birtakım ufak tefek projeler</h1>
      </header>
      <ProjectList />
    </div>
  );
}

export default App;
