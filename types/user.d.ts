import { Claims } from "@auth0/nextjs-auth0";

export default interface UserProfileWithRole extends Claims {
  "http://demo-day-system.com/roles": string[];
}
