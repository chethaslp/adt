import {OAuth2Client} from "google-auth-library"

import { db } from "@/components/fb/config";
import { doc, getDoc, collection, setDoc, getDocs, query, where, getFirestore} from "firebase/firestore";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
      return NextResponse.json(
        { msg: 'Missing required arguments.' },
        { status: 400 }
      );
  }