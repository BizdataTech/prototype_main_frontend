import { z } from "zod";

const signupSchema = z
  .object({
    username: z.string().nonempty("Field required"),
    email: z.string().email("Enter valid email").nonempty("Field required"),
    password: z
      .string()
      .min(6, "Min 6 chars required")
      .nonempty("Field required"),
    confirm_password: z.string().nonempty("Field required"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Invalid password",
    path: ["confirm_password"],
  });

export default signupSchema;
