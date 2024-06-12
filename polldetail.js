import React from 'react';
import Heading from './heading';
import Sidebar2 from './sidebar2';
import './polldetail.css'; // Import CSS file for styling
import Radium, { StyleRoot } from 'radium';

function Polldetail() {
  return (
    <div className='app'>
      <Heading />
      <StyleRoot>
        <div>
      <Sidebar2 />
      </div>
      </StyleRoot>
      
    </div>
  );
}

export default Radium(Polldetail);
