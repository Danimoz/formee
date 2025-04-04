import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request): Promise<Response> {
  const { name, email, password } = await request.json();
  if (!name || !email || !password) {
    return new Response("Missing required fields", { status: 400 });
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });
  if (existingUser) {
    return Response.json({ error: true, errorMsg: "User already exists" }, { status: 409 });
  }
  
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
      select: { id: true, name: true, email: true },
    });
    return Response.json(user, { status: 201 });
  } catch (err) {
    console.error("Error creating user:", err);
    return Response.json({ error: true, errorMsg: 'An error Occured, Try again later' }, { status: 500 })
  }
}