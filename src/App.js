import React from "react";
// import "./App.css";
//Routes
import { HashRouter, Switch, Route } from "react-router-dom";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Portfolio from "./pages/Portfolio";
import ProjectPage from "./pages/ProjectPage";
//Nav
import Nav from "./components/nav/Nav";
//Syling
import "bulma/css/bulma.css";

function App() {
  return (
    <HashRouter>
      <Nav />
      <div className='container'>
        <Switch>
          <Route exact path='/' component={About}></Route>
          <Route exact path='/about' component={About}></Route>
          <Route exact path='/contact' component={Contact}></Route>
          <Route exact path='/portfolio' component={Portfolio}></Route>
          <Route
            exact
            path='/portfolio/:projectname'
            component={ProjectPage}
          ></Route>
        </Switch>
      </div>
    </HashRouter>
  );
}

export default App;
