import { Mood } from 'interfaces/entities/Patient'

export default interface Props{
    mood: Mood,
    imageUrl: string,
    handleClick: (mood: Mood) => Promise<void>
}