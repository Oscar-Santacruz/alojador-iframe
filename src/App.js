import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Modal from 'react-modal';

Modal.setAppElement('#root') // Esto es necesario para la accesibilidad

function App() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [iframeResponse, setIframeResponse] = useState('');

  const iframeRef = useRef(null);
  
  // En tu página principal
useEffect(() => {
  const handleMessage = (event) => {
    // Puedes agregar verificaciones de seguridad aquí
    if (event.data === "OK, foto obtenida" ) {
      setModalIsOpen(false);
      setIframeResponse(event.data); // Almacena la respuesta en el estado
    }
  };
  window.addEventListener('message', handleMessage);
  // Asegúrate de eliminar el event listener cuando el componente se desmonte
  return () => {
    window.removeEventListener('message', handleMessage);
  };
}, []);  
 
  const sendMessage = () => {
    if (iframeRef.current) {
      // Envía el email al iframe
      console.log("envio de info= " + email)

      iframeRef.current.contentWindow.postMessage({ email }, '*');
    }
  };

  return ( 
    <Router>
      <Route path="/">
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
        <button onClick={() => setModalIsOpen(true)}>Open Iframe</button>
        <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)}>
          <button onClick={sendMessage}>Enviar info al iframe</button>
          <iframe ref={iframeRef} src={`http://localhost:3000?email=${encodeURIComponent(email)}`}
            width="500px"
            height="500px"
            id="myId"
            className="myClassname"
            display="initial"
            position="relative"
            allow="camera"/>
        </Modal>
        {iframeResponse && <p>Respuesta del iframe: {iframeResponse}</p>}
      </Route>
    </Router>
  );
}

export default App;
