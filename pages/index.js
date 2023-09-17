import { Button } from "components/ui/button";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

 // Set this to false to only render on the client side, it seems to fix a window error thingy
const DynamicParticlesBg = dynamic(() => import("particles-bg"), {
  ssr: false, 
});

export default function Home() {
  const router = useRouter();

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "1rem",
    minHeight: "100vh",
    padding: "1rem",
    marginTop: "1rem",
  };

  const headingStyle = {
    fontSize: "6rem",
    textAlign: "center",
    paddingBottom: "2rem",
  };

  const descriptionStyle = {
    fontSize: "1.5rem",
    fontFamily: "'Times New Roman', serif",
    textAlign: "center",
    whiteSpace: "pre-wrap",
    maxWidth: "50rem",
  };

  const descriptionText =
    "Your one-stop shop for dynamic and educational content! Autolearnr revolutionizes the way you learn by providing interactive, engaging, teacher-like educational resources.";

  const buttonStyle = {
    fontSize: "2rem",
    padding: "2rem 3rem",
    backgroundColor: "transparent",
    color: "#000",
    border: "2px solid #000",
    borderRadius: "25px",
    cursor: "pointer",
    transition: "background-color 0.3s",
    marginTop: "4rem",
  };

  const buttonHoverStyle = {
    backgroundColor: "#000",
    color: "#fff",
  };

  return (
    <div style={containerStyle}>
      <h1 style={headingStyle} className="text-4xl font-bold">
        Autolearnr
      </h1>
      <p style={descriptionStyle} className="max-w-200px">
        {descriptionText}
      </p>
      <Button
        style={buttonStyle}
        onMouseEnter={(e) => e.target.classList.add("hovered")}
        onMouseLeave={(e) => e.target.classList.remove("hovered")}
        onClick={() => router.push("/application")}
      >
        Start
      </Button>
      <DynamicParticlesBg type="circle" bg={true} />
      <style jsx global>
        {`
          .hovered {
            background-color: #000 !important;
            color: #fff !important;
          }
          .button {
            background-color: transparent !important;
            color: #000 !important;
            border: 2px solid #000 !important;
          }
        `}
      </style>
    </div>
  );
}
