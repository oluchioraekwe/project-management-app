import TeamData from "./teamsData";
import "./Team.css";
import { useEffect, useState } from "react";
import PersonalData from "./personalData";
import { InviteModalComp, TeamMemberModalComp } from "../Sidebar/Mod";
//import { getTeams } from "./teams/teamsMembers";

function Team(props: any) {
  interface teamMember {
    _id: string;
    avatar: string;
    firstname: string;
    lastname: string;
    role: string;
    location: string;
    closedTasks: any[];
    openedTasks: any[];
  }

  let taskAssiged;

  const [teams, setTeams] = useState<teamMember[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log(token);
    fetch(`https://jaraaa.herokuapp.com/${props.team.teamid}/getuserdetails`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.msg || data.error) {
          //console.log("Major:", data);
        } else {
          setTeams(data.data);
        }
        // window.location.href = "/success"
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const [memberDetails, setMember] = useState<teamMember>({
    _id: "",
    avatar: "",
    firstname: "",
    lastname: "",
    role: "",
    location: "",
    closedTasks: [],
    openedTasks: [],
  });

  function setMemberDetails(team: any) {
    setMember(team);
  }

  let team = teams.map((team) => (
    <TeamData
      key={team._id}
      setMemberD={() => {
        setMemberDetails(team);
      }}
      team={team}
      firstname={team.firstname}
      lastname={team.lastname}
      role={team.role ? team.role : "No role"}
      tasksAssigned={team.closedTasks.length + team.openedTasks.length}
      img={team.avatar ? team.avatar : `/Avatar.png`}
    />
  ));
  console.log("team roles", teams);

  const [isOpen, setIsOpen] = useState(false);
  const [closeModal, setCloseModal] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function handleCloseModal() {
    setIsOpen(false);
  }

  return (
    <div className="main">
      <div className="main-page">
        <div className="header_members">
          <h1 style={{ marginRight: "1rem" }}>
            {teams.length > 1 ? "Members" : "Member"}
          </h1>
          <h1>{team.length}</h1>
          <button onClick={openModal} className="member-add-btn">
            Add member
          </button>
        </div>
        <div className="members-container">{team}</div>
      </div>
      <div className="second-main-page">
        {memberDetails.firstname ? (
          <PersonalData member={memberDetails} />
        ) : (
          <p>Click on a member to see details</p>
        )}
      </div>

      {isOpen && (
        <TeamMemberModalComp
          closeModal={handleCloseModal}
          collaborators={props.collaborators}
          team={props.team}
        />
      )}
    </div>
  );
}
export default Team;
