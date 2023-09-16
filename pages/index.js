import axios from "axios";

export default function Home() {
    const text = `
      <speak>
        Code testing is working pretty well so far,
        lets see how it goes right now.<mark name="stop1"/>The code should have added a stamp here <mark name="stop2"/>
        Damn, brother.
      </speak>
    `;

    async function handleClick() {
        try {
            const response = await axios.post("/api/synthesizeAudio", { ssmlText: text });
            console.log("Audio content received from the server.");
        } catch (error) {
            console.error("Error:", error);
        }
    }
    return (
        <div>
            <button onClick={handleClick}>Generate</button>
        </div>
    );
}
