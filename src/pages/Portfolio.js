import React from "react";
import DATA from "../project-data";
import CardCollection from "../components/card-collection/card-collection.component";
class Portfolio extends React.Component {
  constructor(props) {
    super(props);
    this.state = { projects: DATA };
  }
  componentDidMount() {
    document.title = "Portfolio";
    //console.log(typeof this.state.cards);
  }
  render() {
    const { projects } = this.state;
    
    return (
      <div>
        <h1 className='title is-1 has-text-centered'>Portfolio</h1>

        <CardCollection projects={projects}/>
      </div>
    );
  }
}

export default Portfolio;
