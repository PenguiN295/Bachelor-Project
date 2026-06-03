export default interface UserResponse {
    id: string;
    username: string;
    photo?: string;
    role?: string;
    isBanned?: boolean;
}
