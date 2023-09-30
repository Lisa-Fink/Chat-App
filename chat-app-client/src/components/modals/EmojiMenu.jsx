import React, { useState } from "react";
import { useSelector } from "react-redux";
import "../../styles/Emojis.css";

function EmojiMenu({ addEmoji, messageID }) {
  const [hoverEmojiName, setHoverEmojiName] = useState("");
  const [emojiNamePosition, setEmojiNamePosition] = useState({
    top: 0,
    left: 0,
  });

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
      onClick={() => addEmoji(emoji.emojiID, messageID)}
    >
      {emoji.emojiCode}
    </button>
  ));
  return (
    <div id="emojis">
      {emojiMenu}
      {hoverEmojiName && (
        <div className="tooltip" style={emojiNamePosition}>
          {hoverEmojiName}
        </div>
      )}
    </div>
  );
}

export default EmojiMenu;
