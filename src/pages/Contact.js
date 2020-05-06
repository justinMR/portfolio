import React, { useEffect } from "react";

const Contact = () => {
  useEffect(() => {
    document.title = "Contact";
  }, []);
  return (
    <div>
      <h1 className='title is-1 has-text-centered'>Contact</h1>
    </div>
  );
};

export default Contact;
