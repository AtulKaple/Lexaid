"use client";
import { useState } from "react";
import axios, { AxiosError } from "axios";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResponse("");

    try {
      const res = await axios.post(
        "https://lexaid.onrender.com/api/query",
        {
          prompt: prompt,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setResponse(res.data);
    } catch (err: AxiosError | any) {
      console.error(err);
      setError(err.message || "Error communicating with the backend");
    } finally {
      setLoading(false);
    }
  };

  //Format Output

  const formatText = (text: any) => {
    // Replace **...** with <b>...</b> for bold text
    const boldFormatted = text.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");

    // Replace single * with a bullet point
    const bulletFormatted = boldFormatted.replace(/(^|\s)\*(?=\s|$)/g, "<br>•");

    return bulletFormatted;
  };

  return (
    <div className=" flex flex-col gap-[5vw] bg-black items-center justify-center h-screen font-[family-name:var(--font-geist-sans)]">
      <div className=" flex gap-[2vw] ">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmit(e);
            }
          }}
          placeholder="write your prompt"
          className="text-black h-[5vw] p-[2vw] rounded-[20px] "
        />
        <button className="border p-[1vw] rounded-full w-[10vw] hover:bg-white hover:text-black " onClick={handleSubmit}>
          {loading ? "Loading..." : "Generate"}
        </button>
      </div>

      <div className=" w-[50%]  h-[25vw] border p-[2vw] rounded-[20px] overflow-auto ">
        {error && <p style={{ color: "red" }}>Error: {error}</p>}
        <div
          style={{ whiteSpace: "pre-wrap" }}
          dangerouslySetInnerHTML={{
            __html: formatText(response),
          }}
        ></div>
      </div>
    </div>
  );
}
