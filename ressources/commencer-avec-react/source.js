import React from 'react'
import ReactDOM from 'react-dom'

function HelloWorld(props) {
  return (
    <div>
      Hello World
    </div>
  )
}

ReactDOM.render(
	<HelloWorld />,
	document.getElementById('react-container')
)