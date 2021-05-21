import Title from "components/atoms/title";
import { Button } from "@progress/kendo-react-buttons";
import { MarginButton, MoodSelect } from "components/organisms/mood/styles";

const MoodLayout: React.FC = () => {
  return (
    <>
      {/* Mood select contains all the styles for the emojis. And MarginButtom contains all the styles for the border */}
      <Title margin="20px 0px 0px 30px">Moods</Title>
      <MoodSelect>
        <MarginButton>
          <Button imageUrl="img\001-shy 1.svg" look="flat" />
        </MarginButton>
        <MarginButton>
          <Button imageUrl="img\006-grin 1.svg" look="flat" />
        </MarginButton>
        <MarginButton>
          <Button imageUrl="img\021-happy 1.svg" look="flat" />
        </MarginButton>
      </MoodSelect>
      <MoodSelect>
        <MarginButton>
          <Button imageUrl="img\039-crying 1.svg" look="flat" />
        </MarginButton>
        <MarginButton>
          <Button imageUrl="img\047-hardcrying 1.svg" look="flat" />
        </MarginButton>
        <MarginButton>
          <Button imageUrl="img\022-disappointed 2.svg" look="flat" />
        </MarginButton>
      </MoodSelect>
      <Title margin="0px 0px 0px 30px">Other Moods</Title>
      <MoodSelect>
        <MarginButton>
          <Button imageUrl="img\041-flush 1.svg" look="flat" />
        </MarginButton>
        <MarginButton>
          <Button imageUrl="img\007-sick 1.svg" look="flat" />
        </MarginButton>
        <MarginButton>
          <Button imageUrl="img\005-starstruck 1.svg" look="flat" />
        </MarginButton>
      </MoodSelect>
      <MoodSelect>
        <MarginButton>
          <Button imageUrl="img\015-angry 1.svg" look="flat" />
        </MarginButton>
        <MarginButton>
          <Button imageUrl="img\010-disappointment 1.svg" look="flat" />
        </MarginButton>
        <MarginButton>
          <Button imageUrl="img\033-angry 2.svg" look="flat" />
        </MarginButton>
      </MoodSelect>
    </>
  );
};

export default MoodLayout;
