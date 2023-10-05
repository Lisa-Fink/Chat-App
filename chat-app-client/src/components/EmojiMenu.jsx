import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "../styles/Emojis.css";

function EmojiMenu({ addEmoji, messageID, cancel }) {
  const [hoverEmojiName, setHoverEmojiName] = useState("");
  const [emojiNamePosition, setEmojiNamePosition] = useState({
    top: 0,
    left: 0,
  });

  useEffect(() => {
    document.addEventListener("mouseup", (e) => {
      // close emojis when clicking off the emoji menu
      if (
        !e.target ||
        !e.target.parentElement ||
        (e.target.id !== "emojis" && e.target.parentElement.id !== "emojis")
      ) {
        cancel();
      }
    });

    return () => {
      document.removeEventListener("mouseup", cancel);
    };
  }, []);

  const handleMouseEnter = (e, emojiName) => {
    setHoverEmojiName(emojiName);
    setEmojiNamePosition({
      top: e.clientY + 20 + "px",
      left: e.clientX + 20 + "px",
    });
  };

  const handleMouseLeave = () => {
    setHoverEmojiName("");
  };

  const emojis = useSelector((state) => state.emojis.emojis);
  const emojiMenu = emojis.map((emoji) => (
    <button
      className="select-btn active-btn"
      key={emoji.emojiID}
      onMouseEnter={(e) => handleMouseEnter(e, emoji.emojiName)}
      onMouseLeave={handleMouseLeave}
      onClick={() => addEmoji(emoji.emojiID, messageID, emoji.emojiCode)}
    >
      {emoji.emojiCode}
    </button>
  ));
  return (
    <div id="emojis">
      {emojiMenu}
      {hoverEmojiName && (
        <div className="emoji-hover" style={emojiNamePosition}>
          {hoverEmojiName}
        </div>
      )}
    </div>
  );
}

export default EmojiMenu;
