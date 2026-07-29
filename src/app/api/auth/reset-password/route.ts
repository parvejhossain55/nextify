import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  const { token, password } = await request.json();

  const resetToken = await prisma.resetToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!resetToken || resetToken.expiresAt < new Date()) {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { id: resetToken.user.id },
    data: { password: hashedPassword },
  });

  await prisma.resetToken.delete({ where: { token } });

  return NextResponse.json({ message: "Password reset successful" });
}
