import Props from './types'
import Text from 'components/atoms/text'

const Mood: React.FC<Props> = (props) => {
    return (
        <>
            <button onClick={() => props.handleClick(props.mood)}>
                <img src={props.imageUrl} />
                <Text> {props.mood} </Text>
            </button>
        </>
    )
}

export default Mood