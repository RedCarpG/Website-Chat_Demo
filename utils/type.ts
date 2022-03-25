
import { AvatarType } from "./avatar";
import { FieldValue } from "firebase/firestore";

import { User } from "firebase/auth";

export interface UserType extends  User {}

export interface UserProfileType {
    userName: string;
    userAvatar: AvatarType;
}
export interface MessageType {
    text: string;
    createdAt: FieldValue;
    uid: string;
}

interface SingInMethod {
    loginMethod: "google" | "github"
}