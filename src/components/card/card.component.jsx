import React from "react";
import { Link } from "react-router-dom";
import "./card.styles.scss";

const Card = (props) => {
  return (
    <div className='column card'>
      <div className='card-image'>
        <figure className='image is-4by3'>
          <img
            src='https://bulma.io/images/placeholders/1280x960.png'
            alt='Placeholder'
          />
        </figure>
      </div>
      <h3 className="has-text-centered">{props.name.replace('-', ' ')}</h3>
      <Link to={`/portfolio/${props.name}`}>{props.name}</Link>
    </div>
  );
};

export default Card;
