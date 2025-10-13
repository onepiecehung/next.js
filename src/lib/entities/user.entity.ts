import { BaseEntityCustom } from "./base.entity";
import { Media } from "./media.entity";

export interface User extends BaseEntityCustom {
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
  avatar?: Media; // Avatar media
}
