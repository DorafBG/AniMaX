import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });
  
  // Supprimer le cookie
  response.cookies.delete("userId");
  
  return response;
}
