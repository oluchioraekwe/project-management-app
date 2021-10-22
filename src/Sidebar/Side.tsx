import React, { useState, useEffect } from "react";
import { useParams } from 'react-router'
import { Link } from 'react-router-dom'
import { Avatar, IconButton } from "@material-ui/core";
import SearchIcon from "@mui/icons-material/Search";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Navbar, ProjectNavbar, ProfileNavbar } from './navbar';
import "./Side.css";
import { ProjectModalComp, TeamModalComp } from "./Mod";
import MainContent from './mainContent'
import { FilesPage } from "../filesPage/files";
import Password from "../ChangePassword/Password"
// import Profile from "./profile";

export interface ITask {
  [x: string]: any;
  title: string;
  projectID: string;
  assignedUser: string;
  description: string;
  files: [file];
  comments: [iComment];
  dueDate: Date;
  status: string;
}

export interface file {
  _id?: string,
  fileUrl: string;
  fileName: string;
  uploadedBy: {
    userId: string,
    userName?: string,
    userAvatar?: string
  };
  fileSize: string,
  uploadedOn: number
}

export interface iComment {
  _id?: string,
  id?: string,
  createdBy: {
    userId: string,
    userName: string
  };
  content: string;
  createdOn: number;
  updatedOn?: number;
}

export interface userProject {
  projectId?: string;
  projectName?: string;
}

export interface userType {
  _id?: string
  firstname?: string;
  lastname?: string;
  email?: string;
  password?: string;
  gender?: string;
  role?: string;
  location?: string;
  projects?: Array<userProject>;
  teams?: string[];
  about?: string;
  isVerified?: boolean;
  avatar?: string;
  resetpasswordtoken?: string;
  resetpasswordexpires?: string;
  facebookId?: string;
  googleId?: string;
  closedTasks: ITask[],
  openedTasks: ITask[]
}

