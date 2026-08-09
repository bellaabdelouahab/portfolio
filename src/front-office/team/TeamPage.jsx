import { useEffect, useRef, useCallback, useState } from "react";
import Draggable from "react-draggable";
import "./TeamPage.scss";
import SEO from "../../shared/ui/SEO";

const teamMembers = [
  {
    name: "Abdelouahab Bella",
    role: "Jack of all trades & You are in my portfolio",
    position: {
      x: window.innerWidth * 0.5 - 420,
      y: window.innerHeight * 0.1 - 80,
    },
    // Served from our own public/ rather than fetched from github.com: the
    // remote copy is the same file, but going out to GitHub for it added a
    // third-party round trip and broke whenever that host was unreachable.
    image: "/profile-photo.jpg",
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
    role: "Master of web scraping and cybersecurity",
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
    const lines = document.querySelectorAll(".team-line");
    lines.forEach((line) => line.remove());

    cards.forEach((card, index) => {
      cards.forEach((nextCard, nextIndex) => {
        if (index !== nextIndex) {
          const line = document.createElement("div");
          // `team-line` is the query hook only — the appearance is the utility
          // list beside it. Renamed from the old global `.line`, which also
          // matched the divider divs on the certificates page and leaked this
          // page's styling onto them once /team had been visited.
          line.className =
            "team-line pointer-events-none absolute z-0 h-[0.2px] bg-[#69ca62] opacity-30";
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
    <div className="relative h-full w-full overflow-hidden p-5" ref={containerRef}>
      <SEO
        title="My Team"
        description="The collaborators and development team Abdelouahab Bella works with on software engineering and data analytics projects."
        keywords="Abdelouahab Bella team, development collaborators, software engineering team Morocco"
      />
      {teamMembers.map((member, index) => (
        <Draggable
          key={index}
          onDrag={drawLines}
          onStop={handleStop}
          defaultPosition={member.position}
        >
          <div
            // `peer` pairs with the info card's `peer-hover:` below — Tailwind's
            // rendering of the old `.team-card:hover ~ .info-card` selector.
            // `team-card` survives as the querySelectorAll hook for drawLines.
            className="peer team-card relative z-5 m-3.25 h-50 w-50 cursor-pointer select-none overflow-visible bg-page transition-transform duration-300 ease-standard hover:scale-105"
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
            <h3 className="absolute bottom-2.5 left-2.5 leading-snug text-ink">
              {member.name}
            </h3>
          </div>
        </Draggable>
      ))}
      {/* Parked just below the container and faded out; hovering any card above
          slides it up into view. Both properties animate over 1s. */}
      <div className="absolute -bottom-[10%] left-1/2 z-100 h-[10%] w-full -translate-x-1/2 bg-[#1a1a1a] p-5 text-center font-[Arial,sans-serif] text-base leading-normal text-ink-strong opacity-0 shadow-md transition-[bottom,opacity] duration-1000 ease-in-out peer-hover:bottom-0 peer-hover:opacity-100">
        {(
          <>
            <p className="leading-normal">{hoveredMember.name} is a {hoveredMember.role}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default Team;
