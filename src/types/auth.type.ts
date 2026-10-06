export interface ILoginResponse {
    accessToken: string;
    user: {
        id: string;
        name: string;
        email: string;
        emailVerified: boolean;
        image: string;
        createdAt: string;
        updatedAt: string;
        role: string;
        status: string;
        needsPasswordChange: boolean;
        isDeleted: boolean;
        deletedAt: string | null;
    };
}