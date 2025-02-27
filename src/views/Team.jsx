import { useEffect, useRef, useCallback, useState } from "react";
import Draggable from "react-draggable";
import "./Team.scss";

const teamMembers = [
  {
    name: "Abdelouahab Bella",
    role: "Jack of all trades",
    position: {
      x: window.innerWidth * 0.5 - 120,
      y: window.innerHeight * 0.1 - 80,
    },
    image:
      "https://github.com/bellaabdelouahab/portfolio/blob/master/public/Personal%20Picture.jpg?raw=true",
  },
  {
    name: "Boujrada Yassine",
    role: "Software Engineer & Web scrapping expert",
    position: {
      x: window.innerWidth * 0.3 - 120,
      y: window.innerHeight * 0.1 - 80,
    },
    image: "/src/assets/images/yassin.png",
  },
  {
    name: "Mike Johnson",
    role: "Manager",
    position: {
      x: window.innerWidth * 0.5 - 120,
      y: window.innerHeight * 0.1 - 80,
    },
    image: "path/to/mike-johnson.jpg",
  },
  // Add more team members with their positions and images as needed
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
      drag and drop to see info about him
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
              backgroundSize: "60%",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
            onMouseEnter={() => handleMouseEnter(member)}
            onMouseLeave={handleMouseLeave}
          >
            <div className="bb"></div>
            <h3>{member.name}</h3>
            <p>{member.role}</p>
          </div>
        </Draggable>
      ))}
      <div className="info-card">
        {(
          <>
            <p>Additional information about {hoveredMember.name}.</p>
          </>
        )}
      </div>
    </div>
  );
};

export default Team;
