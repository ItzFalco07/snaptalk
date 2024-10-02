import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { useTheme } from './theme-provider' // Assuming you are using next-themes for theme management


const EmojiPicker = ({Emoji, setInput, Input}) => {
  const { theme } = useTheme();

  return (
    <>
    {Emoji ? 
    <div className="absolute bottom-[5em] right-[6em] no-select">
      <Picker data={data} theme={theme} onEmojiSelect={(emoji)=> setInput(Input + emoji.native)} />
    </div>
     : ''}
    </>
  );
};

export default EmojiPicker;