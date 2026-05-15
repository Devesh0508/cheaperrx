"use server";

import { redirect } from "next/navigation";

export async function sendContactMessage(formData: FormData) {
  const firstName = (formData.get("first_name") as string)?.trim();
  const lastName = (formData.get("last_name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const subject = (formData.get("subject") as string)?.trim();
  const message = (formData.get("message") as string)?.trim();

  if (!firstName || !email || !message) return;

  const subjectLabels: Record<string, string> = {
    general: "General question",
    price_error: "Price error report",
    billing: "Billing / subscription",
    missing_drug: "Missing medication",
    missing_pharmacy: "Missing pharmacy",
    partnership: "Partnership / business",
    privacy: "Privacy request",
    other: "Other",
  };

  const subjectLine = `[CheaperRx Contact] ${subjectLabels[subject] ?? subject} — from ${firstName} ${lastName}`.trim();

  // Send via mailto — in production replace with Resend/SendGrid API call
  // For now we log and redirect to a success page
  console.log("Contact form submission:", {
    name: `${firstName} ${lastName}`,
    email,
    subject: subjectLine,
    message,
  });

  // If you add an email service (Resend, SendGrid, etc.), call it here:
  // await resend.emails.send({
  //   from: "noreply@cheaperrx.ca",
  //   to: "help@cheaperrx.ca",
  //   replyTo: email,
  //   subject: subjectLine,
  //   text: `From: ${firstName} ${lastName} <${email}>\n\n${message}`,
  // });

  redirect("/contact/success");
}
