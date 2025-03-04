import { useEffect, useRef, useCallback, useState } from "react";
import Draggable from "react-draggable";
import "./Team.scss";

const teamMembers = [
  {
    name: "Abdelouahab Bella",
    role: "Jack of all trades",
    position: {
      x: window.innerWidth * 0.5 - 420,
      y: window.innerHeight * 0.1 - 80,
    },
    image:
      "https://github.com/bellaabdelouahab/portfolio/blob/master/public/Personal%20Picture.jpg?raw=true",
  },
  {
    name: "Yassir Loukilia",
    role: "Software Engineer & Frontend Specialist",
    position: {
      x: window.innerWidth * 0.3 - 320,
      y: window.innerHeight * 0.1 + 80,
    },
    image: "https://avatars.githubusercontent.com/u/127755141?v=4",
  },
  {
    name: "Yassine Boujrada",
    role: "Manager",
    position: {
      x: window.innerWidth * 0.5 - 120,
      y: window.innerHeight * 0.1 + 50,
    },
    image: "yassine-pic.png",
  },
];

console.log(teamMembers);


const Team = () => {
  const containerRef = useRef(null);
  const [hoveredMember, setHoveredMember] = useState(teamMembers[0]);

  const drawLines = useCallback(() => {
    const cards = document.querySelectorAll(".team-card");
    const container = containerRef.current;
    const lines = document.querySelectorAll(".line");
    lines.forEach((line) => line.remove());

    cards.forEach((card, index) => {
      cards.forEach((nextCard, nextIndex) => {
        if (index !== nextIndex) {
          const line = document.createElement("div");
          line.className = "line";
          container.appendChild(line);

          const cardRect = card.getBoundingClientRect();
          const nextCardRect = nextCard.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();

          const x1 = cardRect.left + cardRect.width / 2 - containerRect.left;
          const y1 = cardRect.top + cardRect.height / 2 - containerRect.top;
          const x2 =
            nextCardRect.left + nextCardRect.width / 2 - containerRect.left;
          const y2 =
            nextCardRect.top + nextCardRect.height / 2 - containerRect.top;

          const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
          const angle = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;

          line.style.width = `${length}px`;
          line.style.transform = `rotate(${angle}deg)`;
          line.style.left = `${x1}px`;
          line.style.top = `${y1}px`;
          line.style.transformOrigin = "0 0"; // Ensure the line rotates around its starting point
        }
      });
    });
  }, []);

  useEffect(() => {
    drawLines();
    const intervalId = setInterval(drawLines, 10); // Draw lines every 10ms
    window.addEventListener("resize", drawLines);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("resize", drawLines);
    };
  }, [drawLines]);

  const handleStop = () => {
    setTimeout(drawLines, 3); // Ensure lines are drawn after draggable animation completes
  };

  const handleMouseEnter = (member) => {
    setHoveredMember(member);
  };

  const handleMouseLeave = () => {
    // setHoveredMember(null);
  };

  return (
    <div className="team-container" ref={containerRef}>
      {teamMembers.map((member, index) => (
        <Draggable
          key={index}
          onDrag={drawLines}
          onStop={handleStop}
          defaultPosition={member.position}
        >
          <div
            className="team-card"
            style={{
              userSelect: "none",
              backgroundImage: `url(${member.image})`,
              borderRadius: "50px",
              backgroundSize: "60%",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
            onMouseEnter={() => handleMouseEnter(member)}
            onMouseLeave={handleMouseLeave}
            
          >
            <div className="bb"></div>
            <h3 style={{
              color: "#aaa",
            }}>{member.name}</h3>
          </div>
        </Draggable>
      ))}
      <div className="info-card">
        {(
          <>
            <p>{hoveredMember.name} is a {hoveredMember.role}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default Team;
