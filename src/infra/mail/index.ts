import { createTransport } from "nodemailer";

const transporter = createTransport({
  host: "localhost",
  port: 2525,
});

export async function mail() {
  transporter.sendMail(
    {
      to: "test@example.net",
      from: "test@example.org",
      html: "<h1>Hello world?</h1>",
    },
    (err) => console.log(err?.message)
  );
}

mail();
