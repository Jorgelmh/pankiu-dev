export default interface NotificationBar{
    key: number,
    username: string,
    id: number,
    accept: (id: number) => Promise<void>
}