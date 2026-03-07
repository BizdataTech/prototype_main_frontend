import { z } from "zod";

const loginSchema = z.object({
  email: z.string().nonempty("email required").email("invalid email id"),
  password: z.string().nonempty("password required"),
});

export default loginSchema;
