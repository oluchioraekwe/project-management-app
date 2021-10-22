import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { Avatar, IconButton } from "@material-ui/core";
import SearchIcon from "@mui/icons-material/Search";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Navbar, ProjectNavbar, ProfileNavbar } from "./navbar";
import "./Side.css";
import { ModalComp } from "./Mod";
import MainContent from "./mainContent";
import { FilesPage } from "../filesPage/files";
import Password from "../ChangePassword/Password";
import TeamData from "../teams/teamsData";
//import Password from "../ChangePassword/Password"
// import Profile from "./profile";

function Side(props: any) {
  const path = props.location.pathname;

  const { userToken, projectname, projectid } = useParams() as any;
  let loggedUser: any;
  if (userToken) {
    console.log(userToken);
    const user = userToken.split("~").slice(1).join("~");
    const token = userToken.split("~")[0];
    loggedUser = JSON.parse(user);
    localStorage.setItem("token", token);
    localStorage.setItem("user", user);
  }
  loggedUser = JSON.parse(localStorage.getItem("user") as string);

  const [project, setProject] = useState<{
    projectId: string;
    projectName: string;
  }>({ projectId: "", projectName: "" });
  const [teamId, setTeamId] = useState("");
  const [profile, setProfile] = useState("");
  if (project) console.log(project, "project");
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
  const [teams, setTeams] = useState<ITeam[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log(token);
    fetch(`https://jaraaa.herokuapp.com/${props.projectId}/get-teams`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.msg || data.error) {
          console.log("Major:", data);
        } else {
          console.log(data.teams, "data");
          setTeams(data.teams);
        }
        // window.location.href = "/success"
      })
      .catch((err) => {
        console.log(err);
      });
  }, [project]);

  useEffect(() => {
    console.log("The id of a team: ", teamId);
  }, [teamId]);

  const [modalIsOpen, setIsOpen] = useState<boolean>(false);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  function openProject(e: any) {
    setProject({
      projectId: project.projectId,
      projectName: project.projectName,
    });
    window.location.href = "/welcome";
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
            onClick={(e) => {
              window.location.href = `/profile`;
              setProfile(loggedUser);
              setProject({ projectId: "", projectName: "" });
            }}
            className="profile_sidebar"
          >
            {/* <Link to="/profile"> */}
            <IconButton>
              <Avatar
                style={{ width: "55px", height: "55px" }}
                src={loggedUser.avatar}
              />
            </IconButton>
            <div>
              <p className="sidebar_name">
                {loggedUser.firstname} {loggedUser.lastname}
              </p>
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
            <div onClick={(e) => (window.location.href = "/home")}> Home </div>
            <div> My Tasks </div>
            <div className="notifications">
              <div> Notfications </div>
            </div>
          </div>
          <div className="Menu_projects">
            <div className="Menu_projects_d">
              <h4 className="project">PROJECTS</h4>
            </div>
            {loggedUser.projects.map((project: any) => (
              // <a href={project.projectName}>
              <div
                onClick={(e) => {
                  window.location.href = `/${project.projectName}/${project.projectId}/task`;
                  setProject({
                    projectId: project.projectId,
                    projectName: project.projectName,
                  });
                  setProfile("");
                }}
              >
                {" "}
                {project.projectName}
              </div>
              // </a>
            ))}
          </div>
          <div onClick={openModal} className="addProject">
            +Add a Project
          </div>
          <div className="Team_projects">
            <div>
              <h4 className="team">TEAMS</h4>
            </div>

            {teams.map((team) => (
              <div
                onClick={(e) => {
                  window.location.href = `/${projectid}/${team.teamName}/${team._id}`;
                  setTeamId(team._id);
                }}
                className="backend"
              >
                {team.teamName}
                {team.members.map((member) => (
                  <IconButton>
                    <Avatar
                      style={{ width: "25px", height: "25px" }}
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHZx41E6X-WX4Q7rru7Ut0tRUHgdkJn-qTDg&usqp=CAU"
                    />
                  </IconButton>
                ))}
              </div>
            ))}
          </div>
          {projectid && (
            <div onClick={openModal} className="addTeam">
              +Add a Team
            </div>
          )}
          <div className="sidebar_footer">
            <span>Invite your team</span> and start collaborating!
          </div>
        </div>
      </div>

      {modalIsOpen && (
        <ModalComp setIsOpen={setIsOpen} closeModal={closeModal} />
      )}
    </>
  );
}

export default Side;

export function Team() {
  const teams: any[] = [];
  let team = teams.map((team: any) => (
    <TeamData
      key={team._id}
      firstname={team.firstname}
      lastname={team.lastname}
      role={team.role}
      tasksAssigned={team.tasksAssigned}
      img={team.img}
    />
  ));
  return (
    <div className="main-page">
      <div className="members-container">
        <h1>Members </h1>
        <h1>{team.length}</h1>
      </div>
      {team}
    </div>
  );
}
