import { BaseEntityCustom } from "./base.entity";
import { MediaEntity } from "./media.entity";

export interface UserEntity extends BaseEntityCustom {
  name?: string;
  username?: string;
  status?: string;
  role?: string;
  email?: string;
  dob?: Date;
  phoneNumber?: string;
  password?: string;
  oauthProvider?: string; // google, facebook, github, etc.
  oauthId?: string; // Unique ID from OAuth provider
  firebaseUid?: string; // Firebase UID
  photoUrl?: string; // Profile photo URL from Firebase
  authMethod?: string; // email_password, oauth, phone_otp
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  avatarId?: string;
  avatar: MediaEntity; // Avatar media
}