function Side(props: any) {

  const { userToken, projectname, projectid } = useParams() as any
  let loggedUser: userType
  if (userToken) {
    console.log(userToken)
    const userFromToken = userToken.split('~').slice(1).join('~')
    const token = userToken.split('~')[0]
    loggedUser = JSON.parse(userFromToken)
    localStorage.setItem('token', token)
    localStorage.setItem('user', userFromToken)
  }
  loggedUser = JSON.parse(localStorage.getItem('user') as string)
  const preUser = {closedTasks: [], openedTasks: []} as userType
  const [projects, setProjects] = useState<any[]>([])

  useEffect(() => {
    const token = localStorage.getItem('token')
    fetch(`https://jaraaa.herokuapp.com/profile/getprojects`, {
      method: "GET",
      headers: { 'Content-Type': 'application/json', "authorization": `${token}` }
    }).then(res => res.json())
      .then(data => {
        if (!data.msg) {
          console.log("Major:", data)
          setProjects(data)
        } else {
          console.log(data.user, ' project data')
          setProjects(data)
        }
        // window.location.href = "/success"
      })
      .catch(err => {
        console.log(err.response, 'error');
      })
  },[])

  console.log(projects, "projects found")

  console.log(loggedUser, 'logged user')


  const [project, setProject] = useState<{ projectId: string, projectName: string }>({ projectId: "", projectName: "" })
  const [teamId, setTeamId] = useState('')
  const [profile, setProfile] = useState<userType>(preUser)
  if (project) console.log(project, 'project')
  interface ITeam {
    _id: string;
    projectID?: string;
    owner: string;
    teamName?: string;
    members: [teamMember];
  }

  interface teamMember {
    userId: string;
  }
  const [teams, setTeams] = useState<ITeam[]>([])

  useEffect(() => {
    const token = localStorage.getItem('token')
    console.log(token)
    fetch(`https://jaraaa.herokuapp.com/${props.projectId}/get-teams`, {
      method: "GET",
      headers: { 'Content-Type': 'application/json', "authorization": `${token}` }
    }).then(res => res.json())
      .then(data => {
        if (data.msg || data.error) {
          console.log("Major:", data)
        } else {
          console.log(data.teams, 'data')
          setTeams(data.teams)
        }
        // window.location.href = "/success"
      })
      .catch(err => {
        console.log(err);
      })
  }, [project])

  useEffect(() => {
    console.log(teamId)
  }, [teamId])


  const [projectModalIsOpen, setProjectIsOpen] = useState<boolean>(false);
  const [teamModalIsOpen, setTeamIsOpen] = useState<boolean>(false);

  function openProjectModal() {
    setProjectIsOpen(true);
  }

  function openTeamModal() {
    setTeamIsOpen(true);
  }

  function closeModal() {
    setProjectIsOpen(false);
    setTeamIsOpen(false);
  }

  function openProject(e: any) {
    setProject({ projectId: project.projectId, projectName: project.projectName })
    window.location.href = '/welcome'
  }

  return (
    <>
      <div className="sidebar_header">
        <div className="sidebar">
          <div className="sidebar_header">
            <div>
              <div className="firstDivElement">
                <div className="mark"></div>
                <div className="dash"></div>
              </div>
              <div className="firstDivElement">
                <div className="mark"></div>
                <div className="dash"></div>
              </div>
            </div>
            <div className="projectus">PROJECTUS</div>
            <IconButton>
              <SearchIcon style={{ fill: "#878787" }} />
            </IconButton>
          </div>
          <div 
          onClick={e => {
            window.location.href = `/profile`
            setProfile(loggedUser)
            setProject({ projectId: "", projectName: "" })
          }}  className="profile_sidebar">
            {/* <Link to="/profile"> */}
              <IconButton>
                <Avatar style={{ width: "55px", height: "55px" }} src={loggedUser.avatar} />
              </IconButton>
              <div>
                <p className="sidebar_name">{loggedUser.firstname} {loggedUser.lastname}</p>
                <h5 className="product_name">{loggedUser.role}</h5>
              </div>
              <IconButton>
                <MoreHorizIcon style={{ fill: "#878787" }} />
              </IconButton>
            {/* </Link> */}

          </div>
          <div className="Task">
            <div className="completed_Task">
              <h1>{loggedUser.closedTasks.length}</h1>
              <h5 className="task_text">Completed Tasks</h5>
            </div>
            <div className="open_Task">
              <h1>{loggedUser.openedTasks.length}</h1>
              <h5 className="task_text">Open Tasks</h5>
            </div>

          </div>
          <div className="Menu_section">
            <div>
              <h4 className="menu">MENU</h4>
            </div>
            <div onClick={e => window.location.href = '/home'}> Home </div>
            <div> My Tasks </div>
            <div className="notifications">
              <div> Notfications  </div>
              {/* <p className="circle_yellow">
            <span>3</span>
            </p> */}
            </div>
          </div>
          <div className="Menu_projects">
            <div className="Menu_projects_d">
              <h4 className="project">PROJECTS</h4>
            </div>
            {projects.map((project: any) => (
              // <a href={project.projectName}>
              <div onClick={e => {
                window.location.href = `/${project.projectName}/${project._id}/task`
                setProject({ projectId: project.projectId, projectName: project.projectName })
                setProfile(preUser)
              }}> {project.projectName}</div>
              // </a>
            ))}
          </div>
          <div onClick={openProjectModal} className="addProject">+Add a Project</div>
          <div className="Team_projects">
            <div>
              <h4 className="team">TEAMS</h4>
            </div>

            {teams.map(team => (
              <div onClick={e =>{ 
              window.location.href = `/${projectid}/${team.teamName}/${team._id}`
              setTeamId(team._id)}} 
              className="backend">{team.teamName}
                {team.members.map(member => (
                  <IconButton>
                    <Avatar style={{ width: "25px", height: "25px" }} src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHZx41E6X-WX4Q7rru7Ut0tRUHgdkJn-qTDg&usqp=CAU" />
                  </IconButton>
                ))}
              </div>
            ))}

          </div>
          {projectid && <div onClick={openTeamModal} className="addTeam">+Add a Team</div>}
          <div className="sidebar_footer">
            <span>Invite your team</span> and start collaborating!
          </div>
        </div>


      </div>

      {projectModalIsOpen && <ProjectModalComp setIsOpen={setProjectIsOpen} closeModal={closeModal} />}
      {teamModalIsOpen && <TeamModalComp setIsOpen={setTeamIsOpen} closeModal={closeModal} />}
    </>

  );
}

export default Side;
