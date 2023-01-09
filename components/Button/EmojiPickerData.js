import EmojiPicker, { EmojiStyle } from "emoji-picker-react";
import { memo } from "react";

const EmojiPickerData = ({ handleChangeComment, comment }) => {
  console.log("re-render");
  return (
    <>
      <EmojiPicker
        onEmojiClick={(emoji) => {
          handleChangeComment(comment + " " + emoji.emoji);
        }}
        emojiStyle={EmojiStyle.FACEBOOK}
        lazyLoadEmojis={true}
        style={{
          fontSize: "2rem",
        }}
      />
    </>
  );
};
export default memo(EmojiPickerData);
