"use server";
import { redirect } from 'next/navigation';

export default function CalenderRedirectPage() {
  // Redirect legacy /calender route to the corrected /calendar route
  redirect('/calendar');
}