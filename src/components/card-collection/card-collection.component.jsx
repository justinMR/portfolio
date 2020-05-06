import React from "react";
import Card from "../card/card.component";

import "./card-collection.styles.scss";
const CardCollection = (props) => {
  return (
    <div className='columns'>
      {props.projects.map(function (project) {
        return <Card key={project.id.toString()} name={project.name} />;
      })}
    </div>
  );
};

export default CardCollection;
