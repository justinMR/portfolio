import React from "react";
import DATA from "../project-data";
import { useHistory } from "react-router-dom";

// const ProjectPage = (props) => {
//   console.log(props)
//   const [project, setProject] = useState([]);
//   let history = useHistory();

//   useEffect(() => {
//     document.title = `Portfolio: ${props.match.params.projectname}`;
//     return checkProject();
//   }, []);

//   const checkProject = () => {
//     DATA.forEach((projectUnit) => {
//       if (props.match.params.projectname === projectUnit.name) {
//         setProject(projectUnit);
//       }
//     });
//   };

//   return (
//     <div>
//       <button onClick={() => {history.goBack();}}>Go back to Portfolio</button>
//       <h1 className='title is-1 has-text-centered'>{project.name}</h1>
//       <p>{project.description}</p>
//       <a href={project.liveUrl} rel='noopener noreferrer'
//         alt='Go to project(s)'
//         target='_blank'
//       >
//         Go to project(s)
//       </a>
//     </div>
//   );
// };

class ProjectPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { project: {} };
  }

  componentDidMount() {
    DATA.forEach((projectUnit) => {
      if (this.props.match.params.projectname === projectUnit.name) {
        this.setState({ project: projectUnit });
      }
    });
  }

  render() {
    // let history = useHistory()
    return (
      <div>
        {" "}
        {/* <button
          onClick={() => {
            history.goBack();
          }}
        >
          Go back to Portfolio
        </button> */}
        <h1 className='title is-1 has-text-centered'>
          {this.state.project.name}
        </h1>
        <p>{this.state.project.description}</p>
        <a
          href={this.state.project.liveUrl}
          rel='noopener noreferrer'
          alt='Go to project(s)'
          target='_blank'
        >
          Go to project(s)
        </a>
      </div>
    );
  }
}

export default ProjectPage;
