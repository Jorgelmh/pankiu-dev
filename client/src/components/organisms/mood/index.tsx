import Title from "components/atoms/title";
import { MarginButton, MoodSelect } from "components/organisms/mood/styles";
import { Mood } from 'interfaces/entities/Patient'
import MoodButton from "components/atoms/mood"

const MoodLayout: React.FC = () => {

  const handleClick = async (newMood: Mood) => {
    
    /* Ajax request options */
    const options: RequestInit = {
      method: "PUT", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        "token": String(localStorage.getItem('token'))
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify({ mood: newMood })
    };

    /* Send a request to change the mood in the db */
    const response = await fetch('/sessions/changemood', options)
    const data = await response.json()

    if(!data.ok)
      alert(data.message)
    else
      localStorage.setItem('token', data.token)
  }

  //TODO find appropiate images for each mood associated to MoodButton components
  return (
    <>
      {/* Mood select contains all the styles for the emojis. And MarginButtom contains all the styles for the border */}
      <Title margin="20px 0px 0px 30px">Moods</Title>
      <MoodSelect>
        <MarginButton>
          <MoodButton imageUrl="img\001-shy 1.svg" handleClick={handleClick} 
          mood={Mood.Happy} />
        </MarginButton>
        <MarginButton>
          <MoodButton imageUrl="img\006-grin 1.svg" handleClick={handleClick} 
          mood={Mood.Normal} />
        </MarginButton>
        <MarginButton>
          <MoodButton imageUrl="img\021-happy 1.svg" handleClick={handleClick} 
          mood={Mood.Anxious} />
        </MarginButton>
      </MoodSelect>
      <MoodSelect>
        <MarginButton>
          <MoodButton imageUrl="img\039-crying 1.svg" handleClick={handleClick} 
          mood={Mood.Lonely} />
        </MarginButton>
        <MarginButton>
          <MoodButton imageUrl="img\047-hardcrying 1.svg" handleClick={handleClick} 
          mood={Mood.Stressed} />
        </MarginButton>
        <MarginButton>
          <MoodButton imageUrl="img\022-disappointed 2.svg" handleClick={handleClick}
          mood={Mood.Depressed}/>
        </MarginButton>
      </MoodSelect>
    </>
  );
};

export default MoodLayout;
