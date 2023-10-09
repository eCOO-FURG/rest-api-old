import { createTransport } from "nodemailer";
import { env } from "../env";

const transporter = createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
});

export async function mail(address: string) {
  transporter.sendMail(
    {
      from: "test@example.org",
      to: address,
      html: "<h1>Hello world?</h1>",
    },
    (err) => console.log(err?.message)
  );
}
