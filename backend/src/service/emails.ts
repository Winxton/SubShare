import { Resend } from "resend";
const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const APP_URL = process.env.REACT_APP_URL;
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Sends an email to the recipient when they are invited to a group.
 */
export async function sendInvitedToGroupEmail(
  senderName: string,
  recipient: string,
  groupName: string
) {
  return resend.emails.send({
    from: "hello@subshare.app",
    to: recipient,
    subject: `Subshare Invitation to ${groupName}`,
    html: `${senderName} has invited you to join his ${groupName} group. \nHead over to the <a href="${APP_URL}">subshare app</a> to check it out!`,
  });
}

/* TODO: Add subscription cancellation date */

export async function sendDisbandToGroupEmail(
  senderName: string,
  recipient: string,
  groupName: string
) {
  return resend.emails.send({
    from: "hello@subshare.app",
    to: recipient,
    subject: `Subshare ${groupName} group disbandment`,
    html: `${senderName} has decided to disband his ${groupName} group. \n You still have access to the ${groupName} subscription until .`,
  });
}

export async function sendMemberBalanceEmail(
  recipient: string,
  groupName: string,
  subscriptionCost: number,
  memberBalance: number
) {
  return resend.emails.send({
    from: "hello@subshare.app",
    to: recipient,
    subject: `Balance Update : Amount Owed for ${groupName}`,
    html: `You owe ${subscriptionCost} for the monthly subscription. \nAs a result, your balance owed for ${groupName} has been updated to ${memberBalance}. \nHead over to the <a href="${APP_URL}">subshare app</a> to check it out!`,
  });
}
