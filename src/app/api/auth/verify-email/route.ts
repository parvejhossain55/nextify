import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Invalid token" }, { status: 400 });
  }

  const user = await prisma.user.findFirst({
    where: { resetTokens: { some: { token } } },
  });

  if (!user) {
    return NextResponse.json({ error: "Invalid token" }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerified: new Date() },
  });

  await prisma.resetToken.deleteMany({ where: { token } });

  return NextResponse.redirect(new URL("/login?verified=true", request.url));
}
