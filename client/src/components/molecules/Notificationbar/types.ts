export default interface NotificationBar{
    id: number,
    username: string,
    accept: (id: number) => Promise<void>
}