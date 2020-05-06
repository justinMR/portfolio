import React, { useEffect } from "react";

const About = () => {
  useEffect(() => {
    document.title = "About";
  }, []);
  return (
    <div>
      <h1 className='title is-1 has-text-centered'>About</h1>
      <p>
        My name is Justin Michael Ramirez. I'm a Front-End Developer based in
        NYC. I've had the privilege of working in many different teams: from
        local to remote freelance clients to national organizations and even
        on-site at Fortune 5 company.
      </p>
      <p>Skilled in the following:</p>
      <p>Currently learning:</p>
    </div>
  );
};

export default About;
