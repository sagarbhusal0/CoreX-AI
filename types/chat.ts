export interface Chat {
    role: "user" | "model";
    parts: string;
    image?: string | null;
} 